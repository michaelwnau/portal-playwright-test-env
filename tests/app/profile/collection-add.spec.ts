// tests/app/profile/collection-add.spec.ts
import { test, expect } from '@playwright/test';

test('add new collection', async ({ page }) => {
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
});