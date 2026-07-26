const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: Number(process.env.EMAIL_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmail({ to, subject, html }) {
  await transporter.sendMail({
    from: `"Fashion Site" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}

async function sendVerificationEmail(to, token) {
  const link = `${process.env.CLIENT_URL}/login-page/verify.html?token=${token}`;
  await sendEmail({
    to,
    subject: "Verify your email — Fashion Site",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2>Welcome to Fashion Site 👋</h2>
        <p>Please confirm your email address to activate your account.</p>
        <a href="${link}" style="display:inline-block;padding:12px 24px;background:#111;color:#fff;text-decoration:none;border-radius:4px;">
          Verify Email
        </a>
        <p style="margin-top:16px;color:#666;font-size:13px;">
          This link expires in 24 hours. If you didn't create this account, you can ignore this email.
        </p>
      </div>
    `,
  });
}
// async function sendResetPasswordEmail(to, token) {
//   const link = `${process.env.CLIENT_URL}/login-page/reset-password.html?token=${token}`;
//   await sendEmail({
//     to,
//     subject: "Reset your password — Fashion Site",
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
//         <h2>Password Reset Request</h2>
//         <p>Click the button below to set a new password. This link expires in 1 hour.</p>
//         <a href="${link}" style="display:inline-block;padding:12px 24px;background:#111;color:#fff;text-decoration:none;border-radius:4px;">
//           Reset Password
//         </a>
//         <p style="margin-top:16px;color:#666;font-size:13px;">
//           If you didn't request this, you can safely ignore this email.
//         </p>
//       </div>
//     `,
//   });
// }
module.exports = { sendEmail, sendVerificationEmail, sendResetPasswordEmail };