import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';
// import { HuggingFaceInferenceEmbeddings } from '@langchain/community/embeddings/hf';
import { PineconeStore } from '@langchain/pinecone';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Pinecone
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!
});

// Initialize embedding model (match index_data.ts)
// const useOpenAI = true; // Must match index_data.ts
const embeddingModel = 
// useOpenAI ?
  new OpenAIEmbeddings({
      apiKey: process.env.OPENAI_API_KEY!,
      model: 'text-embedding-ada-002',
    })
//   : new HuggingFaceInferenceEmbeddings({
//       apiKey: process.env.HUGGINGFACE_API_KEY!,
//       model: 'sentence-transformers/all-MiniLM-L6-v2',
//     });

// Initialize Pinecone index
const index = pinecone.Index('mental-health-index');

async function testPineconeRetrieval() {
  try {
    // Create vector store retriever
    const vectorStore = new PineconeStore(embeddingModel, {
      pineconeIndex: index,
    });

    // Test query
    const query = "How to cope with anxiety";
    // const results = await vectorStore.similaritySearch(query, 3); // Retrieve top 2 matches
    const results = await vectorStore.similaritySearch(query, 2, { category: 'Article' });
    
    console.log(`Query: ${query}`);
    console.log('Retrieved documents:');
    results.forEach((doc, i) => {
      console.log(`Result ${i + 1}:`);
      console.log(`Title: ${doc.metadata.title}`);
      console.log(`Page Content: ${doc.metadata.pageContent}`);
      console.log(`Source: ${doc.metadata.source}`);
      console.log(`Category: ${doc.metadata.category}`);
      console.log('---');
    });
  } catch (error) {
    console.error('Error testing retrieval:', error);
    throw error;
  }
}

testPineconeRetrieval().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});