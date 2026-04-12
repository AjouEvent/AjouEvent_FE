import { rest } from 'msw';
import { server } from '../mocks/server';
import useSubscriptionStore from './useSubscriptionStore';

// analytics 모킹 (ReactGA 의존성 제거)
jest.mock('../utils/analytics', () => ({
  GA: {
    subscribeTopic: jest.fn(),
    unsubscribeTopic: jest.fn(),
  },
}));

import { GA } from '../utils/analytics';

const initialState = useSubscriptionStore.getState();

// 공유 handlers는 /api/subscriptions/topics 등을 등록하지만
// 실제 스토어는 /api/topic/subscriptions, /api/topic/subscribe 등을 호출한다.
// setupTests.js의 afterEach → server.resetHandlers()가 매 테스트 후 핸들러를 초기화하므로
// beforeEach에서 재등록해야 각 테스트에서 핸들러가 유지된다.
//
// englishTopic 값은 departmentCodes.js의 KtoECodes를 따른다 (PascalCase)
// 예) 소프트웨어학과 → 'Software', 대학원 → 'Graduate', 기숙사 → 'Dormitory'
const mockTopicsData = [
  { englishTopic: 'Software', koreanTopic: '소프트웨어학과', subscribed: true, isRead: true },
  { englishTopic: 'Dormitory', koreanTopic: '기숙사', subscribed: false, isRead: false },
  { englishTopic: 'Graduate', koreanTopic: '대학원', subscribed: false, isRead: true },
];

beforeEach(() => {
  server.use(
    // store의 fetchSubscribedTopics: response.data를 배열로 직접 사용 → data 래퍼 없이 반환
    rest.get('*/api/topic/subscriptions', (req, res, ctx) =>
      res(ctx.json(mockTopicsData)),
    ),
    rest.post('*/api/topic/subscribe', (req, res, ctx) =>
      res(ctx.json({ success: true })),
    ),
    rest.post('*/api/topic/unsubscribe', (req, res, ctx) =>
      res(ctx.json({ success: true })),
    ),
    // store의 fetchSubscribedKeywords: response.data를 배열로 직접 사용
    rest.get('*/api/keyword/userKeywords', (req, res, ctx) =>
      res(ctx.json([])),
    ),
    // store의 updateSubscribedTabRead: response.data.isSubscribedTabRead 읽음
    // store의 fetchMemberStatus: response.data.subscribedTabRead 읽음
    rest.get('*/api/subscriptions/isSubscribedTabRead', (req, res, ctx) =>
      res(ctx.json({ isSubscribedTabRead: true, subscribedTabRead: true })),
    ),
  );
});

describe('useSubscriptionStore', () => {
  beforeEach(() => {
    useSubscriptionStore.setState(initialState);
    jest.clearAllMocks();
  });

  describe('초기 상태', () => {
    it('topics, subscribeItems, keywords, subscribedKeywords가 빈 배열이다', () => {
      const { topics, subscribeItems, keywords, subscribedKeywords } =
        useSubscriptionStore.getState();
      expect(topics).toEqual([]);
      expect(subscribeItems).toEqual([]);
      expect(keywords).toEqual([]);
      expect(subscribedKeywords).toEqual([]);
    });

    it('탭 읽음 상태가 모두 true이다', () => {
      const { isTopicTabRead, isKeywordTabRead, isSubscribedTabRead } =
        useSubscriptionStore.getState();
      expect(isTopicTabRead).toBe(true);
      expect(isKeywordTabRead).toBe(true);
      expect(isSubscribedTabRead).toBe(true);
    });
  });

  describe('updateTabReadStatus', () => {
    it('모든 subscribeItems가 읽음이면 isTopicTabRead가 true이다', () => {
      // Arrange: departmentCodes.js 기반 영문 코드 사용 (PascalCase)
      useSubscriptionStore.setState({
        subscribeItems: [
          { englishTopic: 'Software', isRead: true },
          { englishTopic: 'Dormitory', isRead: true },
        ],
      });

      // Act
      useSubscriptionStore.getState().updateTabReadStatus();

      // Assert
      expect(useSubscriptionStore.getState().isTopicTabRead).toBe(true);
    });

    it('읽지 않은 subscribeItem이 있으면 isTopicTabRead가 false이다', () => {
      // Arrange
      useSubscriptionStore.setState({
        subscribeItems: [
          { englishTopic: 'Software', isRead: true },
          { englishTopic: 'Dormitory', isRead: false },
        ],
        subscribedKeywords: [],
      });

      // Act
      useSubscriptionStore.getState().updateTabReadStatus();

      // Assert
      expect(useSubscriptionStore.getState().isTopicTabRead).toBe(false);
    });

    it('읽지 않은 keyword가 있으면 isKeywordTabRead가 false이다', () => {
      // Arrange
      useSubscriptionStore.setState({
        subscribeItems: [],
        subscribedKeywords: [
          { encodedKeyword: 'encoded_해커톤', isRead: true },
          { encodedKeyword: 'encoded_장학금', isRead: false },
        ],
      });

      // Act
      useSubscriptionStore.getState().updateTabReadStatus();

      // Assert
      expect(useSubscriptionStore.getState().isKeywordTabRead).toBe(false);
    });
  });

  describe('markTopicAsRead', () => {
    beforeEach(() => {
      useSubscriptionStore.setState({
        subscribeItems: [
          { englishTopic: 'Software', isRead: false },
          { englishTopic: 'Dormitory', isRead: false },
        ],
        subscribedKeywords: [],
      });
    });

    it('해당 topic의 isRead를 true로 변경한다', () => {
      // Act
      useSubscriptionStore.getState().markTopicAsRead('Software');

      // Assert
      const item = useSubscriptionStore
        .getState()
        .subscribeItems.find((i) => i.englishTopic === 'Software');
      expect(item.isRead).toBe(true);
    });

    it('모든 topic이 읽음이면 isTopicTabRead가 true가 된다', () => {
      // Act: 둘 다 읽음 처리
      useSubscriptionStore.getState().markTopicAsRead('Software');
      useSubscriptionStore.getState().markTopicAsRead('Dormitory');

      // Assert
      expect(useSubscriptionStore.getState().isTopicTabRead).toBe(true);
    });

    it('일부 topic이 남아있으면 isTopicTabRead가 false로 유지된다', () => {
      // Act: 하나만 읽음 처리
      useSubscriptionStore.getState().markTopicAsRead('Software');

      // Assert
      expect(useSubscriptionStore.getState().isTopicTabRead).toBe(false);
    });
  });

  describe('markKeywordAsRead', () => {
    beforeEach(() => {
      useSubscriptionStore.setState({
        subscribeItems: [],
        subscribedKeywords: [
          { encodedKeyword: 'encoded_해커톤', isRead: false },
          { encodedKeyword: 'encoded_장학금', isRead: false },
        ],
      });
    });

    it('해당 keyword의 isRead를 true로 변경한다', () => {
      // Act
      useSubscriptionStore
        .getState()
        .markKeywordAsRead({ encodedKeyword: 'encoded_해커톤' });

      // Assert
      const keyword = useSubscriptionStore
        .getState()
        .subscribedKeywords.find((k) => k.encodedKeyword === 'encoded_해커톤');
      expect(keyword.isRead).toBe(true);
    });

    it('모든 keyword가 읽음이면 isKeywordTabRead가 true가 된다', () => {
      useSubscriptionStore
        .getState()
        .markKeywordAsRead({ encodedKeyword: 'encoded_해커톤' });
      useSubscriptionStore
        .getState()
        .markKeywordAsRead({ encodedKeyword: 'encoded_장학금' });

      expect(useSubscriptionStore.getState().isKeywordTabRead).toBe(true);
    });
  });

  describe('fetchSubscribedTopics', () => {
    it('API에서 topics를 가져와 상태를 업데이트한다', async () => {
      // Act
      await useSubscriptionStore.getState().fetchSubscribedTopics();

      // Assert: mockTopicsData 기반 (departmentCodes.js PascalCase)
      const { topics } = useSubscriptionStore.getState();
      expect(topics).toHaveLength(3);
      expect(topics[0].englishTopic).toBe('Software');
    });

    it('API 실패 시 topics가 변경되지 않는다', async () => {
      // Arrange: 500 응답으로 오버라이드
      server.use(
        rest.get('*/api/topic/subscriptions', (req, res, ctx) =>
          res(ctx.status(500)),
        ),
      );
      useSubscriptionStore.setState({ topics: [] });

      // Act
      await useSubscriptionStore.getState().fetchSubscribedTopics();

      // Assert
      expect(useSubscriptionStore.getState().topics).toEqual([]);
    });
  });

  describe('subscribeToTopic', () => {
    beforeEach(() => {
      useSubscriptionStore.setState({
        topics: [
          { englishTopic: 'Software', subscribed: false },
          { englishTopic: 'Dormitory', subscribed: false },
        ],
      });
    });

    it('API 호출 후 해당 topic의 subscribed를 true로 변경한다', async () => {
      // Act
      await useSubscriptionStore.getState().subscribeToTopic('Software');

      // Assert
      const topic = useSubscriptionStore
        .getState()
        .topics.find((t) => t.englishTopic === 'Software');
      expect(topic.subscribed).toBe(true);
    });

    it('GA 구독 이벤트를 발생시킨다', async () => {
      await useSubscriptionStore.getState().subscribeToTopic('Software');
      expect(GA.subscribeTopic).toHaveBeenCalledWith('Software');
    });
  });

  describe('unsubscribeFromTopic', () => {
    beforeEach(() => {
      useSubscriptionStore.setState({
        topics: [{ englishTopic: 'Software', subscribed: true }],
      });
    });

    it('API 호출 후 해당 topic의 subscribed를 false로 변경한다', async () => {
      // Act
      await useSubscriptionStore.getState().unsubscribeFromTopic('Software');

      // Assert
      const topic = useSubscriptionStore
        .getState()
        .topics.find((t) => t.englishTopic === 'Software');
      expect(topic.subscribed).toBe(false);
    });

    it('GA 구독 취소 이벤트를 발생시킨다', async () => {
      await useSubscriptionStore.getState().unsubscribeFromTopic('Software');
      expect(GA.unsubscribeTopic).toHaveBeenCalledWith('Software');
    });
  });
});
