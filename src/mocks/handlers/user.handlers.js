import { rest } from 'msw';

export const mockUser = {
  id: 1,
  name: '홍길동',
  email: 'hong@ajou.ac.kr',
  major: '소프트웨어학과',
};

export const userHandlers = [
  rest.get('*/api/users/me', (req, res, ctx) => {
    return res(ctx.json({ data: mockUser }));
  }),

  rest.patch('*/api/users/me', (req, res, ctx) => {
    return res(ctx.json({ success: true }));
  }),

  rest.delete('*/api/users/me', (req, res, ctx) => {
    return res(ctx.json({ success: true }));
  }),

  // 토큰 갱신 - 성공 케이스 (기본)
  rest.patch('*/api/users/reissue-token', (req, res, ctx) => {
    return res(
      ctx.set('Authorization', 'Bearer new-mock-access-token'),
      ctx.json({})
    );
  }),

  rest.post('*/api/users/register', (req, res, ctx) => {
    return res(ctx.json({ success: true }));
  }),
];
