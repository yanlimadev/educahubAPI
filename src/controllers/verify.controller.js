const { verifyEmailService } = require('../services/verify.service');
const sendResponse = require('../utils/sendResponse');
const logger = require('../logger');

const verifyEmail = async (req, res) => {
  const { email, verificationCode } = req.body;
  const { sendSuccess, sendError } = sendResponse(res);

  try {
    await verifyEmailService(email, verificationCode);
    sendSuccess(200, 'Verified Successfully.', {});
  } catch (error) {
    logger.error(error);
    sendError(error);
  }
};

module.exports = {
  verifyEmail,
};
