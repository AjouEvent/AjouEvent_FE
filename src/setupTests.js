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

// ResizeObserver 모킹 (일부 UI 라이브러리 필요)
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
Object.defineProperty(navigator, 'setAppBadge', {
  writable: true,
  value: jest.fn(),
});
Object.defineProperty(navigator, 'clearAppBadge', {
  writable: true,
  value: jest.fn(),
});

// SweetAlert2 모킹 (dialog.js 사용시 DOM 팝업 방지)
jest.mock('sweetalert2', () => ({
  fire: jest.fn().mockResolvedValue({ isConfirmed: true }),
}));
