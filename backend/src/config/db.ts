import { connect, disconnect } from 'mongoose'
import dotenv from 'dotenv';

dotenv.config();

async function connectToDB () {
  try {
    const user = encodeURIComponent(process.env.MONGODB_USER ?? '')
    const password = encodeURIComponent(process.env.MONGODB_PASSWORD ?? '')
    
    const uri =
      `mongodb+srv://${user}:${password}` +
      `@${process.env.MONGODB_CLUSTER}/${process.env.MONGODB_DATABASE}` +
      `?retryWrites=true&w=majority&appName=Cluster0`
    
    await connect(uri)
    console.log('Connected to MongoDB');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error connecting to database: ${error.message}`);
    } else {
      throw new Error('Error connecting to database');
    }
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
