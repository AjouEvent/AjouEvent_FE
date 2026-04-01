import Swal from 'sweetalert2';

const dialog = {
  success(title, text) {
    return Swal.fire({
      icon: 'success',
      title,
      text,
      timer: 1500,
      showConfirmButton: false,
    });
  },

  error(title, text) {
    return Swal.fire({
      icon: 'error',
      title,
      text,
    });
  },

  async confirm(title, text) {
    const result = await Swal.fire({
      icon: 'question',
      title,
      text,
      showCancelButton: true,
      confirmButtonText: '확인',
      cancelButtonText: '취소',
    });
    return result.isConfirmed;
  },
};

export default dialog;
