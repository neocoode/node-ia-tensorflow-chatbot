import { Router } from 'express';

import { handleChat, handleChatStream } from '@controllers/chatController';

const router = Router();

// Rota para o chat
router.post('/', handleChat);
router.post('/stream', handleChatStream);

export default router;
