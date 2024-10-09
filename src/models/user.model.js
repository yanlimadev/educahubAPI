const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationCode: String,
  emailVerificationCodeExpiresAt: Date,
  recoveryPasswordCode: String,
  recoveryPasswordCodeExpiresAt: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
