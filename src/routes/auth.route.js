import express from 'express';
import {
  forgotPassword,
  login,
  logout,
  signup,
  verifyEmail,
  resetPassword,
  checkAuth,
} from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const authRoutes = express.Router();

authRoutes.post('/signup', signup);

authRoutes.post('/verify-email', verifyEmail);

authRoutes.post('/login', login);

authRoutes.post('/logout', logout);

// Reset password routes
authRoutes.post('/forgot-password', forgotPassword);
authRoutes.post('/reset-password/:resetPasswordToken', resetPassword);

// Check the cookies to verify authentication
authRoutes.get('/check-auth', verifyToken, checkAuth);

export default authRoutes;
