const {
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
  PASSWORD_RECOVERY_EMAIL_TEMPLATE,
  PASSWORD_RECOVERY_SUCCESS_EMAIL_TEMPLATE,
} = require('../mail/mailtrap.templates.js');

const { client, sender } = require('../mail/mailtrap.config.js');

const sendVerificationEmailService = async (email, verificationCode) => {
  const recipient = [{ email }];

  try {
    client.send({
      from: sender,
      to: recipient,
      subject: 'Verify your email',
      category: 'Email Verification',
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        '{verificationCode}',
        verificationCode
      ),
    });
  } catch (error) {
    console.log('Send verification email error: ', error);
  }
};

const sendWelcomeEmailService = (email, Username) => {
  const recipient = [{ email }];

  try {
    client.send({
      from: sender,
      to: recipient,
      subject: 'Welcome to educahub',
      category: 'Welcome',
      html: WELCOME_EMAIL_TEMPLATE.replace('{Username}', Username),
    });
  } catch (error) {
    console.log('Send welcome email error: ', error);
  }
};

const sendPasswordRecoveryEmailService = (email, username, resetURL) => {
  const recipient = [{ email }];

  try {
    client.send({
      from: sender,
      to: recipient,
      subject: 'Password reset request',
      category: 'Password Recovery',
      html: PASSWORD_RECOVERY_EMAIL_TEMPLATE.replace(
        '{username}',
        username
      ).replace('{resetURL}', resetURL),
    });
  } catch (error) {
    console.log('Send password recovery email error: ', error);
  }
};

const sendPasswordResetSuccessEmailService = (email, username) => {
  const recipient = [{ email }];

  try {
    client.send({
      from: sender,
      to: recipient,
      subject: 'Password reset successfully',
      category: 'Password recovery',
      html: PASSWORD_RECOVERY_SUCCESS_EMAIL_TEMPLATE.replace(
        '{username}',
        username
      ),
    });
  } catch (error) {
    console.log('Send welcome email error: ', error);
  }
};

module.exports = {
  sendVerificationEmailService,
  sendWelcomeEmailService,
  sendPasswordRecoveryEmailService,
  sendPasswordResetSuccessEmailService,
};
