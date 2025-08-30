import nodemailer from 'nodemailer';


export async function sendNotificationEmail(to: string, subject: string) {
  const user = process.env.GMAIL_USER!;
  const pass = process.env.GMAIL_APP_PASS!;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass,
    },
  });

  const mailOptions = {
    from: user,
    to,
    subject,
    text: subject,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📩 邮件已发送至 ${to}`);
  } catch (err) {
    console.error('❌ 邮件发送失败:', err);
  }
}
