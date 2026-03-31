import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.ajouevent.com';

test('페이지 로드 시간 측정', async ({ page }) => {
  await page.goto(BASE_URL);

  const timing = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    return {
      domContentLoaded: nav.domContentLoadedEventEnd - nav.startTime,
      loadComplete: nav.loadEventEnd - nav.startTime,
      ttfb: nav.responseStart - nav.requestStart,
      domInteractive: nav.domInteractive - nav.startTime,
    };
  });

  console.log('페이지 로드 결과:', timing);
  expect(timing.loadComplete).toBeLessThan(8000); // 10초 이내
});
