import { Router } from 'express';

import { trainChatModel } from '@controllers/trainController';

const router = Router();

router.post('/', trainChatModel);

export default router;
