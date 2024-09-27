import mongoose from 'mongoose';

export const connectToDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.log('Error connection to MongoDb: ', err.message);
    process.exit(1);
  }
};
