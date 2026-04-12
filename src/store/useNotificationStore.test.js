import { waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { server } from '../mocks/server';
import useNotificationStore from './useNotificationStore';

const initialState = useNotificationStore.getState();

// 공유 handlers는 /api/notifications/unread-count(복수)를 등록하지만
// 실제 스토어는 /api/notification/unread-count(단수)를 호출한다.
// setupTests.js의 afterEach → server.resetHandlers()가 매 테스트 후 핸들러를 초기화하므로
// beforeEach에서 재등록해야 각 테스트에서 핸들러가 유지된다.
beforeEach(() => {
  server.use(
    // 실제 백엔드 응답 형식: { unreadNotificationCount: N }
    // Axios response.data = JSON 바디 전체이므로 data 래퍼 없이 반환
    rest.get('*/api/notification/unread-count', (req, res, ctx) =>
      res(ctx.json({ unreadNotificationCount: 1 })),
    ),
  );
});

describe('useNotificationStore', () => {
  beforeEach(() => {
    useNotificationStore.setState(initialState);
    navigator.setAppBadge.mockClear();
  });

  describe('초기 상태', () => {
    it('unreadNotificationCount가 0이다', () => {
      expect(useNotificationStore.getState().unreadNotificationCount).toBe(0);
    });
  });

  describe('setUnreadNotificationCount', () => {
    it('카운트를 직접 설정한다', () => {
      // Act
      useNotificationStore.getState().setUnreadNotificationCount(5);

      // Assert
      expect(useNotificationStore.getState().unreadNotificationCount).toBe(5);
    });
  });

  describe('fetchUnreadNotificationCount', () => {
    it('API에서 미읽은 알림 수를 가져와 상태를 업데이트한다', async () => {
      // Arrange: 기본 핸들러가 { data: { unreadNotificationCount: 1 } } 반환

      // Act
      await useNotificationStore.getState().fetchUnreadNotificationCount();

      // Assert
      expect(useNotificationStore.getState().unreadNotificationCount).toBe(1);
    });

    it('navigator.setAppBadge가 있으면 카운트와 함께 호출한다', async () => {
      // Act
      await useNotificationStore.getState().fetchUnreadNotificationCount();

      // Assert
      await waitFor(() => {
        expect(navigator.setAppBadge).toHaveBeenCalledWith(1);
      });
    });

    it('API 실패 시 unreadNotificationCount가 변경되지 않는다', async () => {
      // Arrange: 500 응답으로 오버라이드
      server.use(
        rest.get('*/api/notification/unread-count', (req, res, ctx) =>
          res(ctx.status(500)),
        ),
      );
      useNotificationStore.setState({ unreadNotificationCount: 3 });

      // Act
      await useNotificationStore.getState().fetchUnreadNotificationCount();

      // Assert
      expect(useNotificationStore.getState().unreadNotificationCount).toBe(3);
    });
  });
});
