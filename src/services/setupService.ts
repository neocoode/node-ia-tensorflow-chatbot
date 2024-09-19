import * as tf from '@tensorflow/tfjs-node';
import * as fs from 'fs';
import * as path from 'path';

// Caminho para o arquivo de configuração
const configPath = path.join(__dirname, '../configs/setup.json');

// Função para garantir que o diretório e o arquivo de configuração existam
const ensureConfigFileExists = () => {
  const configDir = path.dirname(configPath);

  // Verificar se o diretório 'configs' existe; caso contrário, criá-lo
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  // Verificar se o arquivo 'setup.json' existe; caso contrário, criá-lo com um valor padrão
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify({ currentModel: '' }, null, 2));
    console.log('Arquivo setup.json criado com valor padrão.');
  }
};

// Função para salvar a configuração do modelo atual
export const saveCurrentModel = (modelPath: string) => {
  try {
    ensureConfigFileExists(); // Verificar e criar o arquivo de configuração, se necessário

    // Extrair apenas o nome do diretório/arquivo
    const modelFileName = path.basename(modelPath);

    const config = { currentModel: modelFileName };
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`Modelo salvo em: ${modelFileName}`);
  } catch (error) {
    console.error('Erro ao salvar o modelo:', error);
    throw error;
  }
};

// Função para salvar o modelo e atualizar o arquivo de configuração
export const saveModelAndUpdateConfig = async (model: tf.Sequential) => {
  const date = new Date();
  const formattedDate = `${date.getFullYear()}${('0' + (date.getMonth() + 1)).slice(
    -2,
  )}${('0' + date.getDate()).slice(-2)}${('0' + date.getHours()).slice(-2)}${(
    '0' + date.getMinutes()
  ).slice(-2)}${('0' + date.getSeconds()).slice(-2)}${('00' + date.getMilliseconds()).slice(-3)}`;
  const modelPath = path.join(__dirname, `../../data/training/mdt${formattedDate}`);

  // Criar diretório se não existir
  if (!fs.existsSync(modelPath)) {
    fs.mkdirSync(modelPath, { recursive: true });
  }

  // Salvar o modelo
  await model.save(`file://${modelPath}`);
  console.log(`Modelo salvo em: ${modelPath}`);

  // Atualizar o arquivo de configuração com o nome do novo modelo
  const modelFileName = path.basename(modelPath); // Extrair apenas o nome do modelo
  const config = { currentModel: modelFileName };
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log('Configuração atualizada com sucesso:', config);

  await saveCurrentModel(modelPath);
};

// Função para carregar o modelo atual salvo
export const loadCurrentModel = async (): Promise<tf.LayersModel | null> => {
  try {
    ensureConfigFileExists(); // Verificar e criar o arquivo de configuração, se necessário

    // Ler o arquivo de configuração
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const currentModelPath = path.join(__dirname, `../../data/training/${config.currentModel}`);

    // Verificar se o arquivo model.json existe
    const modelFilePath = `${currentModelPath}/model.json`;
    if (!fs.existsSync(modelFilePath)) {
      console.error('O arquivo do modelo não existe:', modelFilePath);
      return null; // Retorna null se o arquivo do modelo não existir
    }

    // Carregar o modelo a partir do caminho
    const loadedModel = await tf.loadLayersModel(`file://${modelFilePath}`);
    console.log(`Modelo ${config.currentModel} carregado com sucesso.`);
    return loadedModel;
  } catch (error) {
    console.error('Erro ao carregar o modelo atual:', error);
    return null;
  }
};
