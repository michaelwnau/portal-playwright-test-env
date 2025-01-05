// tests/app/profile/profile-fields.spec.ts
import { test, expect } from '@playwright/test';

test('profile fields interaction', async ({ page }) => {
  await page.goto('/');
  
  const accountMenu = page.getByLabel('account of current user');
  await expect(accountMenu).toBeVisible();
  await accountMenu.click();

  const editProfile = page.getByText('Edit Profile');
  await expect(editProfile).toBeVisible();
  await editProfile.click();

  // Verify and interact with form fields
  const fields = ['DISPLAY NAME', 'FIRST NAME', 'LAST NAME', 'DUTY TITLE', 'OCCUPATION'];
  for (const field of fields) {
    const fieldElement = page.getByLabel(field);
    await expect(fieldElement).toBeVisible();
    await fieldElement.click();
  }

  const form = page.getByTestId('personnel-form');
  await expect(form).toBeVisible();
  
  const saveButton = page.getByRole('button', { name: 'Save' });
  await expect(saveButton).toBeEnabled();
  await saveButton.click();
});