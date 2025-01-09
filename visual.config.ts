// visual.config.ts
import { PlaywrightTestConfig } from '@playwright/test';
import path from 'path';

const config: PlaywrightTestConfig = {
  testDir: './tests/visual-regression',
  retries: 0,
  workers: 1,
  reporter: [
    ['html', { 
      outputFolder: path.join(__dirname, 'playwright-report', 'visual-regression')
    }],
    ['list']
  ],
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3001',
    screenshot: 'on',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    storageState: './auth-chromium.json'
  },
  expect: {
    timeout: 15000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.1,
      threshold: 0.2,
      animations: 'disabled',
    }
  },
  outputDir: 'test-results/visual-regression',
  preserveOutput: 'always',
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        viewport: { width: 1280, height: 720 },
      },
    }
  ],
  globalSetup: './global-setup.ts'
};

export default config;