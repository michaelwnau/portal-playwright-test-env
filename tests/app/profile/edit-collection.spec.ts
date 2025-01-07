import { test, expect } from '@playwright/test';

test('collection management', async ({ page }) => {
  await page.goto('/');
  
  const drawerToggle = page.getByTestId('drawer-toggle-desktop');
  await expect(drawerToggle).toBeVisible();
  await drawerToggle.click();
  
  const editButton = page.getByTestId('edit-button');
  await expect(editButton).toBeVisible();
  await editButton.click();
  
  const addButton = page.getByTestId('add-button');
  await expect(addButton).toBeVisible();
  await addButton.click();
  
  const nameInput = page.getByLabel('NAME');
  await expect(nameInput).toBeVisible();
  await nameInput.fill('My_test_collection_playwright');
  
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