import { client, sender } from './mailtrap.config.js';

// Email templates
import {
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
  PASSWORD_RECOVERY_EMAIL_TEMPLATE,
  PASSWORD_RECOVERY_SUCCESS_EMAIL_TEMPLATE,
} from './emailTemplates.js';

export async function sendVerificationEmail(email, verificationCode) {
  const recipient = [{ email }];

  try {
    client.send({
      from: sender,
      to: recipient,
      subject: 'Verify your email',
      category: 'Email Verification',
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        '{verificationCode}',
        verificationCode,
      ),
    });
  } catch (err) {
    console.log('Send verification email error: ', err.message);
  }
}

export async function sendWelcomeEmail(email, Username) {
  const recipient = [{ email }];

  try {
    client.send({
      from: sender,
      to: recipient,
      subject: 'Welcome to educahub',
      category: 'Welcome',
      html: WELCOME_EMAIL_TEMPLATE.replace('{Username}', Username),
    });
  } catch (err) {
    console.log('Send welcome email error: ', err.message);
  }
}

export async function sendPasswordRecoveryEmail(email, username, resetURL) {
  const recipient = [{ email }];

  try {
    client.send({
      from: sender,
      to: recipient,
      subject: 'Password reset request',
      category: 'Password Recovery',
      html: PASSWORD_RECOVERY_EMAIL_TEMPLATE.replace(
        '{username}',
        username,
      ).replace('{resetURL}', resetURL),
    });
  } catch (err) {
    console.log('Send password recovery email error: ', err.message);
  }
}

export async function sendPasswordResetSuccessEmail(email, username) {
  const recipient = [{ email }];

  try {
    client.send({
      from: sender,
      to: recipient,
      subject: 'Password reset successfully',
      category: 'Password recovery',
      html: PASSWORD_RECOVERY_SUCCESS_EMAIL_TEMPLATE.replace(
        '{username}',
        username,
      ),
    });
  } catch (err) {
    console.log('Send welcome email error: ', err.message);
  }
}
