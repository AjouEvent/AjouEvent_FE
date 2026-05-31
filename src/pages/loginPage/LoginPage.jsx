import React, { useState, useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import GetUserPermission from '../../services/fcm/GetUserPermission';
import Swal from 'sweetalert2';
import { STORAGE_KEYS } from '../../constants/appConstants';
import NavigationBar from '../../components/layout/NavigationBar';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    GetUserPermission(setIsLoading);
  }, []);

  const handleGoogleButtonClicked = () => {
    const fcmToken = localStorage.getItem(STORAGE_KEYS.FCM_TOKEN);
    if (!fcmToken) {
      Swal.fire({
        icon: 'error',
        title: '알림 토큰 미등록',
        text: "'홈화면에 추가'를 통해 설치 / 알림 설정(허용)을 확인해주세요",
      });
      return;
    }
    const redirectUri = `${window.location.origin}/loginSuccess`;
    const scope = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/calendar',
    ].join(' ');
    window.location.href =
      `https://accounts.google.com/o/oauth2/auth` +
      `?client_id=${process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID}` +
      `&redirect_uri=${redirectUri}` +
      `&response_type=code` +
      `&prompt=consent` +
      `&access_type=offline` +
      `&scope=${scope}` +
      `&hd=ajou.ac.kr`;
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white w-full h-full">
      <div className="bg-white flex flex-col h-screen w-full items-center justify-center">
        {isLoading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center text-white text-base font-medium z-[1000]">
            알림 서비스 등록 중 ...
          </div>
        )}

        <div className="flex-1 w-3/4 max-w-[600px] flex flex-col items-center justify-center gap-3">
          <h1 className="text-[#191F28] text-3xl font-bold tracking-tight mb-2 w-full">로그인</h1>
          <p className="text-[#6B7684] text-sm leading-relaxed w-full mb-6">
            기본 로그인이{' '}
            <span className="text-[#3182F6] font-semibold">구글 로그인</span>으로 통합되었습니다.
          </p>

          <button
            onClick={handleGoogleButtonClicked}
            className="flex items-center justify-center w-full h-14 bg-white border border-[#E5E8EB] rounded-xl cursor-pointer shadow-sm hover:bg-[#F9FAFB] transition-colors gap-3"
          >
            <FcGoogle className="w-5 h-5 flex-shrink-0" />
            <span className="text-[#333D4B] text-sm font-semibold">Google 계정으로 로그인</span>
          </button>

          <div className="flex items-center my-6 w-full">
            <div className="flex-1 h-px bg-[#E5E8EB]" />
          </div>

          <p className="text-[#B0B8C1] text-xs text-center leading-relaxed">
            AjouEvent는 2024-1학기 아주대학교 파란학기제에서<br />
            진행한 프로젝트로 아주대학교 공식 서비스가 아닙니다.
          </p>
          <p className="text-[#B0B8C1] text-xs text-center">
            AjouEvent 계정은 아주대학교 포탈 계정과 무관합니다.
          </p>

          <p className="text-[#B0B8C1] text-xs font-semibold">서비스 문의</p>
          <div className="flex gap-4">
            <a
              href="mailto:jysim0326@ajou.ac.kr?subject=ajouevent 서비스 문의"
              className="text-[#B0B8C1] text-xs no-underline hover:text-[#6B7684] transition-colors"
            >
              BE: 심재엽
            </a>
            <a
              href="mailto:ysc0731@ajou.ac.kr?subject=ajouevent 서비스 문의"
              className="text-[#B0B8C1] text-xs no-underline hover:text-[#6B7684] transition-colors"
            >
              FE: 윤석찬
            </a>
          </div>
        </div>
      </div>
      <NavigationBar />
    </div>
  );
}
