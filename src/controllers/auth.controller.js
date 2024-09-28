import bcryptjs from 'bcryptjs';
import crypto from 'crypto';

// The user model
import { User } from '../models/user.model.js';

// Utils
import { generateVerificationToken } from '../utils/generateVerificationToken.js';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';

// Email send functions
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordRecoveryEmail,
  sendPasswordResetSuccessEmail,
} from '../mail/emails.js';

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Throws an error if one of the fields is empty
    if (!name || !email || !password) {
      return res.status(400).json({
        // Bad request
        success: false,
        message: 'Required fields are missing',
      });
    }

    // Throws an error if there is a user in the database with the same email
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res.status(409).json({
        // Conflict
        success: false,
        message: 'User already exists!',
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = generateVerificationToken();

    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    // Send user data to database
    await user.save();

    generateTokenAndSetCookie(res, user._id);

    sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (err) {
    console.log('Error on signup: ', err.message);
    res.status(500).json({
      // Internal server error
      success: false,
      message: 'An unexpected error occurred. Please try again later',
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      // Bad request
      success: false,
      message: 'Required fields are missing',
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        // Bad request
        success: false,
        message: 'Invalid credentials',
      });
    }

    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        // Bad request
        success: false,
        message: 'Invalid credentials',
      });
    }

    generateTokenAndSetCookie(res, user._id);

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      // Success
      success: true,
      message: 'Login successful.',
      user: { ...user._doc, password: undefined },
    });
  } catch (err) {
    console.log('Login error: ', err.message);
    res.status(500).json({
      // Internal server error
      success: false,
      message: 'An unexpected error occurred. Please try again later',
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('token');
    res
      .status(200)
      .json({ success: true, message: 'Logged out successfully.' });
  } catch (err) {
    console.log('Logout error: ', err.message);
    res.status(500).json({
      // Internal server error
      success: false,
      message: 'An unexpected error occurred. Please try again later',
    });
  }
};

export const verifyEmail = async (req, res) => {
  const { verificationCode } = req.body;
  if (!verificationCode) {
    return res.status(400).json({
      // Bad request
      success: false,
      message: 'Required fields are missing',
    });
  }

  try {
    const user = await User.findOne({
      verificationToken: verificationCode,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code',
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (err) {
    console.log('Verification email error: ', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      // Bad request
      success: false,
      message: 'Required fields are missing',
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid credentials' });
    }

    const recoveryToken = crypto.randomBytes(20).toString('hex');
    const recoveryTokenExpiresAt = Date.now() + 60 * 60 * 1000; // One hour

    user.resetPasswordToken = recoveryToken;
    user.resetPasswordTokenExpiresAt = recoveryTokenExpiresAt;

    await user.save();

    await sendPasswordRecoveryEmail(
      email,
      user.name,
      `${process.env.CLIENT_URL}/reset-password/${recoveryToken}`,
    );

    res.status(200).json({
      success: true,
      message: 'User not found.',
    });
  } catch (err) {
    console.log('Error in forgot password: ', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const resetPassword = async (req, res) => {
  const { resetPasswordToken } = req.params;
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({
      // Bad request
      success: false,
      message: 'Required fields are missing',
    });
  }

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid or expired reset token' });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiresAt = undefined;

    await user.save();

    // TODO: Send reset success email
    sendPasswordResetSuccessEmail(user.email, user.name);

    res
      .status(200)
      .json({ success: true, message: 'Password has been reset successfully' });
  } catch (err) {
    console.log('Reset password error: ', err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({ success: true, user });
  } catch (err) {
    console.log('Error in check auth: ', err.message);
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred. Please try again later',
    });
  }
};
