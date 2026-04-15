// 테스트 환경에서 Vercel Analytics 모킹
module.exports = {
  Analytics: () => null,
  inject: jest.fn(),
  track: jest.fn(),
};
