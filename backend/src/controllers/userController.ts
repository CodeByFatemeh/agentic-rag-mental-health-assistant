import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/userSchema.js'
import { generateToken } from '../middleware/auth.js'
import {
  COOKIE_NAME,
  EXPIRES_IN_DAYS,
  USER_ALREADY_REGISTERED,
  OK_MESSAGE,
  USER_NOT_FOUND,
  INCORRECT_PASSWORD,
  UNAUTHORIZED_MESSAGE,
  LOGOUT_SUCCESSFUL
} from '../config/constants.js'
import { handleApiError } from '../utils/handleApiError.js'
import AppError from '../utils/AppError.js'
import {
  SignupResponse,
  LoginResponse,
  AuthStatusResponse,
  ApiResponse
} from '../types/index.js'

interface AuthRequest extends Request {
  body: {
    name?: string
    email: string
    password: string
  }
}

const getCookieOptions = () => {
  const expires = new Date()
  expires.setDate(expires.getDate() + EXPIRES_IN_DAYS)

  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    sameSite: 'strict' as const,
    expires
  }
}

export const userSignup = async (
  req: AuthRequest,
  res: Response,
  _next: NextFunction
) => {
  try {
    const { name, email, password } = req.body
    if (await User.findOne({ email })) {
      return res.status(401).json({ message: USER_ALREADY_REGISTERED })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({ name, email, password: hashedPassword })
    await user.save()

    const token = generateToken(user._id.toString(), `${EXPIRES_IN_DAYS}d`)
    res.cookie(COOKIE_NAME, token, getCookieOptions())

    return res.status(201).json({
      message: OK_MESSAGE,
      data: { _id: user._id, name: user.name, email: user.email }
    } as SignupResponse)
  } catch (error) {
    const { message, statusCode, errorObject } = handleApiError(
      'User Signup',
      error
    )
    return res.status(statusCode).json({ message, error: errorObject })
  }
}

export const userLogin = async (
  req: AuthRequest,
  res: Response,
  _next: NextFunction
) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ message: USER_NOT_FOUND })

    // Compare client-hashed password with stored hash
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: INCORRECT_PASSWORD })
    }

    res.clearCookie(COOKIE_NAME, getCookieOptions())
    const token = generateToken(user._id.toString(), `${EXPIRES_IN_DAYS}d`)
    res.cookie(COOKIE_NAME, token, getCookieOptions())

    return res.status(200).json({
      message: OK_MESSAGE,
      data: { _id: user._id, name: user.name, email: user.email }
    } as LoginResponse)
  } catch (error) {
    const { message, statusCode, errorObject } = handleApiError(
      'User Login',
      error
    )
    return res.status(statusCode).json({ message, error: errorObject })
  }
}

export const verifyUser = async (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const user = await User.findById(res.locals.jwtData.userId)
    if (!user) {
      return res.status(401).json({ message: UNAUTHORIZED_MESSAGE })
    }

    return res.status(200).json({
      loggedIn: true,
      user: { _id: user._id, name: user.name, email: user.email }
    } as AuthStatusResponse)
  } catch (error) {
    const { message, statusCode, errorObject } = handleApiError(
      'Verify User',
      error
    )
    return res.status(statusCode).json({ message, error: errorObject })
  }
}

export const userLogout = async (_req: Request, res: Response) => {
  try {
    if (!res.locals.jwtData) {
      throw new AppError(UNAUTHORIZED_MESSAGE, 401)
    }
    res.clearCookie(COOKIE_NAME, getCookieOptions())
    return res.status(200).json({
      message: LOGOUT_SUCCESSFUL,
      data: null
    } as ApiResponse<null>)
  } catch (error) {
    const { message, statusCode, errorObject } = handleApiError(
      'User Logout',
      error
    )
    return res.status(statusCode).json({ message, error: errorObject })
  }
}
