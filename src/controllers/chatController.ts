import * as tf from '@tensorflow/tfjs-node';
import { Request, Response } from 'express';

import { getModel } from '@controllers/trainController';
import { respostas } from '@data/data';
import { convertToSequence, maxSequenceLength, padSequences, vocab } from '@utils/common';

// Função para lidar com o chat e prever a resposta
export const handleChat = (req: Request, res: Response) => {
  const model = getModel();

  if (!model) {
    return res.status(400).json({ error: 'Modelo não treinado. Treine o modelo primeiro.' });
  }

  const { pergunta } = req.body;
  if (!pergunta) {
    return res.status(400).json({ error: 'Pergunta não fornecida.' });
  }

  // Tokenizar e converter a pergunta para uma sequência numérica
  const tokenizedInput = convertToSequence([pergunta], vocab);
  const paddedInput = padSequences(tokenizedInput, maxSequenceLength);
  const input = tf.tensor2d(paddedInput, [1, maxSequenceLength]);

  // Previsão
  try {
    const prediction = model.predict(input) as tf.Tensor;
    const predictedIndex = prediction.argMax(-1).dataSync()[0];
    const resposta = respostas[predictedIndex];
    res.json({ resposta });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao prever a resposta.' });
  }
};

export const handleChatStream = async (req: Request, res: Response) => {
  const model = getModel();

  if (!model) {
    res.status(400).json({ error: 'Modelo não treinado. Treine o modelo primeiro.' });
    return;
  }

  const { pergunta } = req.body;
  if (!pergunta) {
    res.status(400).json({ error: 'Pergunta não fornecida.' });
    return;
  }

  const tokenizedInput = convertToSequence([pergunta], vocab);
  const paddedInput = padSequences(tokenizedInput, maxSequenceLength);
  const input = tf.tensor2d(paddedInput, [1, maxSequenceLength]);

  try {
    const prediction = model.predict(input) as tf.Tensor;
    const predictedIndex = prediction.argMax(-1).dataSync()[0];
    const resposta = respostas[predictedIndex];

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');

    // Enviar a resposta palavra por palavra
    const palavras = resposta.split(' ');
    for (const palavra of palavras) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, 500)); // Delay para simular tempo de envio
      res.write(`${palavra} `);
    }
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao prever a resposta.' });
  }
};
