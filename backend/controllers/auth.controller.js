import { User } from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import { generateVerificationToken } from '../utils/generateVerificationToken.js';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordRecoveryEmail,
} from '../mail/emails.js';

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Throws an error if one of the fields is empty
    if (!name || !email || !password) {
      throw new Error('All fields required!');
    }

    // Throws an error if there is a user in the database with the same email
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: 'User already exists!' });
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
      message: 'user created successfully',
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid credentials' });
    }

    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid credentials' });
    }

    generateTokenAndSetCookie(res, user._id);

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Logged successfully',
      user: { ...user._doc, password: undefined },
    });
  } catch (err) {
    console.log('Login error: ', err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const verifyEmail = async (req, res) => {
  const { verificationCode } = req.body;

  try {
    const user = await User.findOne({
      verificationToken: verificationCode,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid or expired token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: 'email verified successfully',
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
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'User not found' });
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
      message: 'Password reset Link sent to your email',
    });
  } catch (err) {
    console.log('Error in forgot password: ', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
