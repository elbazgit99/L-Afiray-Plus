import express from 'express';
import chatController from '../Controllers/Chat.controller.js';

const router = express.Router();

// POST /api/chat - Handle chat messages
router.post('/', chatController.handleMessage);

// GET /api/chat/history/:userId - Get chat history (for future implementation)
router.get('/history/:userId', chatController.getChatHistory);

export default router; 