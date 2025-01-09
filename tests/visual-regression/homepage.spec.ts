// tests/visual-regression/homepage.spec.ts
import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const TEST_RESULTS = path.join(process.cwd(), 'test-results');
const GOLDEN_DIR = path.join(TEST_RESULTS, 'golden-images');
const TEMP_DIR = path.join(TEST_RESULTS, 'temp-screenshots');
const DIFF_DIR = path.join(TEST_RESULTS, 'screenshot-diffs');

// Ensure directories exist
[GOLDEN_DIR, TEMP_DIR, DIFF_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

test.describe('Homepage Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for any animations or dynamic content to settle
    await page.waitForTimeout(1000);
  });

  test('homepage should match golden image', async ({ page }, testInfo) => {
    // Optional: Hide dynamic elements that should be excluded from comparison
    await page.evaluate(() => {
      const dateElements = document.querySelectorAll('[data-testid="date-display"]');
      dateElements.forEach(el => (el as HTMLElement).style.visibility = 'hidden');
    });

    const imageName = 'homepage.png';
    const screenshotPath = path.join(TEMP_DIR, imageName);
    const goldenPath = path.join(GOLDEN_DIR, imageName);
    
    // Take the screenshot
    await page.screenshot({ 
      path: screenshotPath,
      fullPage: true,
      animations: 'disabled'
    });

    if (process.env.UPDATE_GOLDEN_IMAGES === 'true') {
      fs.copyFileSync(screenshotPath, goldenPath);
      console.log('Updated golden image for homepage');
      
      const metadata = {
        timestamp: new Date().toISOString(),
        environment: 'development',
        branch: 'development',
        viewport: page.viewportSize(),
        userAgent: await page.evaluate(() => navigator.userAgent)
      };
      fs.writeFileSync(
        path.join(GOLDEN_DIR, 'homepage.metadata.json'),
        JSON.stringify(metadata, null, 2)
      );
    } else {
      // Attach both images to the test report
      await testInfo.attach('golden', {
        path: goldenPath,
        contentType: 'image/png'
      });
      
      await testInfo.attach('actual', {
        path: screenshotPath,
        contentType: 'image/png'
      });

      // Use Playwright's built-in screenshot comparison
      await expect(page).toHaveScreenshot(imageName, {
        maxDiffPixels: 100,
        threshold: 0.1
      });
    }
  });
});