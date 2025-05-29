import { verifyUser, userSignup, userLogin, userLogout } from '../controllers/userController.js';
import { Router } from 'express';
import {validate, signupValidator, loginValidator} from '../utils/validators.js';
import { verifyToken } from '../utils/auth.js';

const userRoutes = Router();


userRoutes.post("/signup", validate(signupValidator), userSignup);
userRoutes.post("/login", validate(loginValidator), userLogin);
userRoutes.get("/auth-status", verifyToken, verifyUser);
userRoutes.post("/logout", verifyToken, userLogout);

export default userRoutes
