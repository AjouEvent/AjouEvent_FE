import dialog from './dialog';

// sweetalert2는 default export(클래스)이므로 __esModule + default 형태로 모킹
jest.mock('sweetalert2', () => ({
  __esModule: true,
  default: {
    fire: jest.fn(),
  },
}));

// 모킹된 Swal.fire에 접근하기 위해 require 사용 (호이스팅 이후 접근)
const Swal = require('sweetalert2').default;

describe('dialog', () => {
  beforeEach(() => {
    // 각 테스트 전 기본 resolved value 재설정 (확인 클릭)
    Swal.fire.mockResolvedValue({ isConfirmed: true });
  });

  afterEach(() => {
    Swal.fire.mockReset();
  });

  describe('success', () => {
    it('Swal.fire를 icon: success로 호출한다', () => {
      // Act
      dialog.success('성공', '저장되었습니다');

      // Assert
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ icon: 'success' }),
      );
    });

    it('1500ms 자동 닫힘(timer: 1500)과 확인 버튼 숨김 설정이 포함된다', () => {
      dialog.success('성공', '저장되었습니다');

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ timer: 1500, showConfirmButton: false }),
      );
    });

    it('title과 text를 전달한다', () => {
      dialog.success('성공 제목', '성공 내용');

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ title: '성공 제목', text: '성공 내용' }),
      );
    });
  });

  describe('error', () => {
    it('Swal.fire를 icon: error로 호출한다', () => {
      dialog.error('오류', '다시 시도해주세요');

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ icon: 'error' }),
      );
    });

    it('title과 text를 전달한다', () => {
      dialog.error('오류 제목', '오류 내용');

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ title: '오류 제목', text: '오류 내용' }),
      );
    });
  });

  describe('confirm', () => {
    it('Swal.fire를 icon: question으로 호출한다', async () => {
      await dialog.confirm('확인', '정말 삭제하시겠습니까?');

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ icon: 'question' }),
      );
    });

    it('취소/확인 버튼 텍스트가 한글로 설정된다', async () => {
      await dialog.confirm('확인', '내용');

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          confirmButtonText: '확인',
          cancelButtonText: '취소',
          showCancelButton: true,
        }),
      );
    });

    it('isConfirmed가 true이면 true를 반환한다', async () => {
      // Arrange: beforeEach에서 { isConfirmed: true }로 설정됨

      // Act
      const result = await dialog.confirm('확인', '내용');

      // Assert
      expect(result).toBe(true);
    });

    it('isConfirmed가 false이면 false를 반환한다', async () => {
      // Arrange: 취소 응답으로 오버라이드
      Swal.fire.mockResolvedValueOnce({ isConfirmed: false });

      // Act
      const result = await dialog.confirm('확인', '내용');

      // Assert
      expect(result).toBe(false);
    });
  });
});
