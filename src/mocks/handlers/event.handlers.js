import { rest } from 'msw';

export const mockEvents = [
  {
    id: 1,
    title: '아주대 소프트웨어 해커톤',
    category: 'ACADEMIC',
    startDate: '2024-05-01',
    endDate: '2024-05-03',
    location: '팔달관 301호',
    isLiked: false,
    likeCount: 12,
    thumbnailUrl: 'https://example.com/image1.jpg',
  },
  {
    id: 2,
    title: '봄 축제 공연',
    category: 'CULTURE',
    startDate: '2024-05-10',
    endDate: '2024-05-10',
    location: '중앙광장',
    isLiked: true,
    likeCount: 34,
    thumbnailUrl: 'https://example.com/image2.jpg',
  },
];

export const mockEventDetail = {
  id: 1,
  title: '아주대 소프트웨어 해커톤',
  category: 'ACADEMIC',
  startDate: '2024-05-01',
  endDate: '2024-05-03',
  location: '팔달관 301호',
  description: '소프트웨어학과 주최 해커톤 행사입니다.',
  isLiked: false,
  likeCount: 12,
  imageUrls: ['https://example.com/image1.jpg'],
};

export const eventHandlers = [
  rest.get('*/api/events', (req, res, ctx) => {
    const keyword = req.url.searchParams.get('keyword');
    const data = keyword
      ? mockEvents.filter((e) => e.title.includes(keyword))
      : mockEvents;
    return res(ctx.json({ data, hasNext: false }));
  }),

  rest.get('*/api/events/:id', (req, res, ctx) => {
    const { id } = req.params;
    const event = mockEvents.find((e) => e.id === Number(id));
    if (!event) return res(ctx.status(404));
    return res(ctx.json({ data: mockEventDetail }));
  }),

  rest.post('*/api/events/:id/like', (req, res, ctx) => {
    return res(ctx.json({ success: true }));
  }),

  rest.delete('*/api/events/:id/like', (req, res, ctx) => {
    return res(ctx.json({ success: true }));
  }),

  rest.get('*/api/events/banner', (req, res, ctx) => {
    return res(
      ctx.json({ data: [{ id: 1, imageUrl: 'https://example.com/banner.jpg' }] })
    );
  }),

  rest.get('*/api/events/popular', (req, res, ctx) => {
    return res(ctx.json({ data: mockEvents.slice(0, 3) }));
  }),
];
