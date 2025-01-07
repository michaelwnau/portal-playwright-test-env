// tests/app/profile/collection-delete.spec.ts  
import { test, expect } from '@playwright/test';

test('delete collection', async ({ page }) => {
  await page.goto('/');
  
  const drawerToggle = page.getByTestId('drawer-toggle-desktop');
  await expect(drawerToggle).toBeVisible();
  await drawerToggle.click();
  
  await page.getByRole('button', { name: 'My_test_collection_playwright_edit_title' }).getByTestId('menu-button').click();
  await page.getByRole('menuitem', { name: 'Delete collection' }).click();
  await page.getByTestId('confirm-button').click();
  await page.getByTestId('drawer-close').click();
});