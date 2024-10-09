const {
  recoveryPasswordService,
  resetPasswordService,
} = require('../services/recovery.service');
const sendResponse = require('../utils/sendResponse');
const logger = require('../logger');

const recoveryPassword = async (req, res) => {
  const { email } = req.body;
  const { sendSuccess, sendError } = sendResponse(res);

  try {
    await recoveryPasswordService(email);
    sendSuccess(200, 'The recovery password email is sent.', {});
  } catch (error) {
    logger.error(error);
    sendError(error);
  }
};

const resetPassword = async (req, res) => {
  const { recoveryCode } = req.params;
  const { email, newPassword } = req.body;
  const { sendSuccess, sendError } = sendResponse(res);

  try {
    await resetPasswordService(email, newPassword, recoveryCode);
    sendSuccess(200, 'Password reset successfully.', {});
  } catch (error) {
    logger.error(error);
    sendError(error);
  }
};

module.exports = {
  recoveryPassword,
  resetPassword,
};
