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
    
    // Debug: Log the actual image attributes in WebKit
    if (page.context().browser()?.browserType().name() === 'webkit') {
      const images = await page.locator('img').all();
      for (const img of images) {
        console.log('Image attributes:', await img.evaluate((el: HTMLImageElement) => ({
          alt: el.alt,
          src: el.src,
          role: el.getAttribute('role'),
          'aria-label': el.getAttribute('aria-label')
        })));
      }
    }
    
    // Try multiple selector strategies
    const logo = page.locator('img[alt="Guardian One"], img[aria-label="Guardian One"]');
    await expect(logo).toBeVisible({ timeout: 30000 });
    
    // Verify the logo attributes
    const logoAttributes = await logo.evaluate((el: HTMLImageElement) => ({
      alt: el.alt,
      src: el.src,
      testId: el.getAttribute('data-testid')
    }));
    
    expect(logoAttributes.alt).toBe('Guardian One');
    expect(logoAttributes.src).toContain('guardian_one_logo_logo');
    expect(logoAttributes.src).toContain('.png');
  });

  test('verifies page title', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await expect(page).toHaveTitle(/Guardian/);
  });
});