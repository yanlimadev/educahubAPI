const cookieConfig = require('./cookieConfig.js');
const generateToken = require('./generateToken.js');

const sendResponse = (res) => {
  return {
    sendSuccess: (status, message, data) => {
      res.status(status).send({ success: true, message, ...data });
    },
    sendError: (error, action) => {
      const status = error.status || 500;
      const message = error.message || `Internal server error.`;
      res.status(status).send({ success: false, message });
    },
    sendCookie: async (userId) => {
      const token = await generateToken(userId);
      res.cookie('authToken', token, cookieConfig);
    },
  };
};

module.exports = sendResponse;
