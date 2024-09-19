import { getNextSequenceValue } from '@db/md/counterSchema/model';
import { ITrainingDataDocument } from '@db/md/trainingData/interfaces';
import mongoose, { Schema } from 'mongoose';

const nameSchema = 'TrainingData';

// Definição do schema para TrainingData
const dataSchema: Schema = new Schema<ITrainingDataDocument>({
  keys: {
    type: [String],
    required: true,
    validate: [(val: string[]) => val.length > 0, 'Keys cannot be empty'],
  },
  predictedIndex: { type: Number, unique: true },
  responses: {
    type: [String],
    required: true,
    validate: [(val: string[]) => val.length > 0, 'Responses cannot be empty'],
  },
  affirmations: [
    {
      statement: { type: String, required: true },
      isCorrect: { type: Boolean, required: true },
      response: { type: String, required: true },
    },
  ],
  negations: [
    {
      statement: { type: String, required: true },
      isCorrect: { type: Boolean, required: true },
      response: { type: String, required: true },
    },
  ],
  confidence: {
    type: Number,
    default: 1.0,
    min: 0,
    max: 1,
  },
  tags: {
    type: [String],
    default: [],
  },
  links: [
    {
      label: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

dataSchema.pre('save', async function (next) {
  if (this.isNew) {
    // Incrementa o campo predictedIndex ao salvar um novo documento
    this.predictedIndex = await getNextSequenceValue(nameSchema);
  }
  this.updatedAt = new Date();
  next();
});

// Sobrescrevendo a função insertMany para aplicar lógica customizada
dataSchema.statics.insertMany = async function (docs: any[]) {
  // Para cada documento, gerar um valor incremental para o campo predictedIndex
  for (const doc of docs) {
    doc.predictedIndex = await getNextSequenceValue(nameSchema); // Usar o autoincremento
    doc.updatedAt = new Date(); // Atualizar a data de modificação
  }

  // Chamando a implementação original de insertMany do Mongoose com dois parâmetros (docs e options)
  return mongoose.Model.insertMany.call(this, docs);
};

dataSchema.set('collection', nameSchema);

export { dataSchema };
