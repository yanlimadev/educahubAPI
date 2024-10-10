const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = async (userId) => {
  const JWT_KEY = process.env.JWT_SECRET;
  const token = await jwt.sign({ userId }, JWT_KEY, {
    expiresIn: '1d',
  });
  return token;
};

module.exports = generateToken;
