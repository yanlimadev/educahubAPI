import express from 'express';

// Controller functions
import {
  forgotPassword,
  login,
  logout,
  signup,
  verifyEmail,
  resetPassword,
  checkAuth,
} from '../controllers/auth.controller.js';

// Middlewares
import { verifyToken } from '../middleware/verifyToken.js';

const authRoutes = express.Router();

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Create a new user account
 *     description: Register a new user by providing their name, email, and password. The password will be hashed before saving the user, and a JWT will be generated and sent as a cookie for authentication. A verification email is sent to user email address.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "securePassword123"
 *     responses:
 *       200:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   enum: [true]
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "ad6f72d3d9a94a4cf5410152f"
 *                     email:
 *                       type: string
 *                       example: "johndoe@yanlima.com"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     isVerified:
 *                       type: boolean
 *                       enum: [false]
 *                     verificationToken:
 *                       type: string
 *                       example: 123456
 *                     verificationTokenExpiresAt:
 *                       type: string
 *                       format: date
 *                       example: "2024-09-29T11:18:29.736Z"
 *                     lastLogin:
 *                       type: string
 *                       example: "2024-09-28T10:16:08.866Z"
 *       400:
 *         description: Required fields are missing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   enum: [false]
 *                 message:
 *                   type: string
 *                   enum: ["Required fields are missing."]
 *       409:
 *         description: User already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   enum: [false]
 *                 message:
 *                   type: string
 *                   enum: ["User already exists."]
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   enum: [false]
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred. Please try again later"
 */
authRoutes.post('/signup', signup);

/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     summary: Verify the user email
 *     description: Verify the user email address by providing the verification code sent to user's email and if successful send a welcome email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - verificationCode
 *             properties:
 *               verificationCode:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Email verified successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   enum: [true]
 *                 message:
 *                   type: string
 *                   enum: ["Email verified successfully"]
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "ad6f72d3d9a94a4cf5410152f"
 *                     email:
 *                       type: string
 *                       example: "johndoe@yanlima.com"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     isVerified:
 *                       type: boolean
 *                       enum: [true]
 *                     lastLogin:
 *                       type: string
 *                       example: "2024-09-28T10:16:08.866Z"
 *       400:
 *         description: The verification code is invalid, expired or missing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   enum: [false]
 *                 message:
 *                   type: string
 *                   enum: ["Invalid or expired verification code.", "Required fields are missing."]
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   enum: [false]
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred. Please try again later"
 */
authRoutes.post('/verify-email', verifyEmail);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user using email and password. If valid, returns a JWT in a cookie for authentication, and the user information.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "securePassword123"
 *     responses:
 *       200:
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   enum: [true]
 *                 message:
 *                   type: string
 *                   enum: ["Login successful."]
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "ad6f72d3d9a94a4cf5410152f"
 *                     email:
 *                       type: string
 *                       example: "johndoe@yanlima.com"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     isVerified:
 *                       type: boolean
 *                       enum: [true]
 *                     lastLogin:
 *                       type: string
 *                       format: date
 *                       example: "2024-09-28T10:16:08.866Z"
 *       400:
 *         description: Invalid credentials or required fields are missing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   enum: [false]
 *                 message:
 *                   type: string
 *                   enum: ["Invalid or expired verification code.", "Required fields are missing."]
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   enum: [false]
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred. Please try again later"
 */
authRoutes.post('/login', login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: User logout
 *     description: Logout the user by deleting the authentication cookie.
 *     responses:
 *       200:
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   enum: [true]
 *                 message:
 *                   type: string
 *                   enum: ["Logged out successfully."]
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   enum: [false]
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred. Please try again later"
 */
authRoutes.post('/logout', logout);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Sends a password recovery email to the user.
 *     description: Generate a recovery token and sends it to the user's email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "johndoe@example.com"
 *     responses:
 *       200:
 *         description: Password reset Link sent.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   enum: [true]
 *                 message:
 *                   type: string
 *                   enum: ["Password reset Link sent."]
 *       400:
 *         description: Invalid credentials or required fields are missing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   enum: [false]
 *                 message:
 *                   type: string
 *                   enum: ["User not found.", "Required fields are missing."]
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   enum: [false]
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred. Please try again later"
 */
authRoutes.post('/forgot-password', forgotPassword);

/**
 * @swagger
 * /auth/reset-password/{resetPasswordToken}:
 *   post:
 *     summary: Reset user password
 *     description: Reset the user password by providing a valid password recovery token and send a success email.
 *     parameters:
 *       - in: path
 *         name: resetPasswordToken
 *         schema:
 *           type: string
 *         required: true
 *         description: Token sent to the user's email for password reset.
 *         example: "12345abcde"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The new password to set.
 *                 example: "newSecurePassword123"
 *     responses:
 *       200:
 *         description: Password reset successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   enum: [true]
 *                 message:
 *                   type: string
 *                   example: "Password has been reset successfully."
 *       400:
 *         description: Invalid or expired token, or required fields missing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   enum: [false]
 *                 message:
 *                   type: string
 *                   enum: ["Invalid or expired reset token.", "required fields are missing"]
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   enum: [false]
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred. Please try again later."
 */
authRoutes.post('/reset-password/:resetPasswordToken', resetPassword);

/**
 * @swagger
 * /auth/check-auth:
 *   get:
 *     summary: Check if  the user is authenticated
 *     description: Validates the authentication token in cookies and returns the user information if the token is valid.
 *     responses:
 *       200:
 *         description: Token is valid, the user is authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   enum: [true]
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "ad6f72d3d9a94a4cf5410152f"
 *                     email:
 *                       type: string
 *                       example: "johndoe@yanlima.com"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     isVerified:
 *                       type: boolean
 *                       example: true
 *                     lastLogin:
 *                       type: string
 *                       example: "2024-09-28T10:16:08.866Z"
 *       401:
 *         description: Unauthorized, the token is missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   enum: [true]
 *                 message:
 *                   type: string
 *                   enum: ["Unauthorized - The token is missing", "Unauthorized - The token is invalid"]
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   enum: [false]
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred. Please try again later"
 *
 *
 */
authRoutes.get('/check-auth', verifyToken, checkAuth);

export default authRoutes;
