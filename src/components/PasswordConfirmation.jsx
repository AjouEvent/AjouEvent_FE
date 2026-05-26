import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
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
      setPasswordError('비밀번호 형식을 확인해주세요.');
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
    <div className="flex flex-col min-h-screen bg-white px-5 pt-4">
      <div className="flex items-center gap-3 py-4 mb-2">
        <button
          onClick={arrowBackClicked}
          className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[#F2F4F6] transition-colors"
        >
          <img
            loading="lazy"
            src={`${process.env.PUBLIC_URL}/icons/arrow_back.svg`}
            alt="뒤로가기"
            className="w-5 aspect-square object-contain"
          />
        </button>
        <span className="text-[#191F28] text-lg font-bold tracking-tight">마이페이지</span>
      </div>

      <h2 className="text-[#191F28] text-xl font-bold tracking-tight mb-8">비밀번호 재확인</h2>

      <form onSubmit={handleSignIn} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[#6B7684] text-xs font-semibold">이메일</label>
          <input
            type="text"
            placeholder="example@ajou.ac.kr"
            value={email}
            readOnly
            className="w-full h-12 px-4 bg-[#F2F4F6] rounded-xl text-sm text-[#B0B8C1] outline-none border-0 cursor-default"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[#6B7684] text-xs font-semibold">비밀번호</label>
            {passwordError && (
              <span className="text-[#F04452] text-xs">{passwordError}</span>
            )}
          </div>
          <div className="relative flex items-center">
            <input
              type={isPasswordVisible ? 'text' : 'password'}
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 pl-4 pr-12 bg-[#F2F4F6] rounded-xl text-sm text-[#191F28] outline-none border-0 focus:ring-2 focus:ring-[#3182F6] transition-all"
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute right-4 bg-transparent border-none cursor-pointer p-0"
            >
              <FontAwesomeIcon
                icon={isPasswordVisible ? faEye : faEyeSlash}
                className="text-[#B0B8C1]"
              />
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full h-14 bg-[#3182F6] hover:bg-[#1B6EE8] text-white rounded-xl font-bold text-base border-none cursor-pointer mt-4 transition-colors"
        >
          다음
        </button>
      </form>
    </div>
  );
};

export default PasswordConfirmation;
