const nodemailer = require('nodemailer');
require('dotenv').config(); 
async function sendEmail(content) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.PARENT_EMAIL,
    subject: 'Mental Health Alert',
    text: `Concerning content detected: ${content}`
  });
}

module.exports = { sendEmail };
