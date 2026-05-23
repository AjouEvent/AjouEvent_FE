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
    <div className="fixed top-0 left-0 right-0 z-[5] flex flex-wrap items-center w-full h-12 px-0 py-4 bg-[#0066b3]">
      <Link
        to="/"
        className="flex justify-start items-center w-1/2 h-full no-underline bg-[#0066b3]"
      >
        <span className="font-bold text-[0.9rem] text-white ml-4 leading-6 w-48">
          아주대 공지사항 알림
        </span>
      </Link>
      <div className="flex justify-end items-center w-1/2 h-full bg-[#0066b3]">
        <img
          alt="알람"
          src={`${process.env.PUBLIC_URL}/icons/mdi_bell.svg`}
          onClick={handleAlarmClick}
          className="w-[4vw] h-[4vh]"
        />
        {isSignIn ? (
          <Link
            onClick={handleLogoutBtnClick}
            to="/login"
            className="flex flex-wrap items-center justify-center bg-white rounded-lg border-0 w-20 h-[1.4rem] text-black text-[0.8rem] no-underline mx-4"
          >
            로그아웃
          </Link>
        ) : (
          <Link
            to="/login"
            className="flex flex-wrap items-center justify-center bg-white rounded-lg border-0 w-20 h-[1.4rem] text-black text-[0.8rem] no-underline mx-4"
          >
            로그인
          </Link>
        )}
      </div>
    </div>
  );
}
