const express = require('express');
const recoveryController = require('../controllers/recovery.controller.js');

const recoveryRouter = express.Router();

recoveryRouter.post('/password', recoveryController.recoveryPassword);
recoveryRouter.post(
  '/password/:recoveryCode',
  recoveryController.resetPassword
);

module.exports = recoveryRouter;
