import trainingData from '@db/data/trainingData';
import { getClearSequenceValue } from '@db/md/counterSchema/model';
import { ITrainingData } from '@db/md/trainingData/interfaces';
import Model from '@db/md/trainingData/model';

// Função para salvar novos dados de treinamento
export const saveTrainingData = async (data: ITrainingData) => {
  try {
    const newData = new Model(data);
    await newData.save();
    console.log('Dados de treinamento salvos com sucesso.');
  } catch (error) {
    console.error('Erro ao salvar dados de treinamento:', error);
  }
};

// Função para buscar dados por tags
export const findByTag = async (tag: string) => {
  try {
    const result = await Model.find({ tags: tag });
    return result;
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    return null;
  }
};

// Função para buscar dados por chave (key)
export const findByKey = async (key: string) => {
  try {
    const result = await Model.findOne({ keys: key });
    return result;
  } catch (error) {
    console.error('Erro ao buscar por chave:', error);
    return null;
  }
};

export const fetchTrainingData = async () => {
  try {
    const trainingData = await Model.find();
    return trainingData;
  } catch (error) {
    console.error('Erro ao buscar dados de treinamento no MongoDB:', error);
    throw new Error('Erro ao buscar dados de treinamento');
  }
};

export const initializeTrainingData = async () => {
  try {
    const data: ITrainingData[] = trainingData;

    await getClearSequenceValue('TrainingData');

    // Filtra documentos para verificar se já existem pelo campo "keys"
    const existingKeys = await Model.find({}, 'keys').lean();
    const existingKeysSet = new Set(existingKeys.flatMap((doc: any) => doc.keys));

    // Filtrar novos dados para não incluir aqueles cujas chaves já estão no banco
    const filteredData = data.filter((item) => !item.keys.some((key) => existingKeysSet.has(key)));

    if (filteredData.length === 0) {
      console.log('Nenhum dado novo para inserir.');
      return;
    }

    // Inserir dados novos no MongoDB usando insertMany
    console.log('Inserindo novos dados de treinamento:', filteredData);

    await Model.insertMany(filteredData);
    console.log('Novos dados de treinamento inseridos com sucesso.');
  } catch (error) {
    console.error('Erro ao inserir dados de treinamento:', error);
  }
};
