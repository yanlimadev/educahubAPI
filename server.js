import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// Documentation imports
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { connectToDatabase } from './src/database/connectDB.js';

// Routers
import authRoutes from './src/routes/auth.route.js';

const app = express();

// Docs
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'EducaHub API',
      version: '1.0.0',
      description: 'API for EducaHub platform',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Basic Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routers
app.use(authRoutes);

// PORT
dotenv.config();
const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
  connectToDatabase();
  console.log(`Server is running on port ${PORT}...`);
  console.log(`http://localhost:${PORT}`);
});
