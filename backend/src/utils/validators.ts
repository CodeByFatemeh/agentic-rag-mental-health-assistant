import { Request, Response, NextFunction } from 'express';
import { body, ValidationChain, validationResult } from 'express-validator';

export const loginValidator: ValidationChain[] = [
  body('password')
    .trim()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('email').trim().isEmail().withMessage('Invalid email'),
];

export const signupValidator: ValidationChain[] = [
  body('name').notEmpty().withMessage('Name is required'),
  ...loginValidator,
];

export const chatCompletionValidator: ValidationChain[] = [
  body('message')
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ max: 1000 })
    .withMessage('Message must be under 1000 characters'),
  body('sessionId')
    .optional()
    .matches(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    .withMessage('Invalid sessionId format'),
];

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();
    return res.status(422).json({ errors: errors.array() });
  };
};