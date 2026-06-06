import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [['json', { outputFile: 'results.json' }], ['html']]
    : 'html',

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    video: 'on',
    screenshot: 'only-on-failure',
    // PWA 모바일 기준
    ...devices['iPhone 12'],
  },

  projects: [
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    // webkit(Safari)은 로컬에서만 실행 — CI runner에서 설치 비용이 큼
    ...(!process.env.CI ? [{
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    }] : []),
  ],

  // E2E 테스트 전에 dev server 자동 시작
  webServer: {
    command: 'npm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
