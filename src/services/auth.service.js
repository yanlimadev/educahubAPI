const {
  findUserByEmailRepository,
  createUserRepository,
  findUserByIdRepository,
} = require('../repositories/user.repository.js');
const decodeToken = require('../utils/decodeToken.js');
const bcrypt = require('bcryptjs');
const { sendVerificationEmailService } = require('./mail.service.js');
const excludeSecretFields = require('../utils/excludeSecretFields.js');

const signupService = async (name, email, password) => {
  if (!name || !email || !password) {
    const error = new Error('Required fields are missing.');
    error.status = 400;
    throw error;
  }

  const existingUser = await findUserByEmailRepository(email);
  if (existingUser) {
    const error = new Error('User already exists.');
    error.status = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await createUserRepository(name, email, hashedPassword);

  const verificationCode = newUser.emailVerificationCode;
  await sendVerificationEmailService(email, verificationCode);

  return { ...newUser._doc, ...excludeSecretFields };
};

const loginService = async (email, password) => {
  if (!email || !password) {
    const error = new Error('Required fields are missing.');
    error.status = 400;
    throw error;
  }

  const user = await findUserByEmailRepository(email);
  if (!user) {
    const error = new Error('User not found.');
    error.status = 401;
    throw error;
  }

  const hashedPassword = user.password;

  const isMatch = await bcrypt.compare(passwords, hashedPassword);
  if (!isMatch) {
    const error = new Error('Invalid credentials.');
    error.status = 401;
    throw error;
  }

  return { ...user._doc, ...excludeSecretFields };
};

const checkAuthService = async (token) => {
  if (!token) {
    const error = new Error('The authentication token is invalid or missing.');
    error.status = 401;
    throw error;
  }

  const decoded = await decodeToken(token);

  if (!decoded) {
    const error = new Error('The authentication token is invalid or missing.');
    error.status = 401;
    throw error;
  }

  const userId = decoded.userId;
  const user = await findUserByIdRepository(userId);
  if (!user) {
    const error = new Error('User not found.');
    error.status = 401;
    throw error;
  }

  return { ...user._doc, ...excludeSecretFields };
};

module.exports = {
  signupService,
  loginService,
  checkAuthService,
};
