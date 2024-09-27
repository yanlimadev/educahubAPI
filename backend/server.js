import express from 'express';
import dotenv from 'dotenv';
import { connectToDatabase } from './database/connectDB.js';
import authRoutes from './routes/auth.route.js';

const app = express();

dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('OK...');
});

app.use('/auth', authRoutes);

app.listen(PORT, (err) => {
  connectToDatabase();
  console.log(`Server is running on port ${PORT}...`);
  console.log(`http://localhost:${PORT}`);
});
