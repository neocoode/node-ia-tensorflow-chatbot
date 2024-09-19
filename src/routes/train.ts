import { Router } from 'express';

import { trainModel } from '@controllers/trainController';

const router = Router();

// Rota para a página de treinamento (GET)
router.get('/', (req, res) => {
  res.render('train');
});

// Rota para treinar o modelo (POST)
router.post('/', trainModel);

export default router;
