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
      <h2 className="font-bold mb-5">회원정보 수정</h2>
      <div className="block my-2.5 w-[95%] max-w-[680px] h-[10px] relative">
        <span className="absolute top-2 left-0 right-0 h-px bg-black/20" />
      </div>
      <h1 className="text-2xl font-bold text-left w-full mb-5">로그인 정보</h1>
      <div className="flex flex-col mb-2.5 w-full">
        <p className="m-0 text-sm font-semibold mb-1">아이디 (이메일)</p>
        <input
          type="text"
          value={email}
          readOnly
          className="px-2.5 py-2.5 border border-[#cdcdcd] rounded text-base outline-none bg-gray-50"
        />
      </div>
      <span
        onClick={handleDeleteAccount}
        className="text-[#0066b3] underline cursor-pointer mt-5 hover:text-gray-600 transition-colors"
      >
        회원 탈퇴하기
      </span>
    </div>
  );
};

export default ProfileModification;
