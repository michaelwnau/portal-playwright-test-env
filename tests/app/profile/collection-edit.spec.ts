// tests/app/profile/collection-edit.spec.ts
import { test, expect } from '@playwright/test';

test('edit collection title', async ({ page }) => {
  await page.goto('/');
  
  const drawerToggle = page.getByTestId('drawer-toggle-desktop');
  await expect(drawerToggle).toBeVisible();
  await drawerToggle.click();
  
  await page.getByRole('button', { name: 'My_test_collection_playwright' }).getByTestId('menu-button').click();
  await page.getByRole('menuitem', { name: 'Edit collection title' }).click();
  await page.getByLabel('NAME').click();
  await page.getByLabel('NAME').fill('My_test_collection_playwright_edit_title');
  await page.getByTestId('confirm-button').click();
});