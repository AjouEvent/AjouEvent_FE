import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { clearAuth } from '../utils/auth';
import dialog from '../utils/dialog';
import { STORAGE_KEYS } from '../constants/appConstants';

export default function TopBar() {
  const handleAlarmClick = () => {};
  const [isSignIn, setIsSignIn] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem(STORAGE_KEYS.USER_ID);
    setIsSignIn(!!id);
  }, []);

  const handleLogoutBtnClick = () => {
    dialog.success('로그아웃 성공', '로그아웃 했습니다.');
    setIsSignIn(false);
    clearAuth();
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[5] flex items-center w-full h-14 px-4 bg-white border-b border-[#E5E8EB]">
      <Link
        to="/"
        className="flex flex-1 items-center no-underline"
      >
        <span className="font-bold text-[1rem] text-[#3182F6] tracking-tight">
          아주대 공지사항 알림
        </span>
      </Link>
      <div className="flex items-center gap-2">
        <button
          onClick={handleAlarmClick}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#F2F4F6] transition-colors"
        >
          <img
            alt="알람"
            src={`${process.env.PUBLIC_URL}/icons/mdi_bell.svg`}
            className="w-5 h-5 opacity-60"
          />
        </button>
        {isSignIn ? (
          <Link
            onClick={handleLogoutBtnClick}
            to="/login"
            className="flex items-center justify-center bg-[#F2F4F6] hover:bg-[#E5E8EB] rounded-xl px-3 h-8 text-[#6B7684] text-xs font-semibold no-underline transition-colors"
          >
            로그아웃
          </Link>
        ) : (
          <Link
            to="/login"
            className="flex items-center justify-center bg-[#3182F6] hover:bg-[#1B6EE8] rounded-xl px-3 h-8 text-white text-xs font-semibold no-underline transition-colors"
          >
            로그인
          </Link>
        )}
      </div>
    </div>
  );
}
