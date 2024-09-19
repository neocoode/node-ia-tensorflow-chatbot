import { getModel } from '@controllers/trainController';
import { TrainingData } from '@db/md/trainingData'; // Modelo do MongoDB
import * as tf from '@tensorflow/tfjs-node';
import { Request, Response } from 'express';
import Fuse from 'fuse.js'; // Importando o Fuse.js

// Função auxiliar para buscar a resposta no MongoDB com base no predictedIndex
const getResponseFromMongo = async (predictedIndex: number) => {
  try {
    console.log(`Buscando resposta para predictedIndex: ${predictedIndex}`);
    const trainingData = await TrainingData.findOne({ predictedIndex });
    if (trainingData) {
      return trainingData;
    }
    console.log('Nenhuma resposta encontrada para o predictedIndex fornecido.');
    return null;
  } catch (error) {
    console.error('Erro ao buscar a resposta no MongoDB:', error);
    throw new Error('Erro ao buscar dados de resposta.');
  }
};

// Função para configurar a pesquisa fuzzy com Fuse.js
const setupFuzzySearch = (trainingData: any[]) => {
  const options = {
    includeScore: true,
    keys: ['keys'],
  };
  return new Fuse(trainingData, options);
};

// Função para transmitir dados por meio de streaming
const streamResponse = (res: Response, data: any) => {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
};

export const chatStream = async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const { pergunta } = req.body;
  console.log(`Pergunta recebida: ${pergunta}`);

  const model = await getModel();
  if (!model) {
    return res.status(400).json({ error: 'Model not trained yet.' });
  }

  const tokenizedInput = [pergunta.split(' ').map((word: any[]) => word.length)];
  const inputTensor = tf.tensor2d(tokenizedInput);
  console.log(`Entrada tokenizada: ${JSON.stringify(tokenizedInput)}`);

  try {
    // Realizar previsão com o modelo
    const prediction = model.predict(inputTensor) as tf.Tensor;
    const predictedIndex = prediction.argMax(-1).dataSync()[0];
    const selectedResponse = await getResponseFromMongo(predictedIndex + 1);

    if (!selectedResponse) {
      return res.status(404).json({ message: 'Nenhuma resposta encontrada.' });
    }

    // Realizar a busca fuzzy para encontrar respostas baseadas nas chaves
    const trainingData = await TrainingData.find();
    const fuse = setupFuzzySearch(trainingData);
    const fuzzyResult = fuse.search(pergunta);

    // Se a busca fuzzy retornar algum resultado, usá-lo para responder
    if (fuzzyResult.length > 0) {
      const bestMatch = fuzzyResult[0].item;

      // Enviar o "resume"
      streamResponse(res, { type: 'resume', text: bestMatch.resume });

      // Transmitir as respostas uma por uma
      for (const response of bestMatch.responses) {
        streamResponse(res, { type: 'response', text: response });
        await new Promise((resolve) => setTimeout(resolve, 500)); // Delay de 500ms para simular o envio por partes
      }

      // Transmitir os links
      if (bestMatch.links && bestMatch.links.length > 0) {
        streamResponse(res, { type: 'response', text: 'Links Úteis:' });
        for (const link of bestMatch.links) {
          streamResponse(res, { type: 'link', text: link.label, url: link.url });
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }
    } else {
      // Caso a busca fuzzy não retorne nada, utilizar a resposta prevista pelo modelo
      streamResponse(res, { type: 'resume', text: selectedResponse.resume });

      for (const response of selectedResponse.responses) {
        streamResponse(res, { type: 'response', text: response });
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      if (selectedResponse.links && selectedResponse.links.length > 0) {
        streamResponse(res, { type: 'response', text: 'Links Úteis:' });
        for (const link of selectedResponse.links) {
          streamResponse(res, { type: 'link', text: link.label, url: link.url });
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }
    }

    res.end(); // Encerrar a transmissão
  } catch (error) {
    console.error('Erro durante a previsão ou busca de resposta:', error);
    return res.status(500).json({ error: 'Erro ao processar a resposta.' });
  }
};
