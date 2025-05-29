import jwt, { VerifyErrors } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { COOKIE_NAME } from '../config/constants.js'

export const generateToken = (
  userId: string,
  expiresIn: string
) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables')
  }
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: expiresIn
  } as jwt.SignOptions)

  return token
}

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.signedCookies[`${COOKIE_NAME}`]

  console.log("token", token)
  console.log("Logout 1");

  if (!token || token.trim() === '') {
    return res.status(401).json({ message: 'No token provided' })
  }

  try {
    jwt.verify(
      token,
      process.env.JWT_SECRET as jwt.Secret,
      (
        err: VerifyErrors | null,
        decoded: string | jwt.JwtPayload | undefined
      ) => {
        if (err) {
          return res
            .status(401)
            .json({ message: err.message || 'Invalid token' })
        }
        res.locals.jwtData = decoded
        next()
      }
    )
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}
