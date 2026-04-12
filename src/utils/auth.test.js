import { clearAuth } from './auth';
import { STORAGE_KEYS } from '../constants/appConstants';

describe('clearAuth', () => {
  beforeEach(() => {
    // Arrange: 인증 관련 키를 localStorage에 세팅
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'test-token');
    localStorage.setItem(STORAGE_KEYS.EMAIL, 'test@ajou.ac.kr');
    localStorage.setItem(STORAGE_KEYS.USER_ID, '42');
    localStorage.setItem(STORAGE_KEYS.NAME, '홍길동');
    localStorage.setItem(STORAGE_KEYS.MAJOR, '소프트웨어학과');
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('localStorage에서 ACCESS_TOKEN을 제거한다', () => {
    // Act
    clearAuth();

    // Assert
    expect(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBeNull();
  });

  it('localStorage에서 EMAIL을 제거한다', () => {
    clearAuth();
    expect(localStorage.getItem(STORAGE_KEYS.EMAIL)).toBeNull();
  });

  it('localStorage에서 USER_ID(id)를 제거한다', () => {
    clearAuth();
    expect(localStorage.getItem(STORAGE_KEYS.USER_ID)).toBeNull();
  });

  it('localStorage에서 NAME을 제거한다', () => {
    clearAuth();
    expect(localStorage.getItem(STORAGE_KEYS.NAME)).toBeNull();
  });

  it('localStorage에서 MAJOR를 제거한다', () => {
    clearAuth();
    expect(localStorage.getItem(STORAGE_KEYS.MAJOR)).toBeNull();
  });

  it('clearAuth 호출 후 인증 관련 키가 모두 사라진다', () => {
    // Act
    clearAuth();

    // Assert
    const authKeys = [
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.EMAIL,
      STORAGE_KEYS.USER_ID,
      STORAGE_KEYS.NAME,
      STORAGE_KEYS.MAJOR,
    ];
    authKeys.forEach((key) => {
      expect(localStorage.getItem(key)).toBeNull();
    });
  });
});
