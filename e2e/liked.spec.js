import { test, expect } from '@playwright/test';

// ─── 공통 mock 데이터 ───────────────────────────────────────────────────────
const mockLikedEvents = [
  {
    eventId: 301,
    title: '찜한 이벤트 A',
    subject: '학사',
    content: '찜 목록 카드 렌더링 확인',
    imgUrl: 'https://www.ajou.ac.kr/_res/ajou/kr/img/intro/img-symbol.png',
    likesCount: 5,
    viewCount: 20,
    star: true,
  },
  {
    eventId: 302,
    title: '찜한 이벤트 B',
    subject: '장학',
    content: '찜 목록 두 번째 카드',
    imgUrl: 'https://www.ajou.ac.kr/_res/ajou/kr/img/intro/img-symbol.png',
    likesCount: 3,
    viewCount: 11,
    star: true,
  },
];

const mockLikedEventDetail = {
  eventId: 301,
  title: '찜한 이벤트 A',
  subject: '학사',
  content: '찜한 이벤트 A 상세 본문',
  imgUrl: ['https://www.ajou.ac.kr/_res/ajou/kr/img/intro/img-symbol.png'],
  likesCount: 5,
  viewCount: 20,
  star: true,
  createdAt: '2026-06-01T09:00:00.000Z',
  writer: 'AjouEvent',
  url: 'https://example.com/liked-detail-link',
};

// ─── 공통 route 설정 ──────────────────────────────────────────────────────
async function setupLikedRoutes(page, { emptyList = false } = {}) {
  // 구독 탭 읽음 여부
  await page.route('**/api/subscriptions/isSubscribedTabRead', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ isSubscribedTabRead: true }) }),
  );
  // FCM 토큰
  await page.route('**/send/registration-token', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) }),
  );
  // 찜 목록 API
  await page.route('**/api/event/liked**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ result: emptyList ? [] : mockLikedEvents, hasNext: false }),
    }),
  );
  // 찜한 이벤트 상세
  await page.route('**/api/event/detail/301', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockLikedEventDetail) }),
  );
  // 찜 추가/해제
  await page.route('**/api/event/like/**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) }),
  );
}

async function loginMock(page) {
  await page.evaluate(() => localStorage.setItem('accessToken', 'mock-access-token'));
}

// ─── 테스트 ───────────────────────────────────────────────────────────────
test.describe('좋아요(찜) 관리', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'userAgent', {
        get: () =>
          'Mozilla/5.0 (Linux; Android 13; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Mobile Safari/537.36',
      });
      Notification.requestPermission = async () => 'denied';
    });
  });

  test('찜 목록 페이지 진입 시 찜한 이벤트 카드가 표시된다', async ({ page }) => {
    await setupLikedRoutes(page);

    await page.goto('/');
    await loginMock(page);
    await page.goto('/liked');

    await expect(page.getByText('내가 찜한 이벤트')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('찜한 이벤트 A')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('찜한 이벤트 B')).toBeVisible({ timeout: 15000 });
  });

  test('찜 목록이 없을 때 빈 상태 안내가 표시된다', async ({ page }) => {
    await setupLikedRoutes(page, { emptyList: true });

    await page.goto('/');
    await loginMock(page);
    await page.goto('/liked');

    await expect(page.getByText('불러올 이벤트가 없습니다.')).toBeVisible({ timeout: 15000 });
  });

  test('로그인하지 않으면 찜 목록 대신 로그인 안내가 표시된다', async ({ page }) => {
    await setupLikedRoutes(page);

    // accessToken 없이 바로 진입
    await page.goto('/liked');

    await expect(page.getByText('로그인이 필요한 서비스입니다')).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('link', { name: '로그인' })).toBeVisible();
  });

  test('이벤트 상세 페이지에서 북마크 클릭 시 찜 등록 API가 호출된다', async ({ page }) => {
    await setupLikedRoutes(page);

    // star=false 상태로 상세 데이터 override (인증 경로)
    const detailWithNoStar = { ...mockLikedEventDetail, star: false };
    await page.route('**/api/event/detail/301', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(detailWithNoStar) }),
    );

    let likeApiCalled = false;
    await page.route('**/api/event/like/301', (route) => {
      if (route.request().method() === 'POST') likeApiCalled = true;
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) });
    });

    await page.goto('/');
    await loginMock(page);
    await page.goto('/event/301');

    // 상세 페이지 하단 바의 북마크 버튼 (alt="Bookmark" 이미지를 포함한 버튼)
    const bookmarkBtn = page.locator('button:has(img[alt="Bookmark"])');
    await bookmarkBtn.waitFor({ timeout: 15000 });
    await bookmarkBtn.click();

    expect(likeApiCalled).toBe(true);
  });

  test('찜 목록에서 하트 재클릭 시 찜 해제 API가 호출된다', async ({ page }) => {
    // setupLikedRoutes 대신 직접 등록하여 DELETE 감지를 먼저 설정
    await page.route('**/api/subscriptions/isSubscribedTabRead', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ isSubscribedTabRead: true }) }),
    );
    await page.route('**/send/registration-token', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) }),
    );
    await page.route('**/api/event/liked**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ result: mockLikedEvents, hasNext: false }),
      }),
    );

    let unlikeApiCalled = false;
    // star=true 카드에서 클릭하면 DELETE가 호출됨
    await page.route('**/api/event/like/**', (route) => {
      if (route.request().method() === 'DELETE') unlikeApiCalled = true;
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) });
    });

    await page.goto('/');
    await loginMock(page);
    await page.goto('/liked');

    // star=true인 카드의 하트 버튼 클릭 (첫 번째 카드)
    await expect(page.getByText('찜한 이벤트 A')).toBeVisible({ timeout: 15000 });
    const heartBtns = page.locator('.lucide-heart');
    await heartBtns.first().click();

    expect(unlikeApiCalled).toBe(true);
  });
});
