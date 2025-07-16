const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTPEmail = async (to, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'OTP Verification Code',
    text: `Your OTP code is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOTPEmail };
