import mongoose from 'mongoose';

import dotenv from 'dotenv';
dotenv.config();

export const connectToDatabase = async () => {
  try {
    const dbURI = process.env.MONGO_URI;

    const conn = await mongoose.connect(dbURI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.log('Error connection to MongoDb: ', err.message);
    process.exit(1);
  }
};
