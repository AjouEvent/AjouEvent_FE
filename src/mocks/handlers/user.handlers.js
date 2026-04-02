import { http, HttpResponse } from 'msw';

export const mockUser = {
  id: 1,
  name: '홍길동',
  email: 'hong@ajou.ac.kr',
  major: '소프트웨어학과',
};

export const userHandlers = [
  http.get('*/api/users/me', () => {
    return HttpResponse.json({ data: mockUser });
  }),

  http.patch('*/api/users/me', () => {
    return HttpResponse.json({ success: true });
  }),

  http.delete('*/api/users/me', () => {
    return HttpResponse.json({ success: true });
  }),

  // 토큰 갱신 - 성공 케이스 (기본)
  http.patch('*/api/users/reissue-token', () => {
    return HttpResponse.json(
      {},
      {
        headers: { Authorization: 'Bearer new-mock-access-token' },
      }
    );
  }),

  http.post('*/api/users/register', () => {
    return HttpResponse.json({ success: true });
  }),
];
