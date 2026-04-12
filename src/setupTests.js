/**
 * Jest 테스트 환경 초기 설정
 *
 * ## MSW 버전 결정: v1 사용 (v2 미사용 이유)
 *
 * MSW v2는 CRA(react-scripts 5)의 Jest 27 + jsdom 환경과 근본적으로 비호환이다.
 * 마이그레이션을 시도했으나 아래 4단계 오류가 연쇄 발생했다:
 *
 *   1. TextEncoder not defined
 *      → jsdom이 Web Encoding API를 global에 노출하지 않음
 *      → CommonJS polyfill로 해결
 *
 *   2. TransformStream not defined
 *      → msw/node가 Web Streams API를 모듈 로드 시점에 참조
 *      → Node 20의 stream/web 전체를 global에 등록하여 해결
 *
 *   3. SyntaxError: Unexpected token 'export' (until-async 패키지)
 *      → MSW v2가 ESM 전용 패키지에 의존, CRA Jest는 node_modules 미변환
 *      → transformIgnorePatterns에 msw/@mswjs/until-async 추가하여 해결
 *
 *   4. Static class blocks not enabled (@babel/plugin-transform-class-static-block 필요)
 *      → @mswjs/interceptors CJS 번들이 ES2022 class static block 사용
 *      → CRA의 Babel 7 preset에 해당 플러그인 미포함
 *      → CRA의 제한된 jest 옵션으로 babel config 오버라이드 불가
 *
 * 4번 오류는 eject 또는 CRACO 없이는 해결 불가능하다.
 * MSW v1은 Node.js 기본 http/https 모듈 기반으로 위 Web API 의존성이 없으며
 * CRA + Jest 27 환경에서 추가 설정 없이 동작한다.
 *
 * 재검토 시점: CRA를 Vite/Next.js로 마이그레이션하거나 Jest 28+ 환경이 갖춰지면
 *              MSW v2 재도입 검토 가능.
 */

import '@testing-library/jest-dom';
import { server } from './mocks/server';

// MSW 서버 생명주기
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// IntersectionObserver 모킹 (jsdom 미지원)
global.IntersectionObserver = class {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

// ResizeObserver 모킹
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// matchMedia 모킹 (styled-components 반응형)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// navigator.setAppBadge 모킹 (PWA badge API)
// 실제 setAppBadge는 Promise를 반환하므로 .catch() 호출이 가능해야 한다
Object.defineProperty(navigator, 'setAppBadge', {
  writable: true,
  value: jest.fn().mockResolvedValue(undefined),
});
Object.defineProperty(navigator, 'clearAppBadge', {
  writable: true,
  value: jest.fn(),
});

// SweetAlert2 모킹 (dialog.js 테스트 시 실제 팝업 방지)
jest.mock('sweetalert2', () => ({
  fire: jest.fn().mockResolvedValue({ isConfirmed: true }),
}));
