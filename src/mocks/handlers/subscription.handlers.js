import { http, HttpResponse } from 'msw';

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
  http.get('*/api/subscriptions/topics', () => {
    return HttpResponse.json({ data: mockTopics });
  }),

  http.post('*/api/subscriptions/topics/:id', () => {
    return HttpResponse.json({ success: true });
  }),

  http.delete('*/api/subscriptions/topics/:id', () => {
    return HttpResponse.json({ success: true });
  }),

  http.patch('*/api/subscriptions/topics/:id/notification', () => {
    return HttpResponse.json({ success: true });
  }),

  http.get('*/api/subscriptions/keywords', () => {
    return HttpResponse.json({ data: mockKeywords });
  }),

  http.post('*/api/subscriptions/keywords', () => {
    return HttpResponse.json({ success: true });
  }),

  http.delete('*/api/subscriptions/keywords/:id', () => {
    return HttpResponse.json({ success: true });
  }),

  http.get('*/api/subscriptions/read-status', () => {
    return HttpResponse.json({ data: { isRead: true } });
  }),
];
