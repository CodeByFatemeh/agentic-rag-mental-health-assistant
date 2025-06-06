import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { config } from 'dotenv'
import appRouter from './routes/index.js'
import { errorHandler } from './middleware/errorHandler.js'
import cors from 'cors'
import helmet from 'helmet'
import swaggerUi from 'swagger-ui-express'
import rateLimit from 'express-rate-limit';

const app = express()
config()

const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Each 15 minutes
  max: 5, // Limit on each ip, 5 attempts
  message: 'Too many login attempts, please try again later.',
});

// Use middlewares
app.use(helmet()) // Security middleware
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') ?? [], // Allow multiple origins
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
  })
)
app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup({ swagger: '2.0', paths: {} })
)
console.log('starting app...')
app.use('/api/v1/user/login', loginRateLimiter);
app.use('/api/v1', appRouter)
// Global Error Handler >>> MUST be the last middleware
app.use(errorHandler)

export default app
