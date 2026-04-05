import { rest } from 'msw';

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
  rest.get('*/api/notifications/unread-count', (req, res, ctx) => {
    return res(ctx.json({ data: { count: 1 } }));
  }),

  rest.patch('*/api/notifications/read-all', (req, res, ctx) => {
    return res(ctx.json({ success: true }));
  }),

  rest.patch('*/api/notifications/:id/click', (req, res, ctx) => {
    return res(ctx.json({ success: true }));
  }),
];
