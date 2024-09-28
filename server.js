import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import { connectToDatabase } from './src/database/connectDB.js';

// Routers
import authRoutes from './src/routes/auth.route.js';

const app = express();

dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/auth', authRoutes);

app.listen(PORT, (err) => {
  connectToDatabase();
  console.log(`Server is running on port ${PORT}...`);
  console.log(`http://localhost:${PORT}`);
});
