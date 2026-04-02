import { http, HttpResponse } from 'msw';

export const mockNotifications = [
  {
    id: 1,
    title: '구독 알림: 소프트웨어학과',
    body: '새 행사가 등록되었습니다.',
    isRead: false,
    createdAt: '2024-05-01T10:00:00',
    eventId: 1,
  },
  {
    id: 2,
    title: '구독 알림: 학생처',
    body: '장학금 신청 안내입니다.',
    isRead: true,
    createdAt: '2024-04-30T09:00:00',
    eventId: 2,
  },
];

export const notificationHandlers = [
  http.get('*/api/notifications/unread-count', () => {
    return HttpResponse.json({ data: { count: 1 } });
  }),

  http.patch('*/api/notifications/read-all', () => {
    return HttpResponse.json({ success: true });
  }),

  http.patch('*/api/notifications/:id/click', ({ params }) => {
    return HttpResponse.json({ success: true });
  }),
];
