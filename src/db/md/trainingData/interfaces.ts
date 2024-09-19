import { Document, ObjectId } from 'mongoose';

// Interface para afirmações e negações
export interface AffirmationNegation {
  statement: string; // Afirmativa ou negativa (ex: "2 + 2 é igual a 4.")
  isCorrect: boolean; // Indica se a afirmação ou negação é correta
  response: string; // Resposta associada à afirmação ou negação
}

// Interface para os links associados a cada conjunto de treinamento
export interface Link {
  label: string; // Descrição do link (ex: "Curiosidades sobre o espaço")
  url: string; // URL do link (ex: "https://www.nasa.gov")
}

// Definição do documento TrainingData para o MongoDB com Mongoose
export interface ITrainingData {
  keys: string[]; // Palavras-chave usadas para identificar a categoria de perguntas
  predictedIndex?: number; // Índice usado para corresponder com o modelo de previsão
  resume: string[] | string; // Respostas associadas às perguntas
  responses: string[]; // Respostas associadas às perguntas
  affirmations?: AffirmationNegation[]; // Conjunto de afirmações opcionais
  negations?: AffirmationNegation[]; // Conjunto de negações opcionais
  confidence?: number; // Grau de confiança nas respostas
  tags?: string[]; // Tags associadas ao contexto do conjunto de dados
  links?: Link[]; // Links opcionais relacionados ao conteúdo
  createdAt?: Date; // Data de criação do documento (preenchido automaticamente)
  updatedAt?: Date; // Data de atualização do documento (preenchido automaticamente)
}

export interface ITrainingDataDocument extends ITrainingData, Document<ObjectId> {}
