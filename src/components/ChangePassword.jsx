import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import useUIStore from '../store/useUIStore';
import { resetPassword } from '../services/api/user';

const passwordRegEx = /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%+\^&()\+=\-~`*]).{8,24}$/;

const ChangePasswordPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordValidityError, setPasswordValidityError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const { isAuthorized } = useUIStore((state) => ({ isAuthorized: state.isAuthorized }));

  useEffect(() => {
    if (!isAuthorized) {
      Swal.fire({ icon: 'warning', title: '이메일 인증을 먼저 진행해 주세요', text: '이메일 인증 창으로 이동합니다.' });
      navigate('/findPassword');
    }
  }, [isAuthorized, navigate]);

  const email = state?.email;

  const validateForm = (password, confirmPassword) => {
    const errors = {};
    if (!password) { errors.password = '* 비밀번호를 입력해주세요.'; }
    else if (!passwordRegEx.test(password)) {
      setPasswordValidityError('* 비밀번호는 영문, 숫자, 특수문자를 혼합하여 8~24자로 입력해야 합니다.');
    } else { setPasswordValidityError(''); }
    if (password !== confirmPassword) { setPasswordError('* 비밀번호가 일치하지 않습니다.'); }
    else { setPasswordError(''); }
    setIsFormValid(!!(password && confirmPassword && password === confirmPassword && passwordRegEx.test(password)));
    return errors;
  };

  const handlePasswordChange = (e) => { setNewPassword(e.target.value); validateForm(e.target.value, confirmPassword); };
  const handleConfirmPasswordChange = (e) => { setConfirmPassword(e.target.value); validateForm(newPassword, e.target.value); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthorized) {
      Swal.fire({ icon: 'warning', title: '이메일 인증을 먼저 진행해 주세요', text: '이메일 인증 창으로 이동합니다.' });
      navigate('/findPassword');
      return;
    }
    const errors = validateForm(newPassword, confirmPassword);
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    try {
      await resetPassword(email, newPassword);
      Swal.fire({ icon: 'success', title: '비밀번호 재설정 성공', text: '비밀번호가 성공적으로 변경되었습니다.' });
      navigate('/login');
    } catch (error) {
      Swal.fire({ icon: 'error', title: '비밀번호 재설정 실패', text: '비밀번호 재설정에 실패했습니다.' });
    }
  };

  const inputClass = 'w-full h-10 pl-2.5 text-sm border border-[#cdcdcd] rounded-[5px] outline-none';

  return (
    <div className="z-10 flex pt-[3%] flex-col items-center h-screen w-[80%]">
      <h2 className="pt-[5%] text-[1.5em] mb-4 text-center">비밀번호 재설정</h2>
      <p className="text-sm text-[#666] mb-5 text-center">
        아이디 <span className="text-[#1a73e8] font-bold">{email}</span>의 <br />새 비밀번호를 등록해주세요
      </p>
      <form onSubmit={handleSubmit} className="w-[105%] mx-2.5 flex flex-col justify-center items-center gap-2.5">
        <div className="flex flex-col gap-1.5 relative w-full">
          <div className="flex items-center justify-between w-full">
            <p className="m-0 text-sm font-semibold whitespace-nowrap">새 비밀번호</p>
            {(!newPassword && formErrors.password)
              ? <div className="text-red-500 pl-2.5 text-[0.8em] min-h-5">{formErrors.password}</div>
              : passwordValidityError && <div className="text-red-500 pl-2.5 text-[0.8em] min-h-5">{passwordValidityError}</div>
            }
          </div>
          <div className="flex items-center gap-1.5 relative">
            <input
              type={isPasswordVisible ? 'text' : 'password'}
              name="newPassword"
              placeholder="8~24자 / 영문, 숫자, 특수문자 혼합"
              autoComplete="off"
              onChange={handlePasswordChange}
              className={inputClass}
            />
            <span onClick={() => setIsPasswordVisible(!isPasswordVisible)} className="flex items-center justify-center mr-1.5 cursor-pointer">
              <FontAwesomeIcon icon={isPasswordVisible ? faEye : faEyeSlash} className="opacity-50" />
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 relative w-full">
          <div className="flex items-center justify-between w-full">
            <p className="m-0 text-sm font-semibold whitespace-nowrap">새 비밀번호 확인</p>
            {passwordError && <div className="text-red-500 pl-5 text-[0.8em]">{passwordError}</div>}
          </div>
          <div className="flex items-center gap-1.5 relative">
            <input
              type={isConfirmPasswordVisible ? 'text' : 'password'}
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className={inputClass}
            />
            <span onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} className="flex items-center justify-center mr-1.5 cursor-pointer">
              <FontAwesomeIcon icon={isConfirmPasswordVisible ? faEye : faEyeSlash} className="opacity-50" />
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full max-w-[680px] bg-[#0066b3] rounded-[10px] text-white font-bold border-none h-12 text-base outline-none text-center cursor-pointer mt-2 transition-opacity ${
            !isFormValid ? 'opacity-30 cursor-not-allowed' : 'hover:opacity-80'
          }`}
        >
          비밀번호 재설정
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
