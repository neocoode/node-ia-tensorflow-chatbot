import * as tf from '@tensorflow/tfjs-node';

import { TrainingData } from '@db/md/trainingData'; // Importando o modelo Mongoose

// Função para buscar os dados de treinamento do MongoDB
const fetchTrainingDataFromDB = async () => {
  try {
    const trainingData = await TrainingData.find();
    if (!trainingData || trainingData.length === 0) {
      throw new Error('Nenhum dado de treinamento encontrado no MongoDB.');
    }
    return trainingData;
  } catch (error) {
    console.error('Erro ao buscar dados de treinamento no MongoDB:', error);
    throw new Error('Erro ao buscar dados de treinamento');
  }
};

export const createModelService = async () => {
  try {
    const model = tf.sequential();

    // Camada de embedding para entradas
    model.add(tf.layers.embedding({ inputDim: 10000, outputDim: 128 }));

    // Camadas LSTM otimizadas
    model.add(
      tf.layers.lstm({
        units: 64,
        returnSequences: false, // Alterar para false se a camada de saída não precisar retornar uma sequência completa
        kernelInitializer: 'glorotUniform',
      }),
    );

    // Camadas densas e dropout para evitar overfitting
    model.add(tf.layers.dense({ units: 128, activation: 'relu' }));
    model.add(tf.layers.dropout({ rate: 0.5 }));

    model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
    model.add(tf.layers.dropout({ rate: 0.5 }));

    // Última camada para classificação binária (ou com mais classes)
    model.add(
      tf.layers.dense({
        units: 2, // Número de classes (ajuste conforme necessário)
        activation: 'softmax', // Para classificação
      }),
    );

    // Compilar o modelo
    model.compile({
      optimizer: 'adam',
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    });

    console.log('Modelo compilado com sucesso.');
    return model;
  } catch (error) {
    console.error('Erro ao criar o modelo:', error);
    throw error;
  }
};
