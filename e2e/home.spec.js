import { test, expect } from '@playwright/test';

const mockBannerImages = [
  {
    imageUrl: 'https://www.ajou.ac.kr/_res/ajou/kr/img/intro/img-symbol.png',
    imageAlt: 'banner-1',
  },
];

const mockPopularEvents = [
  {
    eventId: 101,
    title: 'Playwright E2E 테스트 이벤트',
    subject: '공지',
    content: '이벤트 카드가 렌더링되는지 확인합니다.',
    imgUrl: 'https://www.ajou.ac.kr/_res/ajou/kr/img/intro/img-symbol.png',
    likesCount: 12,
    viewCount: 34,
    star: false,
  },
];

const mockHomeEventDetail = {
  eventId: 101,
  title: 'Playwright E2E 테스트 이벤트',
  subject: '공지',
  content: '홈 카드 상세 페이지 본문',
  imgUrl: ['https://www.ajou.ac.kr/_res/ajou/kr/img/intro/img-symbol.png'],
  likesCount: 12,
  viewCount: 34,
  star: false,
  createdAt: '2026-06-06T09:00:00.000Z',
  writer: 'AjouEvent',
  url: 'https://example.com/home-detail-link',
};

async function setupHomeRoutes(page) {
  await page.route('**/api/subscriptions/isSubscribedTabRead', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ isSubscribedTabRead: true }) }),
  );
  await page.route('**/send/registration-token', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) }),
  );
  await page.route('**/api/event/banner', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockBannerImages) }),
  );
  await page.route('**/api/event/popular', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockPopularEvents) }),
  );
  await page.route('**/api/event/detail/101', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockHomeEventDetail) }),
  );
}

test.describe('홈 화면', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'userAgent', {
        get: () =>
          'Mozilla/5.0 (Linux; Android 13; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Mobile Safari/537.36',
      });
      Notification.requestPermission = async () => 'denied';
    });
    await setupHomeRoutes(page);
  });

  test('홈 진입 시 배너와 인기글 섹션·카드가 표시된다', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('이번주 인기글')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Playwright E2E 테스트 이벤트')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('공지', { exact: true })).toBeVisible({ timeout: 15000 });
  });

  test('홈 카드 클릭 시 상세 페이지로 이동하고 뒤로가기로 돌아온다', async ({ page }) => {
    await page.goto('/');

    await page.getByText('Playwright E2E 테스트 이벤트', { exact: true }).click();
    await expect(page).toHaveURL(/\/event\/101$/);
    await expect(page.getByText('홈 카드 상세 페이지 본문')).toBeVisible({ timeout: 15000 });

    await page.getByRole('button', { name: '뒤로가기' }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test('하단 탭바로 검색 페이지로 이동한다', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('listitem').filter({ hasText: '검색' }).click();
    await expect(page).toHaveURL(/\/event$/);
  });
});
