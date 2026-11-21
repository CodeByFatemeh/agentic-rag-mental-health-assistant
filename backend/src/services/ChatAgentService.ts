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

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!
})
const index = pinecone.Index('mental-health-index')

const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY!,
  model: 'text-embedding-ada-002'
})
const vectorStore = new PineconeStore(embeddings, { pineconeIndex: index })

const llm = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  model: 'gpt-4',
  temperature: 0.7
})

class CrisisHelplineTool extends StructuredTool {
  schema = z.object({
    input: z.string().optional()
  })
  name = 'crisis_helpline'
  description =
    'Provides crisis helpline numbers for mental health emergencies.'
  async _call (_: z.infer<typeof this.schema>) {
    return 'National Suicide Prevention Lifeline: 1-800-273-8255 (USA). Online: www.crisischat.org'
  }
}

async function reformulateQuery (query: string): Promise<string> {
  const reformulationPrompt = `Given the user query "${query}", reformulate it to better match mental health content for retrieval (e.g., "I feel stressed" → "stress management techniques"). Return only the reformulated query.`
  const response = await llm.invoke(reformulationPrompt)
  return response.content as string
}

const prompt = ChatPromptTemplate.fromMessages([
  [
    'system',
    'You are a supportive mental health chatbot. Use retrieved documents to provide helpful, accurate responses based on trusted mental health resources. If the query indicates a crisis (e.g., "I want to hurt myself"), use the crisis_helpline tool. Incorporate conversation history for context-aware responses. Always respond empathetically and include a disclaimer: "I’m not a professional (a cute AI :)); please consult one for serious issues."'
  ],
  new MessagesPlaceholder('context'),
  ['human', '{input}'],
  new MessagesPlaceholder('agent_scratchpad')
])

async function handleChatQuery (
  userId: string,
  query: string,
  sessionId: string = uuidv4()
): Promise<string> {
  try {
    const userObjectId = new mongoose.Types.ObjectId(userId)

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
        assistantContent = `${toolOutput}\n\nI’m not a professional; please consult one for serious issues.`
      }
    }

    // Ensure content is not empty
      assistantContent ??=
        'I’m here to help, but I need more information to provide a meaningful response. Please share more details or contact a professional for immediate support.\n\nI’m not a professional; please consult one for serious issues.'

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
      content: assistantContent
    })

    return assistantContent
  } catch (error) {
    console.error('Error handling chat query:', error)
    throw error
  }
}

export { handleChatQuery }
