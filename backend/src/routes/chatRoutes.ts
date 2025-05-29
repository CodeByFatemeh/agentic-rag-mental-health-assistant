import { Router } from 'express'
import { verifyToken } from '../utils/auth.js'
import { chatCompletionValidator, validate } from '../utils/validators.js'
import {
  deleteChats,
  generateChatCompletionRAG,
  sendChatsToUser
} from '../controllers/chatController.js'

//Protected API
const chatRoutes = Router()
chatRoutes.post(
  '/new',
  validate(chatCompletionValidator),
  verifyToken,
  generateChatCompletionRAG
)

chatRoutes.get('/all-chats', verifyToken, sendChatsToUser)

chatRoutes.delete('/delete', verifyToken, deleteChats)

export default chatRoutes
