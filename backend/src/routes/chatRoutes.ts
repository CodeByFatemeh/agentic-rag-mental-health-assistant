import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { chatCompletionValidator, validate } from '../utils/validators.js';
import {
  deleteChats,
  generateChatCompletion,
  generateChatCompletionRAG,
  sendChatsToUser,
  getChatSessions
} from '../controllers/chatController.js';

/**
 * @swagger
 * /api/v1/chat/new:
 *   post:
 *     summary: Generate RAG-based chat completion
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message: { type: string }
 *               sessionId: { type: string }
 *     responses:
 *       200: { description: Successful response }
 */
const chatRoutes = Router();

chatRoutes.post(
  '/new',
  validate(chatCompletionValidator),
  verifyToken,
  generateChatCompletionRAG
);

chatRoutes.post(
  '/non-rag',
  validate(chatCompletionValidator),
  verifyToken,
  generateChatCompletion
);

chatRoutes.get('/all-chats', verifyToken, sendChatsToUser);

chatRoutes.delete('/delete', verifyToken, deleteChats);

chatRoutes.get('/sessions', verifyToken, getChatSessions);

export default chatRoutes;