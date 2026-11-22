import jwt, { VerifyErrors } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { COOKIE_NAME } from '../config/constants.js'

export const generateToken = (userId: string, expiresIn: string) => {
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

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined')
    return res.status(500).json({
      message: 'Server authentication configuration error'
    })
  }

  if (!token || token.trim() === '') {
    return res.status(401).json({ message: 'No token provided' })
  }
  jwt.verify(
    token,
    process.env.JWT_SECRET,
    (
      err: VerifyErrors | null,
      decoded: string | jwt.JwtPayload | undefined
    ) => {
      if (err) {
        return res.status(401).json({ message: err.message || 'Invalid token' })
      }
      res.locals.jwtData = decoded
      next()
    }
  )
}
