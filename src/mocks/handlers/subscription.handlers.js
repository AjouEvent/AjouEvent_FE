import { rest } from 'msw';

export const mockTopics = [
  { id: 1, name: '소프트웨어학과', isSubscribed: true, notificationEnabled: true },
  { id: 2, name: '학생처', isSubscribed: false, notificationEnabled: false },
  { id: 3, name: '대학원', isSubscribed: false, notificationEnabled: false },
];

export const mockKeywords = [
  { id: 1, keyword: '해커톤' },
  { id: 2, keyword: '장학금' },
];

export const subscriptionHandlers = [
  rest.get('*/api/subscriptions/topics', (req, res, ctx) => {
    return res(ctx.json({ data: mockTopics }));
  }),

  rest.post('*/api/subscriptions/topics/:id', (req, res, ctx) => {
    return res(ctx.json({ success: true }));
  }),

  rest.delete('*/api/subscriptions/topics/:id', (req, res, ctx) => {
    return res(ctx.json({ success: true }));
  }),

  rest.patch('*/api/subscriptions/topics/:id/notification', (req, res, ctx) => {
    return res(ctx.json({ success: true }));
  }),

  rest.get('*/api/subscriptions/keywords', (req, res, ctx) => {
    return res(ctx.json({ data: mockKeywords }));
  }),

  rest.post('*/api/subscriptions/keywords', (req, res, ctx) => {
    return res(ctx.json({ success: true }));
  }),

  rest.delete('*/api/subscriptions/keywords/:id', (req, res, ctx) => {
    return res(ctx.json({ success: true }));
  }),

  rest.get('*/api/subscriptions/read-status', (req, res, ctx) => {
    return res(ctx.json({ data: { isRead: true } }));
  }),
];
