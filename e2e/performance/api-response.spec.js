import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.ajouevent.com';

test('API 응답 시간 측정', async ({ page }) => {
  const apiTimings = [];

  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('/api/')) {
      const timing = response.request().timing();
      apiTimings.push({
        url: url.replace(/.*\/api/, '/api'),
        status: response.status(),
        duration: timing.responseEnd - timing.requestStart,
      });
    }
  });

  await page.goto(BASE_URL);
  await page.waitForLoadState('networkidle');

  console.table(apiTimings);
  apiTimings.forEach((api) => {
    expect(api.duration).toBeLessThan(2000);
  });
});
