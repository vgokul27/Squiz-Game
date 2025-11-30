import nodemailer from "nodemailer";

let transporter;

// Initialize email service (call this AFTER dotenv loads)
export const initializeEmailService = () => {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "sandbox.smtp.mailtrap.io",
    port: Number(process.env.EMAIL_PORT) || 2525,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Verify connection
  transporter.verify((error, success) => {
    if (error) {
      console.error("❌ Email service connection failed:", error);
    } else {
      console.log("✅ Email service is ready to send emails");
    }
  });
};

// Send verification email
export const sendVerificationEmail = async (email, token, username) => {
  if (!transporter) {
    throw new Error("Email service not initialized");
  }

  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Squiz Game" <noreply@squizgame.com>',
    to: email,
    subject: "✨ Verify Your Email - Squiz Game",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #18181b;
              color: #ffffff;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 12px;
              padding: 40px;
              text-align: center;
            }
            .logo {
              font-size: 48px;
              margin-bottom: 20px;
            }
            h1 {
              color: #ffffff;
              margin-bottom: 20px;
            }
            p {
              color: #e4e4e7;
              font-size: 16px;
              line-height: 1.6;
              margin-bottom: 30px;
            }
            .button {
              display: inline-block;
              background-color: #ffffff;
              color: #764ba2;
              padding: 15px 40px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
              font-size: 16px;
            }
            .footer {
              margin-top: 30px;
              font-size: 12px;
              color: #d4d4d8;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">⚡</div>
            <h1>Welcome to Squiz Game, ${username}!</h1>
            <p>
              Thanks for signing up! We're excited to have you on board.
              Please verify your email address to start playing.
            </p>
            <a href="${verificationUrl}" class="button">
              Verify Email Address
            </a>
            <p class="footer">
              If you didn't create an account, you can safely ignore this email.
              <br><br>
              This link will expire in 24 hours.
            </p>
          </div>
        </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Verification email sent to:", email);
    console.log("📧 Message ID:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error sending verification email:", error.message);
    throw error;
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, token, username) => {
  if (!transporter) {
    throw new Error("Email service not initialized");
  }

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Squiz Game" <noreply@squizgame.com>',
    to: email,
    subject: "🔒 Reset Your Password - Squiz Game",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #18181b;
              color: #ffffff;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 12px;
              padding: 40px;
              text-align: center;
            }
            .logo {
              font-size: 48px;
              margin-bottom: 20px;
            }
            h1 {
              color: #ffffff;
              margin-bottom: 20px;
            }
            p {
              color: #e4e4e7;
              font-size: 16px;
              line-height: 1.6;
              margin-bottom: 30px;
            }
            .button {
              display: inline-block;
              background-color: #ffffff;
              color: #764ba2;
              padding: 15px 40px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
              font-size: 16px;
            }
            .footer {
              margin-top: 30px;
              font-size: 12px;
              color: #d4d4d8;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">🔒</div>
            <h1>Password Reset Request</h1>
            <p>
              Hi ${username},<br><br>
              We received a request to reset your password. Click the button below to create a new password.
            </p>
            <a href="${resetUrl}" class="button">
              Reset Password
            </a>
            <p class="footer">
              If you didn't request a password reset, you can safely ignore this email.
              <br><br>
              This link will expire in 1 hour.
            </p>
          </div>
        </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Password reset email sent to:", email);
    console.log("📧 Message ID:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error sending password reset email:", error.message);
    throw error;
  }
};
