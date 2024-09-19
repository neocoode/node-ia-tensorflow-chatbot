import { createModelService } from '@services/createModelService';
import { loadCurrentModel } from '@services/setupService';
import { trainModelService } from '@services/trainModelServices';
import { Request, Response } from 'express';

export const trainChatModel = async (req: Request, res: Response) => {
  try {
    let model: any = await loadCurrentModel();
    if (!model) {
      model = await createModelService();
    }

    await trainModelService(model);
    res.status(200).json({ message: 'Model successfully trained.' });
  } catch (error) {
    res.status(500).json({ message: 'Error training the model.', error });
  }
};

export const getModel = async () => {
  return await loadCurrentModel(); // Carregar o modelo atual salvo
};
