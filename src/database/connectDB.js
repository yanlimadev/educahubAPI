const mongoose = require('mongoose');
const logger = require('../logger');
require('dotenv/config');

const DB_URI = process.env.DB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log('Connected to database');
  } catch (error) {
    logger.error(error);
    console.error('Database connection error');
  }
};

module.exports = connectDB;
