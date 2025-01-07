import { test as base, expect } from '@playwright/test';

// Sample article data for testing
const mockArticleData = {
  title: 'Test Article',
  content: 'This is test content',
  author: 'Test Author',
};

// Extend the base test to include route mocking setup
const test = base.extend({
  page: async ({ page }, use) => {
    // Set up request logging
    page.on('request', request => {
      console.log(`Request made to: ${request.url()} [${request.method()}]`);
    });

    // Set up response logging
    page.on('response', response => {
      console.log(`Response from: ${response.url()} [${response.status()}]`);
    });

    await use(page);
  }
});

test.describe('Articles API', () => {
  test('should fetch article data successfully', async ({ page, context }) => {
    // Set up route handler at the context level
    await context.route('**/api/articles*', async (route) => {
      const url = route.request().url();
      console.log('Route handler triggered for:', url);
      
      if (url.includes('slug=test-article')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            ...mockArticleData,
            slug: 'test-article'
          })
        });
      } else {
        await route.continue();
      }
    });

    // Make the request using port 3001
    const baseUrl = process.env.BASE_URL ?? 'http://localhost:3001';
    const requestUrl = `${baseUrl}/api/articles?slug=test-article`;
    console.log('Making request to:', requestUrl);

    const response = await page.request.get(requestUrl);
    console.log('Response received:', {
      status: response.status(),
      statusText: response.statusText(),
      headers: response.headers(),
    });

    // Check response status
    expect(response.status()).toBe(200);

    // Parse and validate response data
    const data = await response.json();
    expect(data).toMatchObject({
      ...mockArticleData,
      slug: 'test-article'
    });
  });

  test('should handle missing slug parameter', async ({ page }) => {
    await page.route('**/api/articles', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Failed to fetch the article page data' })
      });
    });

    const response = await page.request.get(`${process.env.BASE_URL ?? 'http://localhost:3001'}/api/articles`);
    expect(response.status()).toBe(500);
    const data = await response.json();
    expect(data).toHaveProperty('error');
  });

  test('should handle non-existent article', async ({ page }) => {
    await page.route('**/api/articles', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Failed to fetch the article page data' })
      });
    });

    const response = await page.request.get(`${process.env.BASE_URL ?? 'http://localhost:3001'}/api/articles?slug=non-existent`);
    expect(response.status()).toBe(500);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Failed to fetch the article page data');
  });
});