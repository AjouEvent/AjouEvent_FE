import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.ajouevent.com';

test('이미지 렌더링 시간 측정', async ({ page }) => {
  await page.goto(BASE_URL);

  const imageTimings = await page.evaluate(() => {
    return performance.getEntriesByType('resource')
      .filter((r) => r.initiatorType === 'img')
      .map((r) => ({
        name: r.name.split('/').pop(),
        duration: Math.round(r.duration),
        size: r.transferSize,
      }));
  });

  console.table(imageTimings);
  imageTimings.forEach((img) => {
    expect(img.duration).toBeLessThan(3000);
  });
});
