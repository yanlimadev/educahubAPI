const express = require('express');
const authController = require('../controllers/auth.controller.js');

const authRouter = express.Router();

authRouter.post('/signup', authController.signup);
authRouter.post('/login', authController.login);
authRouter.post('/logout', authController.logout);
authRouter.get('/check-auth', authController.checkAuth);

module.exports = authRouter;
