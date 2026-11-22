import { Pinecone } from '@pinecone-database/pinecone'
import { OpenAIEmbeddings, ChatOpenAI } from '@langchain/openai'
import { PineconeStore } from '@langchain/pinecone'
import { createOpenAIFunctionsAgent, AgentExecutor } from 'langchain/agents'
import {
  ChatPromptTemplate,
  MessagesPlaceholder
} from '@langchain/core/prompts'
import { z } from 'zod'
import { StructuredTool } from '@langchain/core/tools'
import Chat from '../models/chatSchema.js'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

// Load environment variables
dotenv.config()

const getVectorStore = () => {
  if (!process.env.PINECONE_API_KEY) {
    throw new Error('PINECONE_API_KEY is not defined')
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not defined')
  }

  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
  })

  const index = pinecone.Index('mental-health-index')

  const embeddings = new OpenAIEmbeddings({
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_EMBEDDING_MODEL ?? 'text-embedding-ada-002'
  })

  return new PineconeStore(embeddings, {
    pineconeIndex: index
  })
}

const getLLM = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not defined')
  }

  return new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_CHAT_MODEL ?? 'gpt-4',
    temperature: 0.7
  })
}

class CrisisHelplineTool extends StructuredTool {
  schema = z.object({
    input: z.string().optional()
  })
  name = 'crisis_helpline'
  description =
    'Provides crisis helpline numbers for mental health emergencies.'
  async _call (_: z.infer<typeof this.schema>) {
    return `If you are in immediate danger or at risk of harming yourself or someone else, contact your local emergency services or an official crisis support service in your country.`  }
}

async function reformulateQuery (query: string): Promise<string> {
  const llm = getLLM()
  const reformulationPrompt = `Given the user query "${query}", reformulate it to better match mental health content for retrieval (e.g., "I feel stressed" → "stress management techniques"). Return only the reformulated query.`
  const response = await llm.invoke(reformulationPrompt)
  return response.content as string
}

const prompt = ChatPromptTemplate.fromMessages([
  [
    'system',
    `You are a supportive mental health chatbot.

    Use the retrieved knowledge provided below when it is relevant to the user's question.
    Do not invent information that is not supported by the retrieved context.
    
    Base factual claims on the retrieved knowledge when relevant.
    Do not claim that a source supports information that is not present in the retrieved context.
    The application will display the retrieved sources separately, so do not invent source names or URLs in your response.
    
    If the user indicates an immediate crisis or self-harm risk, use the crisis_helpline tool.
    
    Use the conversation history for context-aware responses.
    
    Context:
    {context}
    
    Always respond empathetically and include this disclaimer when appropriate:
    "I'm not a mental health professional; please consult a qualified professional for serious concerns."`
  ],
    ['human', '{input}'],
    new MessagesPlaceholder('agent_scratchpad')
  ])

interface ChatQueryResult {
  content: string
  sources: {
    title?: string
    source?: string
    category?: string
    url?: string
  }[]
}

async function handleChatQuery(
  userId: string,
  query: string,
  sessionId: string = uuidv4()
): Promise<ChatQueryResult> {
  try {
    const userObjectId = new mongoose.Types.ObjectId(userId)

    const vectorStore = getVectorStore()
    const llm = getLLM()
    
    const history = await Chat.find({
      user: userObjectId,
      sessionId,
      isDeleted: false
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()

    const context = history.length
      ? history
          .map(m => `${m.role}: ${m.content}`)
          .reverse()
          .join('\n')
      : ''

    const reformulatedQuery = await reformulateQuery(query)

    const retrievedDocs = await vectorStore.similaritySearch(
      reformulatedQuery,
      2
    )
    
    const sources = Array.from(
      new Map(
        retrievedDocs.map((doc) => {
          const item = {
            title: doc.metadata?.title as string | undefined,
            source: doc.metadata?.source as string | undefined,
            category: doc.metadata?.category as string | undefined,
            url: doc.metadata?.url as string | undefined,
          }
    
          const key =
            item.url ??
            `${item.title ?? ''}-${item.source ?? ''}`
    
          return [key, item]
        })
      ).values()
    )
    
    const retrievedContext = retrievedDocs
      .map((doc, index) => {
        const title = doc.metadata?.title ?? 'Unknown'
        const source = doc.metadata?.source ?? 'Unknown'
    
        return `Source ${index + 1}
    Title: ${title}
    Source: ${source}
    Content: ${doc.pageContent}`
      })
      .join('\n\n')

    const tools = [new CrisisHelplineTool()]
    const agent = await createOpenAIFunctionsAgent({
      llm,
      tools,
      prompt
    })

    const executor = AgentExecutor.fromAgentAndTools({
      agent,
      tools,
      verbose: true
    })

    const response = await executor.invoke({
      input: reformulatedQuery,
      context: `Conversation history:
    ${context}
    
    Retrieved knowledge:
    ${retrievedContext}
    
    Original query:
    ${query}
    
    Reformulated query:
    ${reformulatedQuery}`,
      agent_scratchpad: []
    })

    // Handle tool output
    let assistantContent = response.output
    if (!assistantContent && response.tool_calls?.length) {
      const toolCall = response.tool_calls[0]
      if (toolCall.name === 'crisis_helpline') {
        const toolOutput = await tools[0]._call(toolCall.args)
        assistantContent = `${toolOutput}\n\nI'm an AI assistant and not a substitute for a qualified mental health professional.`
      }
    }

    // Ensure content is not empty
      assistantContent ??=
        `I’m here to help, but I need a little more information to provide a useful response. Please share more details.
      
      I'm an AI assistant and not a substitute for a qualified mental health professional.`
    await Chat.create({
      user: userObjectId,
      sessionId,
      role: 'user',
      content: query
    })
    await Chat.create({
      user: userObjectId,
      sessionId,
      role: 'assistant',
      content: assistantContent,
      sources
    })

    return {
      content: assistantContent,
      sources
    }
  } catch (error) {
    console.error('Error handling chat query:', error)
    throw error
  }
}

export { handleChatQuery }
