import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.seine-saint-denis.gouv.fr/index.php/booking/create/9845/0');
  await page.getByRole('checkbox', { name: 'Veuillez cocher la case pour' }).check();
  await page.getByRole('button', { name: 'Effectuer une demande de' }).click();
  await page.getByText('Il n\'y a pas calendrier').click();
});