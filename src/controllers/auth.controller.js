const {
  signupService,
  checkAuthService,
  loginService,
} = require('../services/auth.service.js');
const logger = require('../logger');
const sendResponse = require('../utils/sendResponse.js');
const cookieConfig = require('../utils/cookieConfig.js');

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  const { sendSuccess, sendError, sendCookie } = sendResponse(res);

  try {
    const user = await signupService(name, email, password);
    await sendCookie(user._id);
    return sendSuccess(201, 'User created successfully.', { user });
  } catch (error) {
    logger.error(error);
    sendError(error, 'signup');
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const { sendSuccess, sendError, sendCookie } = sendResponse(res);

  try {
    const user = await loginService(email, password);
    await sendCookie(user._id);
    return sendSuccess(200, 'Logged successfully.', { user });
  } catch (error) {
    logger.error(error);
    sendError(error, 'signup');
  }
};

const logout = async (req, res) => {
  const { sendSuccess, sendError } = sendResponse(res);

  try {
    res.clearCookie('authToken', cookieConfig);
    return sendSuccess(200, 'Logout successfully.');
  } catch (error) {
    logger.error(error);
    sendError(error, 'signup');
  }
};

const checkAuth = async (req, res) => {
  const token = req.cookies.authToken;
  const { sendSuccess, sendError, sendCookie } = sendResponse(res);

  try {
    const user = await checkAuthService(token);
    sendSuccess(200, 'Authenticated.', { user });
  } catch (error) {
    logger.error(error);
    sendError(error, 'authService');
  }
};

module.exports = {
  signup,
  login,
  logout,
  checkAuth,
};
