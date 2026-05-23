import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { login } from '../services/api/user';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { STORAGE_KEYS } from '../constants/appConstants';

const passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%+\^&()\+=\-~`*]).{8,24}$/;

const PasswordConfirmation = ({ onConfirm }) => {
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email;

  useEffect(() => {
    if (password.length > 0 && !passwordRegEx.test(password)) {
      setPasswordError('* 비밀번호 형식을 확인해주세요.');
    } else {
      setPasswordError('');
    }
  }, [password]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    const fcmToken = localStorage.getItem(STORAGE_KEYS.FCM_TOKEN);
    if (!fcmToken) {
      Swal.fire({ icon: 'error', title: '알림허용안됨', text: '홈화면의 알림아이콘을 터치해주세요' });
      return;
    }
    const userData = { email, password, fcmToken };
    try {
      const response = await login(userData);
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
      localStorage.setItem(STORAGE_KEYS.USER_ID, response.data.id);
      localStorage.setItem(STORAGE_KEYS.NAME, response.data.name);
      localStorage.setItem(STORAGE_KEYS.MAJOR, response.data.major);
      navigate('/profile-modification', { state: { user: response.data } });
    } catch (error) {
      if (error.response) {
        Swal.fire({ icon: 'error', title: '로그인 실패', text: '비밀번호를 다시 확인해주세요' });
      } else if (error.request) {
        Swal.fire({ icon: 'warning', title: '응답없음', text: error.request });
        navigate('/login');
      } else {
        Swal.fire({ icon: 'warning', title: '요청 설정 에러', text: error.message });
        navigate('/login');
      }
    }
  };

  const arrowBackClicked = () => navigate('/mypage');

  return (
    <div className="flex flex-col items-center p-5 w-full">
      <div className="w-full flex items-center py-4 gap-2">
        <img
          onClick={arrowBackClicked}
          loading="lazy"
          src={`${process.env.PUBLIC_URL}/icons/arrow_back.svg`}
          alt="뒤로가기"
          className="w-5 aspect-square object-contain cursor-pointer"
        />
        <div className="text-black text-lg font-bold">마이페이지</div>
      </div>
      <h2 className="font-bold mb-5">비밀번호 재확인</h2>
      <div className="flex flex-col mb-2.5 w-full">
        <p className="m-0 text-sm font-semibold mb-0.5">이메일</p>
        <input
          type="text"
          placeholder="example@ajou.ac.kr"
          value={email}
          readOnly
          className="px-2.5 py-2.5 border border-[#cdcdcd] rounded text-base outline-none bg-gray-50"
        />
      </div>
      <div className="flex flex-col mb-2.5 w-full">
        <div className="flex items-center justify-between w-full mb-0.5">
          <p className="m-0 text-sm font-semibold">비밀번호</p>
          {passwordError && <div className="text-red-500 pl-5 text-[0.8em]">{passwordError}</div>}
        </div>
        <div className="relative flex items-center">
          <input
            type={isPasswordVisible ? 'text' : 'password'}
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-2.5 py-2.5 border border-[#cdcdcd] rounded text-base outline-none"
          />
          <span
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            className="absolute right-2.5 cursor-pointer"
          >
            <FontAwesomeIcon icon={isPasswordVisible ? faEye : faEyeSlash} className="opacity-50" />
          </span>
        </div>
      </div>
      <button
        onClick={handleSignIn}
        className="px-5 py-2.5 bg-[#0066b3] text-white border-none rounded cursor-pointer mt-5 hover:bg-[#004f8a] transition-colors"
      >
        다음
      </button>
    </div>
  );
};

export default PasswordConfirmation;
