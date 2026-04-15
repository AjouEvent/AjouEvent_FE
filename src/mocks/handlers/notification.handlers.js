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

const SUCCESS_RESPONSE = {
  successStatus: "100 CONTINUE",
  successContent: "Success",
  data: {}
};

export const notificationHandlers = [
  // 실제 서비스: GET /api/notification/unread-count (단수형)
  // 실제 응답 형식: { unreadNotificationCount: N }
  // store(useNotificationStore.js): response.data.unreadNotificationCount 로 읽음
  rest.get('*/api/notification/unread-count', (req, res, ctx) => {
    return res(ctx.json({ unreadNotificationCount: 3 }));
  }),

  // 실제 서비스: POST /api/notification/readAll
  rest.post('*/api/notification/readAll', (req, res, ctx) => {
    return res(ctx.json(SUCCESS_RESPONSE));
  }),

  // 실제 서비스: POST /api/notification/click
  rest.post('*/api/notification/click', (req, res, ctx) => {
    return res(ctx.json(SUCCESS_RESPONSE));
  }),
];
