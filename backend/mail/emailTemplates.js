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
