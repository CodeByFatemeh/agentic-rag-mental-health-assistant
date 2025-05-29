import { Request, Response, NextFunction } from 'express'
import { hash, compare } from 'bcrypt'
import User from '../models/userSchema.js'
import { generateToken } from '../utils/auth.js'
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

// Cookie config function
const getCookieOptions = () => {
  const expires = new Date()
  expires.setDate(expires.getDate() + EXPIRES_IN_DAYS)

  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    sameSite: 'strict' as const,
    expires,
  }
}

const userSignup = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const { name, email, password } = req.body
    if (await User.findOne({ email })) {
      return res.status(401).json({ message: USER_ALREADY_REGISTERED })
    }

    const hashedPassword = await hash(password, 10)
    const user = new User({ name, email, password: hashedPassword })
    await user.save()

    const token = generateToken(user._id.toString(), `${EXPIRES_IN_DAYS}d`)
    res.cookie(COOKIE_NAME, token, getCookieOptions())

    return res
      .status(201)
      .json({ message: OK_MESSAGE, data: { id: user._id, name: user.name } })
    } catch (error) {
      const { message, statusCode, errorObject } = handleApiError(
        'User Signup',
        error
      );
      return res.status(statusCode).json({ message, error: errorObject });
    }
}

const userLogin = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    console.log("Login 1");
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ message: USER_NOT_FOUND })
    const validPassword = await compare(password, user.password ?? '')
    if (!validPassword)
      return res.status(403).json({ message: INCORRECT_PASSWORD })

    // Clear old cookie
    res.clearCookie(COOKIE_NAME, getCookieOptions())

    // Set new cookie
    const token = generateToken(user._id.toString(), `${EXPIRES_IN_DAYS}d`)
    res.cookie(COOKIE_NAME, token, getCookieOptions())

    return res
      .status(200)
      .json({ message: OK_MESSAGE, data: { id: user._id, name: user.name } })
    } catch (error) {
      const { message, statusCode, errorObject } = handleApiError(
        'User Login',
        error
      );
      return res.status(statusCode).json({ message, error: errorObject });
    }
}

const verifyUser = async (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.userId)

    if (!user) {
      return res.status(401).json({ message: UNAUTHORIZED_MESSAGE })
    }

    return res
      .status(200)
      .json({ message: OK_MESSAGE, data: { id: user._id, name: user.name, email: user.email } })
    } catch (error) {
      const { message, statusCode, errorObject } = handleApiError(
        'Verify User',
        error
      );
      return res.status(statusCode).json({ message, error: errorObject });
    }
}

const userLogout = async (_req: Request, res: Response) => {
  try {
    console.log("Logout 3");

    //user token check
    if (!res.locals.jwtData) {
      throw new AppError(UNAUTHORIZED_MESSAGE, 401)
    }

    res.clearCookie(COOKIE_NAME, getCookieOptions())

    return res.status(200).json({ message: LOGOUT_SUCCESSFUL, data: null })
  } catch (error) {
    const { message, statusCode, errorObject } = handleApiError(
      'User Logout',
      error
    );
    return res.status(statusCode).json({ message, error: errorObject });
  }
}

export { verifyUser, userSignup, userLogin, userLogout }
