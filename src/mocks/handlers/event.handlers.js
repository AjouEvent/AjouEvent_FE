import { http, HttpResponse } from 'msw';

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
  http.get('*/api/events', ({ request }) => {
    const url = new URL(request.url);
    const keyword = url.searchParams.get('keyword');
    const data = keyword
      ? mockEvents.filter((e) => e.title.includes(keyword))
      : mockEvents;
    return HttpResponse.json({ data, hasNext: false });
  }),

  http.get('*/api/events/:id', ({ params }) => {
    const event = mockEvents.find((e) => e.id === Number(params.id));
    if (!event) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json({ data: mockEventDetail });
  }),

  http.post('*/api/events/:id/like', ({ params }) => {
    return HttpResponse.json({ success: true });
  }),

  http.delete('*/api/events/:id/like', ({ params }) => {
    return HttpResponse.json({ success: true });
  }),

  http.get('*/api/events/banner', () => {
    return HttpResponse.json({
      data: [{ id: 1, imageUrl: 'https://example.com/banner.jpg' }],
    });
  }),

  http.get('*/api/events/popular', () => {
    return HttpResponse.json({ data: mockEvents.slice(0, 3) });
  }),
];
