import { test, expect } from '@playwright/test';

test.describe('Base configuration validation', () => {
  // Test to verify the page title
  test('verifies page title', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await expect(page).toHaveTitle(/Guardian/);
  });
});