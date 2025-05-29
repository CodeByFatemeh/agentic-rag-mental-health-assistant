import { NextFunction, Request, Response } from 'express'
import User from '../models/userSchema.js'
import Chat from '../models/chatSchema.js'
import { handleChatQuery } from '../utils/agentic_rag.js'
import { configureOpenAI } from '../config/openAIConfig.js'
// import 
//   OpenAIApi
//   // ChatCompletionRequestMessage
//   // ChatCompletionResponseMessage
//  from 'openai'
 import { ChatCompletionMessageParam } from 'openai/resources/chat';
// import { Message } from '../types/chat.js'
import {
  ERROR_MESSAGE,
  OK_MESSAGE,
  PERMISSIONS_DIDNT_MATCH,
  SOMETHING_WENT_WRONG,
  UNAUTHORIZED_MESSAGE
} from '../config/constants.js'

export const generateChatCompletionRAG = async (req: Request, res: Response) => {

  const { message, sessionId } = req.body

  try {
    if (sessionId && !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(sessionId)) {
      return res.status(400).json({ message: 'Invalid sessionId format' });
    }
    
    // Authentication and Authorization
    if (!res.locals.jwtData?.userId) {
      return res.status(401).json({ message: UNAUTHORIZED_MESSAGE })
    }

    const user = await User.findById(res.locals.jwtData.userId)
    if (!user) {
      return res.status(401).json({ message: UNAUTHORIZED_MESSAGE })
    }

    // Call Agentic RAG handler
    const response = await handleChatQuery(user._id.toString(), message, sessionId)

    return res.status(200).json({
      message: OK_MESSAGE,
      data: [{ role: 'assistant', content: response }],
    })
  } catch (error) {
    console.error('Error in generateChatCompletion:', error)
    return res.status(500).json({ message: SOMETHING_WENT_WRONG })
  }
}

export const generateChatCompletion = async (req: Request, res: Response) => {
  const { message, sessionId } = req.body;

    // Validate input
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ message: 'Message is required and must be a non-empty string' });
    }

  try {
    // Authentication and Authorization
    if (!res.locals.jwtData?.userId) {
      return res.status(401).json({ message: UNAUTHORIZED_MESSAGE })
    }

    let user = await User.findById(res.locals.jwtData.userId)
    if (!user) {
      return res.status(401).json({ message: UNAUTHORIZED_MESSAGE })
    }

    // Create and Save User Message
    // const userChat = await Chat.create({
    //   user: user._id,
    //   sessionId: sessionId || null,
    //   role: 'user',
    //   content: message.trim(),
    // });

    // const savedUserChat = await userChat.save()
    // Atomic update of user chats array
    // await User.findByIdAndUpdate(user._id, {
    //   $push: { chats: savedUserChat._id }
    // })

    // Retrieve and Format Chat History for OpenAI
    // Retrieve chat history (last 10 messages)
    const chatHistory = await Chat.find({
      user: user._id,
      sessionId: sessionId ?? null,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
      
      const reversedChatHistory = chatHistory.slice().reverse();
      const messages: ChatCompletionMessageParam[] = reversedChatHistory.map(chat => ({
      role: chat.role,
      content: chat.content,
    }));

    messages.push({ role: 'user', content: message.trim() }) // Add the new message

    // OpenAI API call
    const openai = configureOpenAI()
    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.7
    })

    const responseMessage = chatResponse.choices[0]?.message as ChatCompletionMessageParam;

    // console.log('chat res')
    // console.log(responseMessage)

    if (!responseMessage?.role || !responseMessage?.content) {
      console.warn('OpenAI API returned an incomplete message:', chatResponse);
      return res.status(500).json({ message: 'Incomplete response from OpenAI' });
    }

    // Save assistant response
    await Chat.create({
      user: user._id,
      sessionId: sessionId ?? null,
      role: responseMessage.role,
      content: responseMessage.content,
    });

      return res.status(200).json({
              message: OK_MESSAGE,
              data: [{ role: responseMessage.role, content: responseMessage.content }],
            });

    // Update User and Send Response
    // await user.save()
    // return res.status(200).json({ message: OK_MESSAGE, data: messages })
  } catch (error) {
    console.error('Error in generateChatCompletion:', error)
    return res.status(500).json({ message: SOMETHING_WENT_WRONG })
  }
}

export const sendChatsToUser = async (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    //User token check
    if (!res.locals.jwtData?.userId) {
      return res.status(401).json({ message: UNAUTHORIZED_MESSAGE })
    }

    const user = await User.findById(res.locals.jwtData.userId).populate({
      path: 'chats',
      model: 'Chat',
      select: 'user role content' // Only relevant fields
    })

    if (!user) {
      return res.status(401).send(UNAUTHORIZED_MESSAGE)
    }
    if (user._id.toString() !== res.locals.jwtData.userId) {
      return res.status(403).send(PERMISSIONS_DIDNT_MATCH)
    }
    return res.status(200).json({ message: OK_MESSAGE, data: user.chats })
  } catch (error) {
    console.log(error)
    return res.status(200).json({ message: ERROR_MESSAGE })
  }
}

export const deleteChats = async (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    //User token check
    if (!res.locals.jwtData?.userId) {
      return res.status(401).json({ message: UNAUTHORIZED_MESSAGE })
    }
    const user = await User.findById(res.locals.jwtData.userId)
    if (!user) {
      return res.status(401).send(UNAUTHORIZED_MESSAGE)
    }
    if (user._id.toString() !== res.locals.jwtData.userId) {
      return res.status(403).json({ message: PERMISSIONS_DIDNT_MATCH })
    }

    await Chat.deleteMany({ user: user._id })
    user.chats = []
    await user.save()
    return res.status(200).json({ message: OK_MESSAGE })
  } catch (error) {
    console.error('Error in deleteChats:', error)
    return res.status(500).json({ message: ERROR_MESSAGE })
  }
}
