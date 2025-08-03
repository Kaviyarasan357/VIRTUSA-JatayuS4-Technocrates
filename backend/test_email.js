const nodemailer = require("nodemailer");

async function main() {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "kavitamil6369@gmail.com", // replace with your gmail
      pass: "cuhrjjqsupaujmqq", // replace with your app password
    },
    tls: {
    rejectUnauthorized: false  // <-- THIS LINE fixes the self-signed cert error
  }
  });

  let info = await transporter.sendMail({
    from: '"Test" <kavitamil6369@gmail.com>',
    to: "kaviking357@gmail.com",
    subject: "Hello from test_email.js",
    text: "✅ This confirms your email setup works!",
  });

  console.log("✅ Message sent:", info.messageId);
}

main().catch(console.error);
