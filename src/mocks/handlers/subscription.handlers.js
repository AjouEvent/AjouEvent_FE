import { rest } from 'msw';

// 토픽 구독 목록 mock 데이터 (GET /api/topic/subscriptions)
export const mockTopics = [
  { id: 1, englishTopic: 'Software', koreanTopic: '소프트웨어학과', isRead: true, lastReadAt: '2026-04-12T10:03:30.453Z' },
  { id: 2, englishTopic: 'Dormitory', koreanTopic: '기숙사', isRead: false, lastReadAt: null },
  { id: 3, englishTopic: 'Graduate', koreanTopic: '대학원', isRead: true, lastReadAt: '2026-04-12T10:03:30.453Z' },
];

// 토픽 구독 상태 목록 mock 데이터 (GET /api/topic/subscriptionsStatus)
export const mockTopicsStatus = [
  { id: 1, englishTopic: 'Software', koreanTopic: '소프트웨어학과', classification: '학과', subscribed: true, koreanOrder: 1, receiveNotification: true },
  { id: 2, englishTopic: 'Dormitory', koreanTopic: '기숙사', classification: '기숙사', subscribed: false, koreanOrder: 2, receiveNotification: false },
  { id: 3, englishTopic: 'Graduate', koreanTopic: '대학원', classification: '대학원', subscribed: false, koreanOrder: 3, receiveNotification: true },
];

// 키워드 구독 목록 mock 데이터 (GET /api/keyword/userKeywords)
export const mockKeywords = [
  { encodedKeyword: 'encoded_해커톤', koreanKeyword: '해커톤', searchKeyword: '해커톤', topicName: '전체', isRead: false, lastReadAt: null },
  { encodedKeyword: 'encoded_장학금', koreanKeyword: '장학금', searchKeyword: '장학금', topicName: '전체', isRead: true, lastReadAt: '2026-04-12T10:14:05.450Z' },
];

// Success response mock 데이터
const SUCCESS_RESPONSE = {
  successStatus: "100 CONTINUE",
  successContent: "Success",
  data: {}
};

export const subscriptionHandlers = [
  rest.get('*/api/topic/subscriptions', (req, res, ctx) => {
    return res(ctx.json(mockTopics));
  }),

  // GET /api/topic/subscriptionsStatus
  rest.get('*/api/topic/subscriptionsStatus', (req, res, ctx) => {
    return res(ctx.json(mockTopicsStatus));
  }),

  rest.post('*/api/topic/subscribe', (req, res, ctx) => {
    return res(ctx.json(SUCCESS_RESPONSE));
  }),

  rest.post('*/api/topic/unsubscribe', (req, res, ctx) => {
    return res(ctx.json(SUCCESS_RESPONSE));
  }),

  rest.post('*/api/topic/subscriptions/notification', (req, res, ctx) => {
    return res(ctx.json(SUCCESS_RESPONSE));
  }),

  rest.get('*/api/keyword/userKeywords', (req, res, ctx) => {
    return res(ctx.json(mockKeywords));
  }),

  rest.post('*/api/keyword/subscribe', (req, res, ctx) => {
    return res(ctx.json(SUCCESS_RESPONSE));
  }),

  rest.post('*/api/keyword/unsubscribe', (req, res, ctx) => {
    return res(ctx.json(SUCCESS_RESPONSE));
  }),

  rest.get('*/api/subscriptions/isSubscribedTabRead', (req, res, ctx) => {
    return res(ctx.json({ subscribedTabRead: true }));
  }),
];
