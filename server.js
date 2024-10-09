const app = require('./src/app.js');
require('dotenv/config');
const connectDB = require('./src/database/connectDB.js');

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  if (process.env.NODE_ENV === 'production') await connectDB();
  console.log(`Server running on port ${PORT}...`);
});
