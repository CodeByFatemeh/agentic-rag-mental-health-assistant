import { Request, Response, NextFunction } from 'express'
import { body, ValidationChain, validationResult } from 'express-validator'

export const loginValidator = [
    body('password').trim().isLength({min: 8}).withMessage('Password must be at least 8 characters long'),
    body('email').trim().isEmail().withMessage('Invalid email')   
];

export const signupValidator = [
  body('name').notEmpty().withMessage('Name is required'),
  ...loginValidator
]

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    Promise.all(validations.map(validation => validation.run(req))).then(() => {
      const errors = validationResult(req)
      if (errors.isEmpty()) {
        return next()
      }
      return res.status(422).json({ errors: errors.array() })
    })
  }
}

export const chatCompletionValidator = [
  body("message").notEmpty().withMessage("Message  is required"),
];