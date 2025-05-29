import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings, ChatOpenAI } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import { createOpenAIFunctionsAgent, AgentExecutor } from 'langchain/agents';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { z } from 'zod';
import { StructuredTool } from '@langchain/core/tools';
import Chat from '../models/chatSchema.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

// Initialize Pinecone
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});
const index = pinecone.Index('mental-health-index');

// Initialize Embeddings and Retriever
const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY!,
  model: 'text-embedding-ada-002',
});
const vectorStore = new PineconeStore(embeddings, { pineconeIndex: index });

// Initialize OpenAI LLM
const llm = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  model: 'gpt-4',
  temperature: 0.7,
});

// Crisis Helpline Tool
class CrisisHelplineTool extends StructuredTool {
  schema = z.object({
    input: z.string().optional(),
  });
  name = 'crisis_helpline';
  description = 'Provides crisis helpline numbers for mental health emergencies.';
  async _call(_: z.infer<typeof this.schema>) {
    return 'National Suicide Prevention Lifeline: 1-800-273-8255 (USA). Online: www.crisischat.org';
  }
}

// Query Reformulation Function
async function reformulateQuery(query: string): Promise<string> {
  const reformulationPrompt = `Given the user query "${query}", reformulate it to better match mental health content for retrieval (e.g., "I feel stressed" → "stress management techniques"). Return only the reformulated query.`;
  const response = await llm.invoke(reformulationPrompt);
  return response.content as string;
}

// Create Chat Prompt Template
const prompt = ChatPromptTemplate.fromMessages([
  [
    'system',
    'You are a supportive mental health chatbot. Use retrieved documents to provide helpful, accurate responses based on trusted mental health resources. If the query indicates a crisis (e.g., "I want to hurt myself"), use the crisis_helpline tool. Incorporate conversation history for context-aware responses. Always respond empathetically and include a disclaimer: "I’m not a professional (a cute AI :)); please consult one for serious issues."',
  ],
  new MessagesPlaceholder('context'),
  ['human', '{input}'],
  new MessagesPlaceholder('agent_scratchpad'),
]);

// Agentic RAG Handler
async function handleChatQuery(userId: string, query: string, sessionId: string = uuidv4()) {
  try {
    // Convert userId to ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Fetch conversation history from MongoDB (last 10 messages in session)
    const history = await Chat.find({
      user: userObjectId,
      sessionId,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Format context from history
    const context = history.length
      ? history
          .map((m: any) => `${m.role}: ${m.content}`)
          .reverse() // Chronological order
          .join('\n')
      : '';

    // Reformulate query
    const reformulatedQuery = await reformulateQuery(query);

    // Create agent
    const tools = [new CrisisHelplineTool()];
    const agent = await createOpenAIFunctionsAgent({
      llm,
      tools,
      prompt,
    });

    // Create executor with retriever
    const executor = AgentExecutor.fromAgentAndTools({
      agent,
      tools,
      verbose: true,
    });

    // Execute agent
    const response = await executor.invoke({
      input: reformulatedQuery,
      context: `Conversation history:\n${context}\nOriginal query: ${query}\nReformulated query: ${reformulatedQuery}`,
      agent_scratchpad: [],
      retriever: vectorStore.asRetriever(2),
    });

    // Save to MongoDB
    await Chat.create({
      user: userObjectId,
      sessionId,
      role: 'user',
      content: query,
    });
    await Chat.create({
      user: userObjectId,
      sessionId,
      role: 'assistant',
      content: response.output,
    });

    return response.output;
  } catch (error) {
    console.error('Error handling chat query:', error);
    throw error;
  }
}

export { handleChatQuery };