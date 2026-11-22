import { Pinecone } from '@pinecone-database/pinecone'
import { OpenAIEmbeddings } from '@langchain/openai'
// import { HuggingFaceInferenceEmbeddings } from '@langchain/community/embeddings/hf';
import fs from 'fs'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

// Init Pinecone
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!
})

// Choose embedding model: OpenAI or HuggingFace
const useOpenAI = true // Set to false to use sentence-transformers
const embeddingModel =
  // useOpenAI ?
  new OpenAIEmbeddings({
    apiKey: process.env.OPENAI_API_KEY!,
    model: 'text-embedding-ada-002'
  })
//   : new HuggingFaceInferenceEmbeddings({
//       apiKey: process.env.HUGGINGFACE_API_KEY!,
//       model: 'sentence-transformers/all-MiniLM-L6-v2',
//     });

const EMBEDDING_DIMENSION = useOpenAI ? 1536 : 384

async function indexMentalHealthData () {
  try {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const filePath = path.resolve(
      __dirname,
      '../../data/mental_health_resources.json'
    )

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

    // Create Pinecone index if it doesn't exist
    const indexName = 'mental-health-index'
    const indexes = await pinecone.listIndexes()
    const indexExists = indexes.indexes?.some(index => index.name === indexName)
    if (!indexExists) {
      await pinecone.createIndex({
        name: indexName,
        dimension: EMBEDDING_DIMENSION,
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: 'aws',
            region: process.env.PINECONE_ENVIRONMENT!
          }
        }
      })
      console.log(`Created Pinecone index: ${indexName}`)
    }

    const index = pinecone.Index(indexName)

    // Generate and upload embeddings
    for (const item of data) {
      if (!item.title || !item.content) {
        console.warn(
          `Skipping item with missing title or content: ${JSON.stringify(item)}`
        )
        continue
      }

      const embedding = await embeddingModel.embedQuery(item.content)
      await index.upsert([
        {
          id: item.title,
          values: embedding,
          metadata: {
            title: resource.title,
            source: resource.source,
            category: resource.category,
            url: resource.url,
            pageContent: resource.content
          }
        }
      ])
      console.log(`Indexed: ${item.title}`)
    }

    console.log('Data indexed successfully')
  } catch (error) {
    console.error('Error indexing data:', error)
    throw error
  }
}

indexMentalHealthData().catch(error => {
  console.error('Indexing failed:', error)
  process.exit(1)
})
