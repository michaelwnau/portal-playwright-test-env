import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  globalSetup: require.resolve('./global-setup'),
  testDir: './tests',
  timeout: 60000,
  retries: 2,
  // retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  fullyParallel: true,
  reporter: [
    ['html'],
    ['list'],
    ['allure-playwright'],
  ],
  use: {
    // Set headless based on environment variable
    headless: !process.env.HEADED,
    storageState: 'auth.json',
    baseURL: process.env.BASE_URL ?? 'http://localhost:3001',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        viewport: { width: 1280, height: 720 },
      },
      testDir: './tests/app',
    },
    {
      name: 'firefox',
      use: {
        browserName: 'firefox',
        viewport: { width: 1280, height: 720 },
      },
      testDir: './tests/app',
    },
    {
      name: 'webkit',
      use: {
        browserName: 'webkit',
        viewport: { width: 1280, height: 720 },
      },
      testDir: './tests/app',
    },
    {
      name: 'visual-regression',
      testDir: './tests/visual',
      use: {
        baseURL: process.env.LIVE_URL ?? 'https://my.spaceforce.mil',
        screenshot: 'on',
        video: 'retain-on-failure',
        viewport: { width: 1280, height: 720 },
      },
    }
  ],
};

export default config;