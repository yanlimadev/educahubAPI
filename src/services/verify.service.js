const {
  findUserByEmailRepository,
  updateUserRepository,
} = require('../repositories/user.repository');
const { sendWelcomeEmailService } = require('./mail.service');

const verifyEmailService = async (email, verificationCode) => {
  if (!email || !verificationCode) {
    const error = new Error('Required fields are missing.');
    error.status = 400;
    throw error;
  }

  const user = await findUserByEmailRepository(email);
  if (
    user.emailVerificationCodeExpiresAt - Date.now() < 0 ||
    verificationCode !== user.emailVerificationCode
  ) {
    const error = new Error('Invalid or expired verification code.');
    error.status = 401;
    throw error;
  }

  const data = {
    isVerified: true,
    emailVerificationCode: undefined,
    emailVerificationCodeExpiresAt: undefined,
  };

  await updateUserRepository(user, data);
  await sendWelcomeEmailService(email, user.name);
};

module.exports = {
  verifyEmailService,
};
