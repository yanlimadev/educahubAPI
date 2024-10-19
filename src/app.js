const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

// Routers
const authRouter = require('./routes/auth.route.js');
const verifyRouter = require('./routes/verify.route.js');
const recoveryRouter = require('./routes/recovery.route.js');

// Docs
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routers
app.use('/auth', authRouter);
app.use('/verify', verifyRouter);
app.use('/recovery', recoveryRouter);

// api documentation
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;
