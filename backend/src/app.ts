import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { config } from 'dotenv'
import appRouter from './routes/index.js'
import { errorHandler } from "./middleware/errorHandler.js";
import cors from 'cors'
import helmet from 'helmet';

const app = express()
config()

console.log('Environment Variables:', {
  ALLOWED_ORIGIN: process.env.ALLOWED_ORIGINS,
  PORT: process.env.PORT,
})
// Use middlewares
app.use(helmet()) // Security middleware
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') ?? [], // Allow multiple origins
    credentials: true
  })
)
app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser(process.env.COOKIE_SECRET))
console.log('starting app...')
app.use('/api/v1', appRouter)
// Global Error Handler >>> MUST be the last middleware
app.use(errorHandler);

export default app

