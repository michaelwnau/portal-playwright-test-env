import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3001/');
  await page.getByTestId('drawer-toggle-desktop').click();
  await page.getByTestId('edit-button').click();
  await page.getByTestId('add-button').click();
  await page.getByLabel('NAME').click();
  await page.getByLabel('NAME').fill('My_test_collection_playwright');
  await page.getByTestId('add-link-confirm').click();
  await page.getByRole('button', { name: 'My_test_collection_playwright' }).getByTestId('menu-button').click();
  await page.getByRole('menuitem', { name: 'Edit collection title' }).click();
  await page.getByLabel('NAME').click();
  await page.getByLabel('NAME').fill('My_test_collection_playwright_edit_title');
  await page.getByTestId('confirm-button').click();
  await page.getByRole('button', { name: 'My_test_collection_playwright_edit_title' }).getByTestId('menu-button').click();
  await page.getByRole('menuitem', { name: 'Delete collection' }).click();
  await page.getByTestId('confirm-button').click();
  await page.getByTestId('drawer-close').click();
});