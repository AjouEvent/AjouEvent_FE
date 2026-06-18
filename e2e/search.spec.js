import { test, expect } from '@playwright/test';

const mockSearchResults = [
  {
    eventId: 201,
    title: '검색 결과 이벤트',
    subject: '학사',
    content: '검색 결과 카드 렌더링 확인',
    imgUrl: 'https://www.ajou.ac.kr/_res/ajou/kr/img/intro/img-symbol.png',
    likesCount: 3,
    viewCount: 19,
    star: false,
  },
];

const mockEventDetail = {
  eventId: 201,
  title: '검색 결과 이벤트',
  subject: '학사',
  content: '상세 페이지 본문\n두 번째 줄',
  imgUrl: ['https://www.ajou.ac.kr/_res/ajou/kr/img/intro/img-symbol.png'],
  likesCount: 3,
  viewCount: 19,
  star: false,
  createdAt: '2026-06-06T09:00:00.000Z',
  writer: 'AjouEvent',
  url: 'https://example.com/detail-link',
};

async function setupSearchRoutes(page, { empty = false } = {}) {
  await page.route('**/api/subscriptions/isSubscribedTabRead', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ isSubscribedTabRead: true }) }),
  );
  await page.route('**/send/registration-token', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) }),
  );
  await page.route('**/api/event/**', async (route) => {
    const url = new URL(route.request().url());

    if (url.pathname === '/api/event/detail/201') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockEventDetail) });
    }

    // 검색 목록 엔드포인트
    if (url.pathname.startsWith('/api/event/') && !url.pathname.startsWith('/api/event/detail/')) {
      const keyword = url.searchParams.get('keyword') ?? '';
      const isEmpty = empty || keyword === '없는 키워드';
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ result: isEmpty ? [] : mockSearchResults, hasNext: false }),
      });
    }

    await route.fallback();
  });
}

test.describe('검색 및 상세 조회', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'userAgent', {
        get: () =>
          'Mozilla/5.0 (Linux; Android 13; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Mobile Safari/537.36',
      });
      Notification.requestPermission = async () => 'denied';
    });
  });

  test('검색 페이지 진입 시 기본 이벤트 목록이 표시된다', async ({ page }) => {
    await setupSearchRoutes(page);

    await page.goto('/event');

    await expect(page.getByPlaceholder('검색어를 입력해 주세요')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('검색 결과 이벤트')).toBeVisible({ timeout: 15000 });
  });

  test('존재하지 않는 키워드 검색 시 결과 없음 안내가 표시된다', async ({ page }) => {
    await setupSearchRoutes(page, { empty: true });

    await page.goto('/event');

    await page.getByPlaceholder('검색어를 입력해 주세요').fill('없는 키워드');
    await page.getByPlaceholder('검색어를 입력해 주세요').press('Enter');

    await expect(page.getByText('더 이상 불러올 이벤트가 없습니다.')).toBeVisible({ timeout: 15000 });
  });

  test('검색 결과 카드 클릭 시 상세 페이지로 이동하고 뒤로가기로 돌아온다', async ({ page }) => {
    await setupSearchRoutes(page);

    await page.goto('/event');

    await page.getByText('검색 결과 이벤트').click();
    await expect(page).toHaveURL(/\/event\/201$/);
    await expect(page.getByText('검색 결과 이벤트')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('학사')).toBeVisible({ timeout: 15000 });

    await page.getByRole('button', { name: '뒤로가기' }).click();
    await expect(page).toHaveURL(/\/event$/);
  });
});
