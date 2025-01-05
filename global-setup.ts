import { chromium, firefox, webkit, FullConfig } from '@playwright/test';
import { setupAuth } from './tests/utils/keycloak-auth-utils';
import fs from 'fs';
import path from 'path';

async function setupBrowser(browserType: 'chromium' | 'firefox' | 'webkit') {
  const browser = await (async () => {
    switch (browserType) {
      case 'chromium':
        return await chromium.launch({ headless: true });
      case 'firefox':
        return await firefox.launch({ headless: true });
      case 'webkit':
        return await webkit.launch({ headless: true });
    }
  })();

  const page = await browser.newPage();
  const authFile = `auth-${browserType}.json`;
  const authPath = path.resolve(process.cwd(), authFile);

  try {
    console.log(`Setting up authentication for ${browserType}...`);
    await setupAuth(page);
    await page.context().storageState({ path: authPath });
    console.log(`Successfully created auth state for ${browserType} at ${authPath}`);
  } catch (error) {
    console.error(`Failed to set up authentication for ${browserType}:`, error);
    throw error;
  } finally {
    await browser.close();
  }
}

async function globalSetup(config: FullConfig) {
  // Create auth files directory if it doesn't exist
  const authDir = process.cwd();
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  console.log('Starting global setup...');
  
  // Setup authentication for all browser types
  try {
    await Promise.all([
      setupBrowser('chromium'),
      setupBrowser('firefox'),
      setupBrowser('webkit')
    ]);
    console.log('Global setup completed successfully');
  } catch (error) {
    console.error('Global setup failed:', error);
    throw error;
  }
}

export default globalSetup;