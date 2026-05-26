import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ProfileModification = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const user = state?.user;
  const email = user?.email;

  const arrowBackClicked = () => navigate('/mypage');
  const handleDeleteAccount = () => navigate('/delete-account');

  return (
    <div className="flex w-full flex-col min-h-screen bg-white px-5 pt-4">
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
        <span className="text-[#191F28] text-lg font-bold tracking-tight">
          회원정보 수정
        </span>
      </div>

      <h3 className="text-[#191F28] text-lg font-bold tracking-tight mb-5">
        로그인 정보
      </h3>

      <div className="flex flex-col gap-1.5 mb-6">
        <label className="text-[#6B7684] text-xs font-semibold">
          아이디 (이메일)
        </label>
        <input
          type="text"
          value={email}
          readOnly
          className="w-full h-12 px-4 bg-[#F2F4F6] rounded-xl text-sm text-[#B0B8C1] outline-none border-0 cursor-default"
        />
      </div>

      <button
        onClick={handleDeleteAccount}
        className="text-[#F04452] text-sm font-medium bg-transparent border-none cursor-pointer text-left hover:text-[#D93746] transition-colors p-0"
      >
        회원 탈퇴하기
      </button>
    </div>
  );
};

export default ProfileModification;
