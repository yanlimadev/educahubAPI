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
 * /signup:
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
 *         description: Server error - An error occurred in server processing.
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
 * /verify-email:
 *   post:
 *     summary: Verify the user email
 *     description: Verify the user email address by providing the verification code sent to user's email.
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
 *         description: Server error - An error occurred in server processing.
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
 * /login:
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
 *         description: Server error - An error occurred in server processing.
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
 * /logout:
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
 *         description: Server error - An error occurred in server processing.
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

authRoutes.post('/forgot-password', forgotPassword);

authRoutes.post('/reset-password/:resetPasswordToken', resetPassword);

/**
 * @swagger
 * /check-auth:
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
 *         description: Server error - An error occurred in server processing.
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
