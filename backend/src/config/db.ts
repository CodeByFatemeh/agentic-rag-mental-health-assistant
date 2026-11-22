import { connect, disconnect } from 'mongoose'
import dotenv from 'dotenv';

dotenv.config();

async function connectToDB() {
  try {
    const {
      MONGODB_USER,
      MONGODB_PASSWORD,
      MONGODB_CLUSTER,
      MONGODB_DATABASE
    } = process.env

    if (
      !MONGODB_USER ||
      !MONGODB_PASSWORD ||
      !MONGODB_CLUSTER ||
      !MONGODB_DATABASE
    ) {
      throw new Error('MongoDB environment variables are not fully configured')
    }

    const user = encodeURIComponent(MONGODB_USER)
    const password = encodeURIComponent(MONGODB_PASSWORD)

    const uri =
      `mongodb+srv://${user}:${password}` +
      `@${MONGODB_CLUSTER}/${MONGODB_DATABASE}` +
      `?retryWrites=true&w=majority&appName=Cluster0`

    await connect(uri)

    console.log('Connected to MongoDB')
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error connecting to database: ${error.message}`)
    }

    throw new Error('Error connecting to database')
  }
}

async function disconnectFromDB () {
  try {
    await disconnect()
  } catch (error) {
    throw new Error('Error disconnecting from database')
  }
}

export { connectToDB, disconnectFromDB }
