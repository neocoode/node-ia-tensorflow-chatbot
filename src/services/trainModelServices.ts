import { fetchTrainingData } from '@db/md/trainingData/service'; // Função que busca dados do MongoDB
import { saveModelAndUpdateConfig } from '@services/setupService';
import * as tf from '@tensorflow/tfjs-node';
import { padSequences } from '@utils/common';

export const trainModelService = async (model: tf.Sequential) => {
  try {
    // Buscar dados de treinamento do MongoDB
    const trainingData = await fetchTrainingData();

    // Verificar se há dados suficientes para treinamento
    if (trainingData.length === 0) {
      console.error('Nenhum dado de treinamento encontrado.');
      return;
    }

    // Processar os dados para treinamento
    const inputSequences = trainingData.map(
      (item: any) =>
        item.keys
          .join(' ')
          .split(' ')
          .map((word: string) => word.length), // Tokenização simples baseada no comprimento das palavras
    );

    console.log('Sequências de entrada tokenizadas:', inputSequences);

    // Definir um comprimento máximo para as sequências
    const maxLength = 100; // Ajuste conforme necessário para corresponder ao tamanho esperado pelo modelo
    const paddedInputSequences = await padSequences(inputSequences, maxLength);

    console.log('Sequências de entrada ajustadas:', paddedInputSequences);

    // Usar o predictedIndex como labels de saída
    const outputLabels = trainingData.map((item: any) => item.predictedIndex);

    console.log('Rótulos de saída (predictedIndex):', outputLabels);

    // Criar tensores de entrada e saída com o tamanho esperado [batch_size, maxLength]
    const inputTensor = tf.tensor2d(paddedInputSequences, [paddedInputSequences.length, maxLength]);
    console.log('Tensor de entrada criado com shape:', inputTensor.shape);

    // One-hot encoding para as saídas (usamos o índice da saída em vez do nome da categoria)
    const uniqueLabels = Array.from(new Set(outputLabels));
    const labelIndexMap = uniqueLabels.reduce((acc, label, index) => {
      acc[label] = index;
      return acc;
    }, {});

    console.log('Mapa de índices dos rótulos únicos:', labelIndexMap);

    const outputIndexes = outputLabels.map((label: number) => labelIndexMap[label]);

    // Criar tensor de saída com o número correto de classes (número de labels únicos)
    const outputTensor = tf.oneHot(tf.tensor1d(outputIndexes, 'int32'), uniqueLabels.length);
    console.log('Tensor de saída criado com shape:', outputTensor.shape);

    // Compilar o modelo (certificar-se de que ele foi compilado antes de fit)
    model.compile({
      optimizer: 'adam',
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    });

    console.log('Modelo compilado com sucesso.');

    // Treinar o modelo
    await model.fit(inputTensor, outputTensor, { epochs: 100 });
    await saveModelAndUpdateConfig(model);
    console.log('Treinamento concluído com sucesso');
  } catch (error) {
    console.error('Erro durante o treinamento do modelo:', error);
  }
};
