export const VERIFICATION_EMAIL_TEMPLATE = `<!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            background-color: #4caf50;
            color: white;
            padding: 10px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            margin: 20px 20px;
          }
          .footer {
            background-color: #ddd;
            color: #333;
            padding: 10px;
            text-align: center;
            border-radius: 0 0 10px 10px;
          }
          .code {
            font-size: 24px;
            font-weight: bold;
            color: #4caf50;
            text-align: center;
          }
          .cta {
            text-align: center;
            margin: 20px 0;
          }
          .cta button {
            background-color: #4caf50;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
          }
          .cta button:hover {
            background-color: #45a049;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to EducaHub</h1>
          </div>
          <div class="content">
            <p>Hello, thank you for registering at EducaHub!</p>
            <p>
              To complete your registration, please use the following verification
              code:
            </p>
            <p class="code">{verificationCode}</p>
            <div class="cta">
              <p>Or click the button below to verify your account:</p>
              <button>Verify Account</button>
            </div>
          </div>
          <div class="footer">
            <p>&copy; 2024 EducaHub. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>`;

export const WELCOME_EMAIL_TEMPLATE = `
  <!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
    .header { background-color: #4CAF50; color: white; padding: 10px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { margin: 20px 20px; }
    .footer { background-color: #ddd; color: #333; padding: 10px; text-align: center; border-radius: 0 0 10px 10px; }
    .welcome-title { font-size: 24px; color: #333; }
    .highlight { color: #4CAF50; font-weight: bold; }
    .cta { text-align: center; margin: 20px 0; }
    .cta button { background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; }
    .cta button:hover { background-color: #45a049; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to EducaHub</h1>
    </div>
    <div class="content">
      <p class="welcome-title">Hello <span class="highlight">{Username}</span>,</p>
      <p>Welcome to <strong>EducaHub</strong>! We are excited to have you join our community of learners and educators.</p>
      <p>At EducaHub, you will find a variety of resources and tools designed to help you grow your knowledge and enhance your skills.</p>
      <div class="cta">
        <p>To get started, click the button below:</p>
        <button>Start Exploring</button>
      </div>
    </div>
    <div class="footer">
      <p>&copy; 2024 EducaHub. All rights reserved.</p>
      <p><a href="#">Unsubscribe</a> | <a href="#">Contact Us</a></p>
    </div>
  </div>
</body>
</html>`;

export const PASSWORD_RECOVERY_EMAIL_TEMPLATE = `
  <!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
    .header { background-color: #4CAF50; color: white; padding: 10px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { margin: 20px 20px; }
    .footer { background-color: #ddd; color: #333; padding: 10px; text-align: center; border-radius: 0 0 10px 10px; }
    .highlight { color: #4CAF50; font-weight: bold; }
    .cta { text-align: center; margin: 20px 0; }
    .cta a { background-color: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-size: 16px; display: inline-block; }
    .cta a:hover { background-color: #45a049; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Password Reset Request</h1>
    </div>
    <div class="content">
      <p>Hello <span class="highlight">{username}</span>,</p>
      <p>We received a request to reset your password for your EducaHub account.</p>
      <p>If you didn't make this request, you can ignore this email. Otherwise, click the button below to reset your password:</p>
      <div class="cta">
        <a href="{resetLink}" target="_blank">Reset Password</a>
      </div>
      <p>This link will expire in 24 hours.</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 EducaHub. All rights reserved.</p>
      <p><a href="#">Unsubscribe</a> | <a href="#">Contact Us</a></p>
    </div>
  </div>
</body>
</html>
`;
