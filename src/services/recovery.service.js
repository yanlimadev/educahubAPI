const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const {
  findUserByEmailRepository,
  updateUserRepository,
} = require('../repositories/user.repository');
const {
  sendPasswordRecoveryEmailService,
  sendPasswordResetSuccessEmailService,
} = require('./mail.service');

require('dotenv/config');

const recoveryPasswordService = async (email) => {
  if (!email) {
    const error = new Error('Required fields are missing.');
    error.status = 400;
    throw error;
  }

  const user = await findUserByEmailRepository(email);
  if (!user) {
    const error = new Error('User not found.');
    error.status = 401;
    throw error;
  }

  const recoveryPasswordCode = crypto.randomBytes(20).toString('hex');
  const recoveryPasswordCodeExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

  const data = {
    recoveryPasswordCode,
    recoveryPasswordCodeExpiresAt,
  };

  await updateUserRepository(user, data);
  await sendPasswordRecoveryEmailService(
    email,
    user.name,
    `${process.env.CLIENT_URL}/reset-password/${recoveryPasswordCode}`
  );
};

const resetPasswordService = async (email, newPassword, recoveryCode) => {
  if (!email || !newPassword || !recoveryCode) {
    const error = new Error('Required fields are missing.');
    error.status = 400;
    throw error;
  }

  const user = await findUserByEmailRepository(email);
  if (
    recoveryCode !== user.recoveryPasswordCode ||
    user.recoveryPasswordCodeExpiresAt - Date.now() < 0
  ) {
    const error = new Error('Invalid or expired recovery code.');
    error.status = 401;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const data = {
    recoveryPasswordCode: undefined,
    recoveryPasswordCodeExpiresAt: undefined,
    password: hashedPassword,
  };

  await updateUserRepository(user, data);
  await sendPasswordResetSuccessEmailService(email, user.name);
};

module.exports = {
  recoveryPasswordService,
  resetPasswordService,
};
