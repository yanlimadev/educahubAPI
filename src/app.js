import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// Documentation imports
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { connectToDatabase } from './database/connectDB.js';

// Routers
import authRoutes from './routes/auth.route.js';

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
app.use('/auth', authRoutes);

export default app;
