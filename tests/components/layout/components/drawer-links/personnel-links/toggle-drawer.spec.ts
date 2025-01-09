import { test, expect } from '@playwright/test';

test('toggle drawer', async ({ page }) => {
  await page.goto('/');

  const drawerToggle = page.getByTestId('drawer-toggle-desktop');
  await expect(drawerToggle).toBeVisible();
  await drawerToggle.click();
});