const User = require('../models/user.model.js');
const generateCode = require('../utils/generateCode.js');
const logger = require('../logger');

const createUserRepository = async (name, email, password) => {
  try {
    const newUser = new User({
      name,
      email,
      password,
      emailVerificationCode: generateCode(),
      emailVerificationCodeExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });
    await newUser.save();

    const user = await User.findOne({ email });
    return user;
  } catch (error) {
    logger.error(error);
    throw new Error('Error creating user');
  }
};

const updateUserRepository = async (user, data) => {
  await User.findOneAndUpdate(user, data);
};

const findUserByEmailRepository = async (email) => {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (error) {
    logger.error(error);
    throw new Error('Error finding user by email');
  }
};

const findUserByIdRepository = async (userId) => {
  try {
    const user = User.findById(userId);
    return user;
  } catch (error) {
    logger.error(error);
    throw new Error('Error finding user by ID');
  }
};

module.exports = {
  findUserByEmailRepository,
  createUserRepository,
  findUserByIdRepository,
  updateUserRepository,
};
