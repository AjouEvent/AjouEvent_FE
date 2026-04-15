import { rest } from 'msw';

const SUCCESS_RESPONSE = {
  successStatus: "100 CONTINUE",
  successContent: "Success",
  data: {}
};

export const mockBanners = [
  {
    imgUrl: "https://example.com/banner.jpg",
    siteUrl: "https://example.com",
    bannerOrder: 1,
    startDate: "2026-04-12",
    endDate: "2026-12-31"
  }
];

export const mockPopularEvents = [
  {
    title: "아주대 소프트웨어 해커톤",
    content: "해커톤 내용",
    imgUrl: "https://example.com/image1.jpg",
    url: "https://example.com/detail/1",
    createdAt: "2026-04-12T10:35:34.694Z",
    eventId: 1,
    likesCount: 10,
    viewCount: 100,
    star: true,
    subject: "해커톤",
    type: "AIMOBILITYENGINEERING",
    writer: "소프트웨어학과"
  }
];

export const mockEventDetail = {
  title: "아주대 소프트웨어 해커톤",
  content: "소프트웨어학과 주최 해커톤 행사입니다.",
  imgUrl: ["https://example.com/image1.jpg"],
  eventId: 1,
  createdAt: "2026-04-12T10:36:02.193Z",
  type: "AIMOBILITYENGINEERING",
  writer: "소프트웨어학과",
  likesCount: 12,
  viewCount: 100,
  star: true,
  subject: "행사 세부내용",
  url: "https://example.com/detail/1"
};

export const mockPagedEvents = {
  result: mockPopularEvents,
  hasPrevious: false,
  hasNext: false,
  currentPage: 0,
  sort: {
    sorted: true,
    direction: "DESC",
    orderProperty: "createdAt"
  }
};

export const eventHandlers = [
  // GET /api/event/banner
  rest.get('*/api/event/banner', (req, res, ctx) => {
    return res(ctx.json(mockBanners));
  }),

  // GET /api/event/popular
  rest.get('*/api/event/popular', (req, res, ctx) => {
    return res(ctx.json(mockPopularEvents));
  }),

  // GET /api/event/detail/{eventId}
  rest.get('*/api/event/detail/:eventId', (req, res, ctx) => {
    return res(ctx.json(mockEventDetail));
  }),

  // GET /api/event/liked
  rest.get('*/api/event/liked', (req, res, ctx) => {
    return res(ctx.json(mockPagedEvents));
  }),

  // GET /api/event/subscribed
  rest.get('*/api/event/subscribed', (req, res, ctx) => {
    return res(ctx.json(mockPagedEvents));
  }),

  // GET /api/event/getSubscribedPostsByKeyword
  rest.get('*/api/event/getSubscribedPostsByKeyword', (req, res, ctx) => {
    return res(ctx.json(mockPagedEvents));
  }),

  // GET /api/event/getSubscribedPostsByKeyword/{keyword}
  rest.get('*/api/event/getSubscribedPostsByKeyword/:keyword', (req, res, ctx) => {
    return res(ctx.json(mockPagedEvents));
  }),

  // /api/event/{category} - getEventsByCategory 용
  rest.get('*/api/event/:category', (req, res, ctx) => {
    const { category } = req.params;
    if (category === 'banner' || category === 'popular' || category === 'detail' || category === 'liked' || category === 'subscribed' || category === 'getSubscribedPostsByKeyword' || category === 'like' || category === 'calendar') {
      return req.passthrough(); // 다른 핸들러가 처리하도록 패스스루
    }
    return res(ctx.json(mockPagedEvents));
  }),

  // POST /api/event/like/{eventId}
  rest.post('*/api/event/like/:eventId', (req, res, ctx) => {
    return res(ctx.json(SUCCESS_RESPONSE));
  }),

  // DELETE /api/event/like/{eventId}
  rest.delete('*/api/event/like/:eventId', (req, res, ctx) => {
    return res(ctx.json(SUCCESS_RESPONSE));
  }),

  // POST /api/event/calendar
  rest.post('*/api/event/calendar', (req, res, ctx) => {
    return res(ctx.json({})); // 200 OK
  })
];
