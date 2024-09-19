import * as tf from '@tensorflow/tfjs-node';
import { padSequences } from '@utils/common';
import { fetchTrainingData } from './service';

export const updateModel = async (model: tf.Sequential) => {
  try {
    // Buscar dados de treinamento do MongoDB
    const trainingData = await fetchTrainingData();

    // Associar IDs do MongoDB às previsões do modelo
    const inputSequences = trainingData.map((item: any) =>
      item.keys
        .join(' ')
        .split(' ')
        .map((word: string) => word.length),
    );
    const maxLength = 10;
    const paddedInputSequences = padSequences(inputSequences, maxLength);

    const outputLabels = trainingData.map((item: any) => item._id.toString());
    const inputTensor = tf.tensor2d(paddedInputSequences, [paddedInputSequences.length, maxLength]);

    const uniqueLabels = Array.from(new Set(outputLabels));
    const labelIndexMap = uniqueLabels.reduce((acc, label, index) => {
      acc[label] = index;
      return acc;
    }, {});

    const outputIndexes = outputLabels.map((label: string) => labelIndexMap[label]);
    const outputTensor = tf.oneHot(tf.tensor1d(outputIndexes, 'int32'), uniqueLabels.length);

    // Treinar o modelo
    await model.fit(inputTensor, outputTensor, { epochs: 100 });
    console.log('Modelo atualizado com sucesso');
  } catch (error) {
    console.error('Erro durante a atualização do modelo:', error);
  }
};
