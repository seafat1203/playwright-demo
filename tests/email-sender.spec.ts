import { test } from '@playwright/test';
import { sendNotificationEmail } from '../utils/emailSender';

test('测试邮件发送功能', async () => {
  await sendNotificationEmail(
    'bangbangbang.paris@gmail.com',
  '测试，测试 邮件发送功能'
  );
});
