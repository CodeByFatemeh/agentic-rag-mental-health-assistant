import { NextFunction, Request, Response } from 'express'
import User from '../models/userSchema.js'
import Chat from '../models/chatSchema.js'
import { handleChatQuery } from '../services/ChatAgentService.js'
import {
  ERROR_MESSAGE,
  OK_MESSAGE,
  PERMISSIONS_DIDNT_MATCH,
  SOMETHING_WENT_WRONG,
  UNAUTHORIZED_MESSAGE
} from '../config/constants.js'
import { configureOpenAI } from '../config/openAI.js'
import { IChat, ApiResponse } from '../types/index.js'
import { ChatCompletionMessageParam } from 'openai/resources/chat'

interface ChatRequest extends Request {
  body: {
    message: string
    sessionId?: string
  }
  query: {
    sessionId?: string
  }
}

export const getChatSessions = async (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    if (!res.locals.jwtData?.userId) {
      return res.status(401).json({ message: UNAUTHORIZED_MESSAGE });
    }

    const user = await User.findById(res.locals.jwtData.userId);
    if (!user) {
      return res.status(401).json({ message: UNAUTHORIZED_MESSAGE });
    }

    const sessions = await Chat.aggregate([
    {
      $match: {
        user: user._id,
        isDeleted: false,
        sessionId: { $ne: null }
      }
    },
    {
      $sort: {
        createdAt: 1
      }
    },
    {
      $group: {
        _id: '$sessionId',
        createdAt: { $first: '$createdAt' },
        firstMessage: {
          $first: {
            $cond: [
              { $eq: ['$role', 'user'] },
              '$content',
              ''
            ]
          }
        }
      }
    },
    {
      $project: {
        sessionId: '$_id',
        createdAt: 1,
        title: {
          $cond: [
            { $ne: ['$firstMessage', ''] },
            {
              $substrCP: ['$firstMessage', 0, 50]
            },
            'New Chat'
          ]
        },
        _id: 0
      }
    },
    {
      $sort: {
        createdAt: -1
      }
    }
  ])

    return res.status(200).json({
      message: OK_MESSAGE,
      data: sessions.map(s => ({
        ...s,
        sessionId: s.sessionId ?? 'default',
      })),
    });
  } catch (error) {
    console.error('Error in getChatSessions:', error);
    return res.status(500).json({ message: SOMETHING_WENT_WRONG });
  }
};

export const generateChatCompletionRAG = async (
  req: ChatRequest,
  res: Response
) => {
  const { message, sessionId } = req.body

  try {
    if (
      sessionId &&
      !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        sessionId
      )
    ) {
      return res.status(400).json({ message: 'Invalid sessionId format' })
    }

    if (!res.locals.jwtData?.userId) {
      return res.status(401).json({ message: UNAUTHORIZED_MESSAGE })
    }

    const user = await User.findById(res.locals.jwtData.userId)
    if (!user) {
      return res.status(401).json({ message: UNAUTHORIZED_MESSAGE })
    }

    const response = await handleChatQuery(
      user._id.toString(),
      message,
      sessionId
    )

    return res.status(200).json({
      message: OK_MESSAGE,
      data: [{ role: 'assistant', content: response } as IChat]
    } as ApiResponse<IChat[]>)
  } catch (error) {
    console.error('Error in generateChatCompletionRAG:', error)
    return res.status(500).json({ message: SOMETHING_WENT_WRONG })
  }
}

export const generateChatCompletion = async (
  req: ChatRequest,
  res: Response
) => {
  const { message, sessionId } = req.body

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res
      .status(400)
      .json({ message: 'Message is required and must be a non-empty string' })
  }

  try {
    if (!res.locals.jwtData?.userId) {
      return res.status(401).json({ message: UNAUTHORIZED_MESSAGE })
    }

    const user = await User.findById(res.locals.jwtData.userId)
    if (!user) {
      return res.status(401).json({ message: UNAUTHORIZED_MESSAGE })
    }

    const chatHistory = await Chat.find({
      user: user._id,
      sessionId: sessionId ?? null,
      isDeleted: false
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()

    const messages: ChatCompletionMessageParam[] = chatHistory
      .slice()
      .reverse()
      .map(chat => ({
        role: chat.role,
        content: chat.content
      }))

    messages.push({ role: 'user', content: message.trim() })

    await Chat.create({
      user: user._id,
      sessionId: sessionId ?? null,
      role: 'user',
      content: message.trim()
    })

    const openai = configureOpenAI()
    const chatResponse = await openai.chat.completions.create({
      model: process.env.OPENAI_NON_RAG_MODEL ?? 'gpt-3.5-turbo',
      messages,
      temperature: 0.7
    })

    const responseMessage = chatResponse.choices[0]?.message
    if (!responseMessage?.role || !responseMessage?.content) {
      console.warn('OpenAI API returned an incomplete message:', chatResponse)
      return res
        .status(500)
        .json({ message: 'Incomplete response from OpenAI' })
    }

    await Chat.create({
      user: user._id,
      sessionId: sessionId ?? null,
      role: responseMessage.role,
      content: responseMessage.content
    })

    return res.status(200).json({
      message: OK_MESSAGE,
      data: [
        {
          role: responseMessage.role,
          content: responseMessage.content
        } as IChat
      ]
    } as ApiResponse<IChat[]>)
  } catch (error) {
    console.error('Error in generateChatCompletion:', error)
    return res.status(500).json({ message: SOMETHING_WENT_WRONG })
  }
}

export const sendChatsToUser = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    if (!res.locals.jwtData?.userId) {
      return res.status(401).json({ message: UNAUTHORIZED_MESSAGE })
    }

    const user = await User.findById(res.locals.jwtData.userId).populate({
      path: 'chats',
      model: 'Chat',
      select: 'user role content'
    })

    if (!user) {
      return res.status(401).json({ message: UNAUTHORIZED_MESSAGE })
    }
    if (user._id.toString() !== res.locals.jwtData.userId) {
      return res.status(403).json({ message: PERMISSIONS_DIDNT_MATCH })
    }

    const { sessionId } = req.query;
    const query: any = { user: user._id, isDeleted: false };
    if (sessionId) {
      query.sessionId = sessionId;
    }

    const chats = await Chat.find(query)
      .select('user role content _id sessionId createdAt')
      .sort({ createdAt: 1 })
      .lean();

    return res.status(200).json({
      message: OK_MESSAGE,
      data: chats ?? []
    })
  } catch (error) {
    console.error('Error in sendChatsToUser:', error)
    return res.status(500).json({ message: ERROR_MESSAGE })
  }
}

export const deleteChats = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    if (!res.locals.jwtData?.userId) {
      return res.status(401).json({ message: UNAUTHORIZED_MESSAGE })
    }

    const user = await User.findById(res.locals.jwtData.userId)
    if (!user) {
      return res.status(401).json({ message: UNAUTHORIZED_MESSAGE })
    }
    if (user._id.toString() !== res.locals.jwtData.userId) {
      return res.status(403).json({ message: PERMISSIONS_DIDNT_MATCH })
    }

    const { sessionId } = req.query

    const deleteFilter: {
      user: typeof user._id
      sessionId?: string
    } = {
      user: user._id
    }
    
    if (typeof sessionId === 'string' && sessionId.trim() !== '') {
      deleteFilter.sessionId = sessionId
    }
    
    await Chat.deleteMany(deleteFilter)

    return res.status(200).json({ message: OK_MESSAGE } as ApiResponse<null>)
  } catch (error) {
    console.error('Error in deleteChats:', error)
    return res.status(500).json({ message: ERROR_MESSAGE })
  }
}
