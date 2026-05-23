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
    <div className="z-10 block pt-32 w-[90%] h-screen bg-transparent m-0">
      <form className="w-full mx-2.5 flex flex-col justify-center items-center">
        <div className="flex w-[90%] max-w-[680px] items-start justify-start pl-4">
          <h1 className="text-black text-[32px] font-bold m-0 text-left">회원가입</h1>
        </div>
      </form>

      <button
        onClick={handleGoogleButtonClicked}
        className="flex items-center justify-center w-[90%] max-w-[680px] h-[50px] mx-auto mt-4 bg-white border border-black/10 rounded-[30px] cursor-pointer shadow-[0_2px_4px_rgba(0,0,0,0.1)] px-2 hover:bg-gray-50 transition-colors"
      >
        <FcGoogle className="w-[18px] h-[18px] mr-6" />
        <span className="text-center text-black/[0.54] text-sm font-medium">
          Google 계정으로 가입
        </span>
      </button>

      <div className="block mx-auto my-2.5 w-[90%] max-w-[680px] h-[10px] relative">
        <span className="absolute top-2 left-0 right-0 h-px bg-black/20" />
      </div>

      <div className="flex justify-between items-center mx-auto my-5 mt-5 text-sm text-[#6f6f6f] w-[90%] max-w-[680px]">
        <span className="text-black">이미 회원이신가요?</span>
        <Link to="/login" className="text-[#0066b3] no-underline font-bold">로그인</Link>
      </div>

      <p className="text-[#999] my-10 text-sm w-full text-center leading-[1.8]">
        * AjouEvent는 2024-1학기 아주대학교 파란학기제에서<br />
        진행한 프로젝트로 아주대학교 공식 서비스가 아닙니다. <br />
        * AjouEvent 계정은 아주대학교 포탈 계정과 무관합니다. <br />
        서비스 문의: jysim0326@ajou.ac.kr <br />
      </p>

      <div className="flex justify-center items-center mb-5">
        <div
          className="w-[100px] h-[100px] bg-no-repeat bg-center bg-contain"
          style={{ backgroundImage: "url('../image/AjouUniversity-logo.png')" }}
        />
      </div>
    </div>
  );
};

export default Login;
