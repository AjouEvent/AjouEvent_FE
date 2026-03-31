import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.ajouevent.com';

test('라우트 전환 속도 측정', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.waitForLoadState('networkidle');

  const routes = ['/event', '/login', '/subscribe', '/liked'];

  for (const route of routes) {
    const start = Date.now();
    await page.goto(`${BASE_URL}${route}`);
    await page.waitForLoadState('domcontentloaded');
    const duration = Date.now() - start;

    console.log(`${route}: ${duration}ms`);
    expect(duration).toBeLessThan(2000);
  }
});
