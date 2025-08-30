import { test } from '@playwright/test';
import { sendNotificationEmail } from '../utils/emailSender';

import dotenv from 'dotenv';
dotenv.config();

test('测试邮件发送功能', async () => {
  console.log(process.env);

  await sendNotificationEmail(
    'bangbangbang.paris@gmail.com',
  '测试，测试 邮件发送功能'
  );
});
