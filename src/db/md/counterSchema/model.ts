import mongoose, { Schema } from 'mongoose';

// Interface para o contador
interface ICounter extends mongoose.Document {
  modelName: string;
  sequenceValue: number;
}

// Schema para armazenar o valor do contador

const nameSchema = 'Counter';

const dataSchema = new Schema<ICounter>({
  modelName: { type: String, required: true },
  sequenceValue: { type: Number, required: true },
});

dataSchema.set('collection', nameSchema);

export const Counter = mongoose.model<ICounter>(nameSchema, dataSchema);

// Função para obter o próximo valor da sequência
export const getNextSequenceValue = async (modelName: string): Promise<number> => {
  const counter = await Counter.findOneAndUpdate(
    { modelName }, // Filtra pelo nome do modelo
    { $inc: { sequenceValue: 1 } }, // Incrementa o campo `sequenceValue` em 1
    { new: true, upsert: true, setDefaultsOnInsert: true }, // Cria um novo contador se não existir
  );

  // Se o contador for criado pela primeira vez, inicialize sequenceValue com 1
  if (!counter) {
    const newCounter = new Counter({ modelName, sequenceValue: 1 });
    await newCounter.save();
    return 1; // Retorna o valor inicial como 1
  }

  return counter.sequenceValue; // Retorna o valor atualizado do contador
};

export const getClearSequenceValue = async (modelName: string): Promise<number> => {
  const counter = await Counter.findOneAndUpdate(
    { modelName }, // Filtra pelo nome do modelo
    { $inc: { sequenceValue: 0 } }, // Incrementa o campo `sequenceValue` em 1
    { new: true, upsert: true, setDefaultsOnInsert: true }, // Cria um novo contador se não existir
  );

  // Se o contador for criado pela primeira vez, inicialize sequenceValue com 1
  if (!counter) {
    const newCounter = new Counter({ modelName, sequenceValue: 1 });
    await newCounter.save();
    return 1; // Retorna o valor inicial como 1
  }

  return counter.sequenceValue; // Retorna o valor atualizado do contador
};
