const jwt = require('jsonwebtoken');
require('dotenv').config();

const decodeToken = async (token) => {
  const JWT_KEY = process.env.JWT_SECRET;
  const decoded = await jwt.verify(token, JWT_KEY);
  return decoded;
};

module.exports = decodeToken;
