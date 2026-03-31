import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.ajouevent.com';

test('Web Vitals 측정 (LCP, CLS, FCP)', async ({ page }) => {
  const client = await page.context().newCDPSession(page);
  await client.send('Performance.enable');

  await page.goto(BASE_URL);
  await page.waitForLoadState('networkidle');

  // LCP
  const lcp = await page.evaluate(() =>
    new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        resolve(entries[entries.length - 1].startTime);
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    })
  );

  // FCP
  const fcp = await page.evaluate(() => {
    const entry = performance.getEntriesByName('first-contentful-paint')[0];
    return entry?.startTime;
  });

  // CLS
  const cls = await page.evaluate(() =>
    new Promise((resolve) => {
      let clsValue = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) clsValue += entry.value;
        }
        resolve(clsValue);
      }).observe({ type: 'layout-shift', buffered: true });
      setTimeout(() => resolve(clsValue), 3000);
    })
  );

  console.log(`LCP: ${lcp}ms, FCP: ${fcp}ms, CLS: ${cls}`);
  expect(lcp).toBeLessThan(2500);
  expect(fcp).toBeLessThan(1800);
  expect(cls).toBeLessThan(0.1);
});
