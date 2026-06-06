import { test, expect } from '@playwright/test';

const mockUser = {
  name: '홍길동',
  major: '소프트웨어학과',
  email: 'hong@ajou.ac.kr',
  profileImage: '',
};

async function setupMyPageRoutes(page) {
  await page.route('**/api/subscriptions/isSubscribedTabRead', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ isSubscribedTabRead: true }) }),
  );
  await page.route('**/send/registration-token', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) }),
  );
  await page.route('**/api/users', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockUser) }),
  );
}

async function loginMock(page) {
  await page.evaluate(() => localStorage.setItem('accessToken', 'mock-access-token'));
}

test.describe('마이페이지 및 네비게이션', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'userAgent', {
        get: () =>
          'Mozilla/5.0 (Linux; Android 13; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Mobile Safari/537.36',
      });
      Notification.requestPermission = async () => 'denied';
    });
    await setupMyPageRoutes(page);
  });

  test('마이페이지 진입 시 사용자 정보와 메뉴가 표시된다', async ({ page }) => {
    await page.goto('/');
    await loginMock(page);
    await page.goto('/mypage');

    await expect(page.getByText('홍길동')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('소프트웨어학과')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('회원정보 수정')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('FAQ')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('버전 & 히스토리')).toBeVisible({ timeout: 15000 });
  });

  test('하단 탭바로 마이페이지 이동 후 FAQ로 진입할 수 있다', async ({ page }) => {
    await page.route('**/api/event/banner', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) }),
    );
    await page.route('**/api/event/popular', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) }),
    );

    await page.goto('/');
    await loginMock(page);

    await page.getByRole('listitem').filter({ hasText: '프로필' }).click();
    await expect(page).toHaveURL(/\/mypage$/);
    await expect(page.getByText('홍길동')).toBeVisible({ timeout: 15000 });

    await page.getByText('FAQ').click();
    await expect(page).toHaveURL(/\/faq$/);
    await expect(page.getByText('FAQ')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('계정 관리')).toBeVisible({ timeout: 15000 });
  });

  test('마이페이지에서 FAQ 페이지로 직접 이동할 수 있다', async ({ page }) => {
    await page.goto('/');
    await loginMock(page);
    await page.goto('/mypage');

    await page.getByText('FAQ').click();
    await expect(page).toHaveURL(/\/faq$/);
    await expect(page.getByText('FAQ')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('서비스 소개')).toBeVisible({ timeout: 15000 });
  });
});
