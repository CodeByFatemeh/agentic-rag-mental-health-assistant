import { Router } from 'express';
import {
  verifyUser,
  userSignup,
  userLogin,
  userLogout,
} from '../controllers/userController.js';
import { validate, signupValidator, loginValidator } from '../utils/validators.js';
import { verifyToken } from '../middleware/auth.js';

/**
 * @swagger
 * /api/v1/user/signup:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       201: { description: User created }
 */
const userRoutes = Router();

userRoutes.post('/signup', validate(signupValidator), userSignup);
userRoutes.post('/login', validate(loginValidator), userLogin);
userRoutes.get('/auth-status', verifyToken, verifyUser);
userRoutes.get('/logout', verifyToken, userLogout);

export default userRoutes;