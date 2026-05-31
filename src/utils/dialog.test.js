import dialog from './dialog';

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
  },
}));

jest.mock('../store/useConfirmStore', () => ({
  __esModule: true,
  default: {
    getState: jest.fn(() => ({
      show: jest.fn().mockResolvedValue(true),
    })),
  },
}));

const { toast } = require('sonner');
const useConfirmStore = require('../store/useConfirmStore').default;

describe('dialog', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('success', () => {
    it('toast.success를 title과 description으로 호출한다', () => {
      dialog.success('성공 제목', '성공 내용');

      expect(toast.success).toHaveBeenCalledWith('성공 제목', { description: '성공 내용' });
    });

    it('text 없이 호출해도 동작한다', () => {
      dialog.success('성공');

      expect(toast.success).toHaveBeenCalledWith('성공', { description: undefined });
    });
  });

  describe('error', () => {
    it('toast.error를 title과 description으로 호출한다', () => {
      dialog.error('오류 제목', '오류 내용');

      expect(toast.error).toHaveBeenCalledWith('오류 제목', { description: '오류 내용' });
    });
  });

  describe('warning', () => {
    it('toast.warning를 title과 description으로 호출한다', () => {
      dialog.warning('경고 제목', '경고 내용');

      expect(toast.warning).toHaveBeenCalledWith('경고 제목', { description: '경고 내용' });
    });
  });

  describe('confirm', () => {
    it('useConfirmStore.getState().show를 title과 text로 호출한다', async () => {
      const mockShow = jest.fn().mockResolvedValue(true);
      useConfirmStore.getState.mockReturnValue({ show: mockShow });

      await dialog.confirm('확인', '정말 삭제하시겠습니까?');

      expect(mockShow).toHaveBeenCalledWith('확인', '정말 삭제하시겠습니까?');
    });

    it('show가 true를 resolve하면 true를 반환한다', async () => {
      useConfirmStore.getState.mockReturnValue({
        show: jest.fn().mockResolvedValue(true),
      });

      const result = await dialog.confirm('확인', '내용');

      expect(result).toBe(true);
    });

    it('show가 false를 resolve하면 false를 반환한다', async () => {
      useConfirmStore.getState.mockReturnValue({
        show: jest.fn().mockResolvedValue(false),
      });

      const result = await dialog.confirm('확인', '내용');

      expect(result).toBe(false);
    });
  });
});
