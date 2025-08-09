import { test } from '@playwright/test';
import { allure } from 'allure-playwright';
import { sendNotificationEmail } from '../utils/emailSender';

test('SSN booking retry until available', async ({ page }) => {
  const url = 'https://www.seine-saint-denis.gouv.fr/index.php/booking/create/9845/0';
  const errorText = 'Veuillez réessayer ultérieurement.';
  const delayMs = 30000;
  const maxAttempts = 100;

  await allure.step('打开预约页面', async () => {
    await page.goto(url);
  });

  let success = false;
  let firstCycleNotified = false; // ✅ 首轮刷新完成后只发一次邮件

  for (let i = 1; i <= maxAttempts; i++) {
    await allure.step(`第 ${i} 次尝试预约`, async () => {
      await page.getByRole('checkbox', { name: 'Veuillez cocher la case pour' }).check({ force: true });
      await page.getByRole('button', { name: 'Effectuer une demande de' }).click();
      await page.waitForTimeout(1000);

      const stillBlocked = await page.getByText(errorText, { exact: false }).isVisible();

      // ✅ 完成首轮刷新后发送“已开始并完成首轮”的邮件（只一次）
      if (i === 1 && !firstCycleNotified) {
        await sendNotificationEmail(
          'bangbangbang.paris@gmail.com',
          '✅ 任务已启动并完成首轮刷新（SSN）'
        );
        firstCycleNotified = true;
      }

      if (stillBlocked) {
        console.log(`🔁 第 ${i} 次：仍被限流，等待 ${delayMs}ms 后重试...`);
        await page.waitForTimeout(delayMs);
        await page.goto(url, { waitUntil: 'domcontentloaded' });
      } else {
        // ✅ 找到“未被限流/可能已开放”
        await sendNotificationEmail(
          'bangbangbang.paris@gmail.com',
          '🎉 SSN 页面可能已开放，请尽快操作！'
        );
        success = true;
      }
    });

    if (success) break;
  }

  // ✅ 结束时发送总结邮件（根据 success 写不同文案）
  await sendNotificationEmail(
    'bangbangbang.paris@gmail.com',
    success
      ? '🟢 本次任务已结束：检测到页面可能开放（SSN）'
      : '🔴 本次任务已结束：未发现空位（SSN）'
  );
});
