import useUIStore from './useUIStore';

const initialState = useUIStore.getState();

describe('useUIStore', () => {
  beforeEach(() => {
    useUIStore.setState(initialState);
  });

  describe('초기 상태', () => {
    it('savedKeyword가 빈 문자열이다', () => {
      expect(useUIStore.getState().savedKeyword).toBe('');
    });

    it('savedOption1이 빈 문자열이다', () => {
      expect(useUIStore.getState().savedOption1).toBe('');
    });

    it('savedOption2가 "아주대학교-일반"으로 초기화된다', () => {
      expect(useUIStore.getState().savedOption2).toBe('아주대학교-일반');
    });

    it('isAuthorized가 false이다', () => {
      expect(useUIStore.getState().isAuthorized).toBe(false);
    });
  });

  describe('setSavedKeyword', () => {
    it('savedKeyword를 업데이트한다', () => {
      // Act
      useUIStore.getState().setSavedKeyword('해커톤');

      // Assert
      expect(useUIStore.getState().savedKeyword).toBe('해커톤');
    });
  });

  describe('setSavedOption1', () => {
    it('savedOption1을 업데이트한다', () => {
      useUIStore.getState().setSavedOption1('소프트웨어');
      expect(useUIStore.getState().savedOption1).toBe('소프트웨어');
    });
  });

  describe('setSavedOption2', () => {
    it('savedOption2를 업데이트한다', () => {
      useUIStore.getState().setSavedOption2('아주대학교-대학원');
      expect(useUIStore.getState().savedOption2).toBe('아주대학교-대학원');
    });
  });

  describe('setIsAuthorized', () => {
    it('isAuthorized를 true로 설정한다', () => {
      useUIStore.getState().setIsAuthorized();
      expect(useUIStore.getState().isAuthorized).toBe(true);
    });
  });
});
