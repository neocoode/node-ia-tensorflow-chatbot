import { getModel } from '@controllers/trainController';
import { TrainingData } from '@db/md/trainingData';
import * as tf from '@tensorflow/tfjs-node';
import { padSequences } from '@utils/common';
import { Request, Response } from 'express';

// Função para prever a resposta com o TensorFlow e buscar no MongoDB
export const predictChatResponse = async (req: Request, res: Response) => {
  try {
    const model: any = await getModel();
    const { input } = req.body; // Entrada do usuário

    // Processar a entrada do usuário
    const inputSequence = input.split(' ').map((word: string) => word.length);
    const maxLength = 10;
    const paddedInputSequence = padSequences([inputSequence], maxLength);
    const inputTensor = tf.tensor2d(paddedInputSequence, [1, maxLength]);

    // Fazer a previsão com o modelo
    const prediction = (model.predict(inputTensor) as tf.Tensor).argMax(-1).dataSync()[0];

    // Buscar o ID do MongoDB correspondente
    const uniqueLabels = await TrainingData.find().distinct('_id');
    const predictedId = uniqueLabels[prediction];

    // Buscar a resposta no MongoDB usando o ID previsto
    const trainingData = await TrainingData.findById(predictedId);

    if (!trainingData) {
      return res.status(404).json({ message: 'Dados de treinamento não encontrados.' });
    }

    // Retornar a resposta para o cliente
    const response =
      trainingData.responses[Math.floor(Math.random() * trainingData.responses.length)];
    res.json({ response });
  } catch (error) {
    console.error('Erro durante a previsão:', error);
    res.status(500).json({ message: 'Erro durante a previsão.', error });
  }
};
