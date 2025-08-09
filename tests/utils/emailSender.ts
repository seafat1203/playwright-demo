import nodemailer from 'nodemailer';

export async function sendNotificationEmail(to: string, subject: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'bangbangbang.paris@gmail.com',
      pass: 'erus dkgw myeu onjm', // Gmail 应用专用密码
    },
  });

  const mailOptions = {
    from: 'bangbangbang.paris@gmail.com',
    to,
    subject,
    text: subject, // 内容就是标题本身
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📩 邮件已发送至 ${to}`);
  } catch (err) {
    console.error('❌ 邮件发送失败:', err);
  }
}
