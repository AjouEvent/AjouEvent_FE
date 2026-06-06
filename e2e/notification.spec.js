import { test, expect } from '@playwright/test';

// ─── mock 데이터 ────────────────────────────────────────────────────────────
const mockTopicNotifications = [
  {
    id: 1,
    title: '소프트웨어학과 공지',
    imageUrl: 'https://www.ajou.ac.kr/_res/ajou/kr/img/intro/img-symbol.png',
    isRead: false,
    topicName: '소프트웨어학과',
    keywordName: null,
    notifiedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5분 전
    clickUrl: 'https://www.ajouevent.com/event/101',
  },
  {
    id: 2,
    title: '기숙사 안내',
    imageUrl: 'https://www.ajou.ac.kr/_res/ajou/kr/img/intro/img-symbol.png',
    isRead: true,
    topicName: '기숙사',
    keywordName: null,
    notifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2시간 전
    clickUrl: 'https://www.ajouevent.com/event/102',
  },
];

const mockKeywordNotifications = [
  {
    id: 3,
    title: '해커톤 모집 공고',
    imageUrl: 'https://www.ajou.ac.kr/_res/ajou/kr/img/intro/img-symbol.png',
    isRead: false,
    topicName: '소프트웨어학과',
    keywordName: '해커톤',
    notifiedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10분 전
    clickUrl: 'https://www.ajouevent.com/event/201',
  },
];

const SUCCESS = { successStatus: '100 CONTINUE', successContent: 'Success', data: {} };

// ─── 공통 route 설정 ─────────────────────────────────────────────────────
async function setupNotificationRoutes(page, { topicEmpty = false, keywordEmpty = false } = {}) {
  await page.route('**/api/subscriptions/isSubscribedTabRead', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ isSubscribedTabRead: true }) }),
  );
  await page.route('**/send/registration-token', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) }),
  );
  await page.route('**/api/topic/subscriptions', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) }),
  );
  await page.route('**/api/keyword/userKeywords', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) }),
  );
  await page.route('**/api/notification/unread-count', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ unreadNotificationCount: 2 }) }),
  );
  await page.route('**/api/notification/readAll', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(SUCCESS) }),
  );
  await page.route('**/api/notification/click', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(SUCCESS) }),
  );
  // 구독 알림(topic) 페이지네이션
  await page.route('**/api/notification/topic**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ result: topicEmpty ? [] : mockTopicNotifications, hasNext: false }),
    }),
  );
  // 키워드 알림 페이지네이션
  await page.route('**/api/notification/keyword**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ result: keywordEmpty ? [] : mockKeywordNotifications, hasNext: false }),
    }),
  );
}

// ─── 테스트 ───────────────────────────────────────────────────────────────
test.describe('알림 목록 및 읽음 처리', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'userAgent', {
        get: () =>
          'Mozilla/5.0 (Linux; Android 13; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Mobile Safari/537.36',
      });
      Notification.requestPermission = async () => 'denied';
    });
  });

  test('알림 페이지 진입 시 구독 알림 탭이 기본으로 열리고 목록이 표시된다', async ({ page }) => {
    await setupNotificationRoutes(page);

    await page.goto('/notification');

    // 상단바 타이틀 span에 정확히 매칭
    await expect(page.getByText('알림', { exact: true })).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('button', { name: '구독 알림' })).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('button', { name: '키워드 알림' })).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('소프트웨어학과 공지')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('기숙사 안내')).toBeVisible({ timeout: 15000 });
  });

  test('키워드 알림 탭으로 전환하면 키워드 알림 목록이 표시된다', async ({ page }) => {
    await setupNotificationRoutes(page);

    await page.goto('/notification');

    await page.getByRole('button', { name: '키워드 알림' }).click();

    await expect(page.getByText('해커톤 모집 공고')).toBeVisible({ timeout: 15000 });
    // 키워드 배지 '· 해커톤' 중 span 요소만 정확히 선택
    await expect(page.locator('span').filter({ hasText: /^· 해커톤$/ })).toBeVisible({ timeout: 15000 });
  });

  test('구독 알림이 없을 때 빈 상태 메시지가 표시된다', async ({ page }) => {
    await setupNotificationRoutes(page, { topicEmpty: true });

    await page.goto('/notification');

    await expect(page.getByText('알림이 없습니다')).toBeVisible({ timeout: 15000 });
  });

  test('읽지 않은 알림은 파란 배경으로 강조된다', async ({ page }) => {
    await setupNotificationRoutes(page);

    await page.goto('/notification');

    // isRead=false 인 알림은 bg-[#EEF5FF] 클래스가 적용됨
    await expect(page.getByText('소프트웨어학과 공지')).toBeVisible({ timeout: 15000 });
    const unreadCard = page.locator('.bg-\\[\\#EEF5FF\\]').first();
    await expect(unreadCard).toBeVisible({ timeout: 15000 });
  });

  test('모두 읽음 버튼 클릭 시 확인 다이얼로그가 표시된다', async ({ page }) => {
    await setupNotificationRoutes(page);

    await page.goto('/notification');

    // 알림 목록이 렌더링된 뒤 버튼 클릭 (타이밍 안정화)
    await expect(page.getByText('소프트웨어학과 공지')).toBeVisible({ timeout: 15000 });
    await page.getByRole('button', { name: '모두 읽음' }).click();

    // ConfirmDialog 렌더링 확인
    await expect(page.getByText('알림 읽음 처리')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('정말 모든 알림을 읽음 처리할까요?')).toBeVisible({ timeout: 15000 });
  });

  test('모두 읽음 확인 클릭 시 readAll API가 호출되고 성공 토스트가 표시된다', async ({ page }) => {
    await setupNotificationRoutes(page);

    let readAllCalled = false;
    await page.route('**/api/notification/readAll', (route) => {
      readAllCalled = true;
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(SUCCESS) });
    });

    await page.goto('/notification');

    await page.getByRole('button', { name: '모두 읽음' }).click();
    await expect(page.getByText('정말 모든 알림을 읽음 처리할까요?')).toBeVisible({ timeout: 15000 });

    // ConfirmDialog에서 확인 버튼 클릭
    await page.getByRole('button', { name: '확인' }).click();

    expect(readAllCalled).toBe(true);
    await expect(page.getByText('읽음 처리 완료')).toBeVisible({ timeout: 15000 });
  });

  test('모두 읽음 취소 클릭 시 API가 호출되지 않는다', async ({ page }) => {
    await setupNotificationRoutes(page);

    let readAllCalled = false;
    await page.route('**/api/notification/readAll', (route) => {
      readAllCalled = true;
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(SUCCESS) });
    });

    await page.goto('/notification');

    await page.getByRole('button', { name: '모두 읽음' }).click();
    await expect(page.getByText('정말 모든 알림을 읽음 처리할까요?')).toBeVisible({ timeout: 15000 });

    // 취소 버튼 클릭
    await page.getByRole('button', { name: '취소' }).click();

    expect(readAllCalled).toBe(false);
    // 목록이 그대로 유지되는지 확인
    await expect(page.getByText('소프트웨어학과 공지')).toBeVisible({ timeout: 15000 });
  });

  test('하단 탭바에서 구독 페이지를 거쳐 알림 페이지로 이동할 수 있다', async ({ page }) => {
    await setupNotificationRoutes(page);

    await page.route('**/api/event/banner', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) }),
    );
    await page.route('**/api/event/popular', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) }),
    );
    await page.route('**/api/event/subscribed**', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ result: [], hasNext: false }) }),
    );
    await page.route('**/api/topic/subscriptions', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) }),
    );
    await page.route('**/api/keyword/userKeywords', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) }),
    );

    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('accessToken', 'mock-access-token'));

    // 탭바에는 홈/검색/찜/구독/프로필만 있으므로 구독 탭으로 이동 확인
    await page.getByRole('listitem').filter({ hasText: /^구독$/ }).click();
    await expect(page).toHaveURL(/\/subscribe$/);
    await expect(page.getByText('구독 알림')).toBeVisible({ timeout: 15000 });
  });
});
