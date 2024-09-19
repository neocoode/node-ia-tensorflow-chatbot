import * as tf from '@tensorflow/tfjs-node';
import { Request, Response } from 'express';

import { perguntas, respostas } from '@data/data'; // Corrigir import
import { convertToSequence, maxSequenceLength, padSequences, vocab } from '@utils/common';

// Variáveis globais para o modelo
let model: tf.Sequential;
let modelTrained = false;

// Função para treinar o modelo com LSTM e Embeddings
export const trainModel = async (req: Request, res: Response) => {
  const sequenciasPerguntas = convertToSequence(perguntas, vocab);
  const paddedSequences = padSequences(sequenciasPerguntas, maxSequenceLength);

  const inputTensor = tf.tensor2d(paddedSequences, [
    paddedSequences.length,
    paddedSequences[0].length,
  ]);
  const outputTensor = tf.oneHot(
    tf.tensor1d(Array.from(Array(perguntas.length).keys()), 'int32'),
    perguntas.length,
  );

  try {
    model = tf.sequential();

    // Camada de embedding
    model.add(
      tf.layers.embedding({
        inputDim: Object.keys(vocab).length + 1,
        outputDim: 16,
        inputLength: maxSequenceLength,
      }),
    );

    // Camada LSTM
    model.add(tf.layers.lstm({ units: 32, returnSequences: false }));

    // Camada de saída
    model.add(tf.layers.dense({ units: respostas.length, activation: 'softmax' }));

    model.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy', metrics: ['accuracy'] });

    await model.fit(inputTensor, outputTensor, { epochs: 500 });
    modelTrained = true;
    res.status(200).json({ message: 'Modelo treinado com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao treinar o modelo.' });
  }
};

// Exportar o modelo treinado
export const getModel = () => (modelTrained ? model : null);
