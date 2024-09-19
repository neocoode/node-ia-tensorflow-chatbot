import { Router } from 'express';

import { chatStream } from '@controllers/chatController';

const router = Router();

router.post('/stream', chatStream);

export default router;
