import app from './src/app';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
  if (process.env.NODE_ENV !== 'test') {
    connectToDatabase();
    console.log(`Server is running on port ${PORT}...`);
    console.log(`http://localhost:${PORT}`);
  }
});
