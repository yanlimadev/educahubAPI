const excludeSecretFields = {
  password: undefined,
  emailVerificationCode: undefined,
  emailVerificationCodeExpiresAt: undefined,
  recoveryPasswordCode: undefined,
  recoveryPasswordCodeExpiresAt: undefined,
  __v: undefined,
};

module.exports = excludeSecretFields;
