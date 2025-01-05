// tests/app/profile/change-theme.spec.ts
import { test, expect } from '@playwright/test';

test('theme switching test', async ({ page }) => {
  await page.goto('/');
  
  const accountMenu = page.getByLabel('account of current user');
  await expect(accountMenu).toBeVisible();
  await accountMenu.click();
  
  const editProfile = page.getByText('Edit Profile');
  await expect(editProfile).toBeVisible();
  await editProfile.click();
  
  // Test theme switching
  for (const theme of ['Light', 'Moon', 'Mars']) {
    const themeOption = page.getByLabel(theme);
    await expect(themeOption).toBeVisible();
    await themeOption.check();
    await expect(page.getByRole('button', { name: 'Save' })).toBeEnabled();
    await page.getByRole('button', { name: 'Save' }).click();
  }
  
  await expect(page.getByTestId('desktop-logo')).toBeVisible();
  await page.getByTestId('desktop-logo').click();
});