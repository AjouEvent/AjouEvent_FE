import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import GetUserPermission from '../services/fcm/GetUserPermission';
import Swal from 'sweetalert2';
import { STORAGE_KEYS } from '../constants/appConstants';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    GetUserPermission(setIsLoading);
  }, []);

  const handleGoogleButtonClicked = () => {
    const fcmToken = localStorage.getItem(STORAGE_KEYS.FCM_TOKEN);
    if (!fcmToken) {
      Swal.fire({ icon: 'error', title: '알림 토큰 미등록', text: "'홈화면에 추가'를 통해 설치 / 알림 설정(허용)을 확인해주세요" });
      return;
    }
    const redirect_uri_origin = window.location.origin;
    window.location.href = `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID}&redirect_uri=${redirect_uri_origin}/loginSuccess&response_type=code&prompt=consent&access_type=offline&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar&hd=ajou.ac.kr`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-white px-6 pt-16 pb-10">
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center text-white text-base font-medium z-[1000]">
          알림 서비스 등록 중 ...
        </div>
      )}

      <h1 className="text-[#191F28] text-3xl font-bold tracking-tight mb-2">회원가입</h1>
      <p className="text-[#6B7684] text-sm mb-10">구글 계정으로 간편하게 가입하세요.</p>

      <button
        onClick={handleGoogleButtonClicked}
        className="flex items-center justify-center w-full h-14 bg-white border border-[#E5E8EB] rounded-xl cursor-pointer shadow-sm hover:bg-[#F9FAFB] transition-colors gap-3"
      >
        <FcGoogle className="w-5 h-5 flex-shrink-0" />
        <span className="text-[#333D4B] text-sm font-semibold">Google 계정으로 가입</span>
      </button>

      <div className="flex items-center my-6">
        <div className="flex-1 h-px bg-[#E5E8EB]" />
      </div>

      <div className="flex justify-between items-center">
        <span className="text-[#6B7684] text-sm">이미 회원이신가요?</span>
        <Link to="/login" className="text-[#3182F6] no-underline text-sm font-bold">로그인</Link>
      </div>

      <p className="text-[#B0B8C1] text-xs text-center leading-relaxed mt-auto pt-10">
        AjouEvent는 2024-1학기 아주대학교 파란학기제에서<br />
        진행한 프로젝트로 아주대학교 공식 서비스가 아닙니다.<br />
        AjouEvent 계정은 아주대학교 포탈 계정과 무관합니다.<br />
        서비스 문의: jysim0326@ajou.ac.kr
      </p>
    </div>
  );
};

export default Login;
