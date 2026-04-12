import { rest } from 'msw';

export const mockUser = {
  name: '홍길동',
  email: 'hong@ajou.ac.kr',
  major: '소프트웨어학과',
  phone: '010-1234-5678',
};

export const userHandlers = [
  // GET /api/users (이전에는 /api/users/me로 잘못 작성되어 있었음)
  rest.get('*/api/users', (req, res, ctx) => {
    return res(ctx.json(mockUser));
  }),

  // PATCH /api/users
  rest.patch('*/api/users', (req, res, ctx) => {
    // 응답이 string이므로 text() 또는 json(문자열)로 반환
    return res(ctx.text("Success"));
  }),

  // DELETE /api/users
  rest.delete('*/api/users', (req, res, ctx) => {
    return res(ctx.text("Success"));
  }),

  // PATCH /api/users/reissue-token
  rest.patch('*/api/users/reissue-token', (req, res, ctx) => {
    const mockTokenResponse = {
      id: 1,
      grantType: "Bearer",
      accessToken: "new-mock-access-token",
      refreshToken: "new-mock-refresh-token",
      name: "홍길동",
      major: "소프트웨어학과",
      email: "hong@ajou.ac.kr",
      isNewMember: false,
    };
    // Authorization 헤더 세팅과 더불어 Swagger 구조에 맞는 본문 데이터 반환
    return res(
      ctx.set('Authorization', `Bearer ${mockTokenResponse.accessToken}`),
      ctx.json(mockTokenResponse)
    );
  }),

  // POST /api/users/register
  rest.post('*/api/users/register', (req, res, ctx) => {
    return res(ctx.text("Success"));
  }),
];
