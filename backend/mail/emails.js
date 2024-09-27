import { VERIFICATION_EMAIL_TEMPLATE } from './emailTemplates.js';
import { client, sender } from './mailtrap.config.js';

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
      category: 'Email verification',
    });
  } catch (err) {}
}
