import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { exec } from 'child_process'; 
import { sendNotificationEmail } from '../utils/emailSender';
import dotenv from 'dotenv';
dotenv.config();

test('SSN booking retry until available', async ({ page }) => {
  const url = 'https://www.seine-saint-denis.gouv.fr/index.php/booking/create/9845/0';
  const errorText = 'Veuillez réessayer ultérieurement.';
  const delayMs = 60000; // 每次重试间隔
  const maxAttempts = 30; 

  await allure.step('打开预约页面', async () => {
    await page.goto(url);
  });

  let success = false;

  for (let i = 1; i <= maxAttempts; i++) {
    await allure.step(`第 ${i} 次尝试预约`, async () => {
      await allure.step('勾选确认复选框', async () => {
        await page.getByRole('checkbox', { name: 'Veuillez cocher la case pour' }).check({ force: true });
      });

      await allure.step('点击 “Effectuer une demande de rendez-vous” 按钮', async () => {
        await page.getByRole('button', { name: 'Effectuer une demande de' }).click();
      });

      await allure.step('等待页面渲染', async () => {
        await page.waitForTimeout(1000);
      });

      const stillBlocked = await page.getByText(errorText, { exact: false }).isVisible();

      if (stillBlocked) {
        console.log(`🔁 第 ${i} 次：仍然出现 "${errorText}"，等待 ${delayMs}ms 后重试...`);
        await page.waitForTimeout(delayMs);
        await page.goto(url, { waitUntil: 'domcontentloaded' });
      } else {
        await allure.step('检测结果：页面已开放', async () => {
          await sendNotificationEmail(
            'bangbangbang.paris@gmail.com',
            '🎉 Préfecture Seine-Saint-Denis 页面现在可能已经开放，请尽快操作！'
          );
          console.log('✅ 页面可能开放，播放音乐提醒...');
          exec(`Start-Process wmplayer.exe "D:\\dev\\junyang\\playwright-demo\\waterfall.mp3"`);
        });

        await page.pause();
        success = true; // 用变量标记成功
      }
    });

    if (success) break; // ✅ 在循环作用域里判断并跳出
  }

  await sendNotificationEmail(
  'bangbangbang.paris@gmail.com',
  'Préfecture Seine-Saint-Denis 本次刷新已结束，暂时没有发现空位'
  );

});


// 如果约到：
// 1. Xiaoyu Liu
// 2. alessia95@hotmail.com
// 3. 9203172440
// 4. 2025/09/28
// 5. 93000 Bobigny