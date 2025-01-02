import { test as base, expect } from '@playwright/test';
import { setupAuth } from '../utils/keycloak-auth-utils';

const test = base.extend({
  page: async ({ page }, use) => {
    await setupAuth(page);
    await use(page);
  },
});

test.describe('Base configuration validation', () => {
  test('validates navigation elements', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Header
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
    
    // Logo - using exact match
    const logo = page.getByRole('img', { name: 'Guardian One', exact: true });
    await expect(logo).toBeVisible({ timeout: 10000 });
  });

  test('verifies page title', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await expect(page).toHaveTitle(/Guardian/);
  });
});