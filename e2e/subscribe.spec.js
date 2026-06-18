import { test, expect } from '@playwright/test';

// ─── mock 데이터 ────────────────────────────────────────────────────────────
const mockTopicsStatus = [
  { id: 1, englishTopic: 'Software', koreanTopic: '소프트웨어학과', classification: '학과', subscribed: true, koreanOrder: 1, receiveNotification: true },
  { id: 2, englishTopic: 'Dormitory', koreanTopic: '기숙사', classification: '기숙사', subscribed: false, koreanOrder: 2, receiveNotification: false },
];

const mockTopicSubscriptions = [
  { id: 1, englishTopic: 'Software', koreanTopic: '소프트웨어학과', isRead: true, lastReadAt: '2026-06-01T10:00:00Z' },
];

const mockKeywords = [
  { encodedKeyword: 'encoded_해커톤', koreanKeyword: '해커톤', searchKeyword: '해커톤', topicName: '소프트웨어학과', isRead: true, lastReadAt: '2026-06-01T10:00:00Z' },
];

const mockSubscribedEvents = [
  {
    eventId: 401,
    title: '구독 채널 최신 이벤트',
    subject: '공지',
    content: '구독 채널 이벤트 내용',
    imgUrl: 'https://www.ajou.ac.kr/_res/ajou/kr/img/intro/img-symbol.png',
    likesCount: 2,
    viewCount: 15,
    star: false,
  },
];

const mockKeywordEvents = [
  {
    eventId: 501,
    title: '해커톤 관련 이벤트',
    subject: '학사',
    content: '키워드 이벤트 내용',
    imgUrl: 'https://www.ajou.ac.kr/_res/ajou/kr/img/intro/img-symbol.png',
    likesCount: 1,
    viewCount: 8,
    star: false,
  },
];

const SUCCESS = { successStatus: '100 CONTINUE', successContent: 'Success', data: {} };

// ─── 공통 route 설정 ─────────────────────────────────────────────────────
async function setupSubscribeRoutes(page) {
  await page.route('**/api/subscriptions/isSubscribedTabRead', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ isSubscribedTabRead: true }) }),
  );
  await page.route('**/send/registration-token', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) }),
  );
  await page.route('**/api/topic/subscriptions', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockTopicSubscriptions) }),
  );
  await page.route('**/api/topic/subscriptionsStatus', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockTopicsStatus) }),
  );
  await page.route('**/api/keyword/userKeywords', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockKeywords) }),
  );
  await page.route('**/api/event/subscribed**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ result: mockSubscribedEvents, hasNext: false }) }),
  );
  await page.route('**/api/event/getSubscribedPostsByKeyword**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ result: mockKeywordEvents, hasNext: false }) }),
  );
  await page.route('**/api/topic/subscribe', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(SUCCESS) }),
  );
  await page.route('**/api/topic/unsubscribe', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(SUCCESS) }),
  );
  await page.route('**/api/keyword/subscribe', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(SUCCESS) }),
  );
  await page.route('**/api/keyword/unsubscribe', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(SUCCESS) }),
  );
}

async function loginMock(page) {
  await page.evaluate(() => localStorage.setItem('accessToken', 'mock-access-token'));
}

// ─── 테스트 ───────────────────────────────────────────────────────────────
test.describe('구독 및 키워드 관리', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'userAgent', {
        get: () =>
          'Mozilla/5.0 (Linux; Android 13; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Mobile Safari/537.36',
      });
      Notification.requestPermission = async () => 'denied';
    });
  });

  test('구독 탭 진입 시 구독 채널의 최신 이벤트가 표시된다', async ({ page }) => {
    await setupSubscribeRoutes(page);

    await page.goto('/');
    await loginMock(page);
    await page.goto('/subscribe');

    await expect(page.getByRole('heading', { name: '구독' })).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('구독 채널 최신 이벤트')).toBeVisible({ timeout: 15000 });
  });

  test('구독 탭에서 구독 중인 채널 탭이 표시되고 클릭할 수 있다', async ({ page }) => {
    await setupSubscribeRoutes(page);

    // 특정 채널 클릭 시 해당 카테고리 이벤트 반환
    await page.route('**/api/event/Software**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ result: mockSubscribedEvents, hasNext: false }),
      }),
    );

    await page.goto('/');
    await loginMock(page);
    await page.goto('/subscribe');

    // 구독 중인 채널 버튼(소프트웨어학과)이 렌더링되는지 확인
    await expect(page.getByRole('button', { name: '소프트웨어학과' })).toBeVisible({ timeout: 15000 });
    await page.getByRole('button', { name: '소프트웨어학과' }).click();

    // 선택 후 이벤트 목록이 여전히 표시되는지 확인
    await expect(page.getByText('구독 채널 최신 이벤트')).toBeVisible({ timeout: 15000 });
  });

  test('구독 설정 다이얼로그를 열고 미구독 채널에 구독 버튼이 표시된다', async ({ page }) => {
    await setupSubscribeRoutes(page);

    await page.goto('/');
    await loginMock(page);
    await page.goto('/subscribe');

    // 구독 설정 버튼 클릭
    await page.getByRole('button', { name: '구독 설정' }).click();

    // 다이얼로그 열림 확인
    await expect(page.getByText('전체 구독 항목')).toBeVisible({ timeout: 15000 });

    // 카테고리 아코디언 열기
    await page.getByRole('button', { name: '기숙사' }).click();

    // 미구독 채널에 '구독' 버튼 표시 확인
    await expect(page.getByRole('button', { name: '구독' }).first()).toBeVisible({ timeout: 15000 });
  });

  test('미구독 채널의 구독 버튼 클릭 시 subscribe API가 호출된다', async ({ page }) => {
    await setupSubscribeRoutes(page);

    let subscribeApiCalled = false;
    await page.route('**/api/topic/subscribe', (route) => {
      subscribeApiCalled = true;
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(SUCCESS) });
    });

    await page.goto('/');
    await loginMock(page);
    await page.goto('/subscribe');

    await page.getByRole('button', { name: '구독 설정' }).click();
    await expect(page.getByText('전체 구독 항목')).toBeVisible({ timeout: 15000 });

    await page.getByRole('button', { name: '기숙사' }).click();
    await page.getByRole('button', { name: '구독' }).first().click();

    expect(subscribeApiCalled).toBe(true);
  });

  test('키워드 알림 탭으로 전환하면 키워드 이벤트 목록이 표시된다', async ({ page }) => {
    await setupSubscribeRoutes(page);

    await page.goto('/');
    await loginMock(page);
    await page.goto('/subscribe');

    // 키워드 알림 탭 클릭
    await page.getByRole('button', { name: '키워드 알림' }).click();

    await expect(page.getByText('해커톤 관련 이벤트')).toBeVisible({ timeout: 15000 });
  });

  test('로그인하지 않으면 구독 페이지에서 로그인 안내가 표시된다', async ({ page }) => {
    await setupSubscribeRoutes(page);

    // accessToken 없이 진입
    await page.goto('/subscribe');

    await expect(page.getByText('로그인이 필요한 서비스입니다')).toBeVisible({ timeout: 15000 });
  });

  test('키워드 구독 페이지 진입 시 등록된 키워드 목록이 표시된다', async ({ page }) => {
    await setupSubscribeRoutes(page);

    await page.goto('/');
    await loginMock(page);
    await page.goto('/subscribe/keywordSubscribe');

    await expect(page.getByText('키워드 구독')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('해커톤')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('소프트웨어학과')).toBeVisible({ timeout: 15000 });
  });

  test('키워드 구독 해제 시 unsubscribe API가 호출된다', async ({ page }) => {
    await setupSubscribeRoutes(page);

    let unsubscribeApiCalled = false;
    await page.route('**/api/keyword/unsubscribe', (route) => {
      unsubscribeApiCalled = true;
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(SUCCESS) });
    });

    await page.goto('/');
    await loginMock(page);
    await page.goto('/subscribe/keywordSubscribe');

    await expect(page.getByText('해커톤')).toBeVisible({ timeout: 15000 });

    // 삭제(휴지통) 버튼 클릭 — lucide Trash2 아이콘 버튼
    const deleteBtn = page.locator('.lucide-trash-2').first();
    await deleteBtn.waitFor({ timeout: 15000 });
    await deleteBtn.click();

    expect(unsubscribeApiCalled).toBe(true);
  });
});
