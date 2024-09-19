import { ITrainingDataDocument } from '@db/md/trainingData/interfaces';
import { dataSchema } from '@db/md/trainingData/schema';
import { createModel } from '@db/tools/createModel';

export default createModel<ITrainingDataDocument>('TrainingData', dataSchema, {
  predictedIndex: 1,
});
