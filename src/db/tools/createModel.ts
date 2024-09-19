import mongoose, { Document, Model, Schema } from 'mongoose';

export const createModel = <T extends Document>(
  name: string,
  schema: Schema,
  createIndex?: any,
): Model<T> => {
  if (mongoose.connection.modelNames().includes(name)) {
    console.log(`Model ${name} already exists.`);
    return mongoose.connection.models[name];
  }

  const model = mongoose.model<T>(name, schema);
  if (createIndex && Object.keys(createIndex).length > 0) {
    model.createIndexes({ ...createIndex }); // Corrigido para createIndexes
  }

  console.log(`Creating model ${name}`);
  return model;
};
