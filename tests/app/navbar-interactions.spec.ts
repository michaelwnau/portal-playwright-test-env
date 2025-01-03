import { test as base, expect } from '@playwright/test';
import { setupAuth } from '../utils/keycloak-auth-utils';

const test = base.extend({
  page: async ({ page }, use) => {
    await setupAuth(page);
    await use(page);
  },
});

test('navbar interactions', async ({ page }) => {
  // Navigate and wait for app to be fully loaded
  await page.goto('/', { 
    waitUntil: 'networkidle',
    timeout: 30000 
  });
  
  // Wait for the app to be fully rendered
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000); // Give extra time for WebKit
  
  // Verify each element before interaction with increased timeout
  const logo = page.getByTestId('desktop-logo');
  await expect(logo).toBeVisible({ timeout: 10000 });
  await logo.click();

  const navElements = [
    'desktop-left-link-ABOUT',
    'desktop-left-link-DOCTRINE',
    'desktop-right-link-BASES',
    'desktop-right-link-UNITS',
    'desktop-right-link-RESOURCES'
  ];

  // Add retry logic for WebKit
  for (const elementId of navElements) {
    const element = page.getByTestId(elementId);
    await expect(element).toBeVisible({ timeout: 10000 });
    await element.click();
    await page.waitForLoadState('networkidle');
  }

  // Verify and interact with other UI elements
  const searchButton = page.getByLabel('search');
  await expect(searchButton).toBeVisible({ timeout: 10000 });
  await searchButton.click();
  
  const accountButton = page.getByLabel('account of current user');
  await expect(accountButton).toBeVisible({ timeout: 10000 });
});