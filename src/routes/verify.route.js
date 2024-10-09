const express = require('express');
const verifyController = require('../controllers/verify.controller.js');

const verifyRouter = express.Router();

verifyRouter.post('/email', verifyController.verifyEmail);

module.exports = verifyRouter;
