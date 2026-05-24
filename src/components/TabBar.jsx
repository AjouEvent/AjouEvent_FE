import React from 'react';
import { useNavigate } from 'react-router-dom';

const TabBar = ({ Title, RightComponent }) => {
  const navigate = useNavigate();

  const arrowBackClicked = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate('/event');
    }
  };

  return (
    <div className="w-full flex items-center justify-between px-4 py-3.5 bg-white border-b border-[#F0F2F5]">
      <div className="flex items-center gap-2">
        <button
          onClick={arrowBackClicked}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#F2F4F6] active:bg-[#E5E8EB] transition-colors"
        >
          <img
            loading="lazy"
            src={`${process.env.PUBLIC_URL}/icons/arrow_back.svg`}
            alt="뒤로가기"
            className="w-5 h-5 object-contain opacity-70"
          />
        </button>
        <span className="text-[#191F28] text-[17px] font-bold tracking-tight">{Title}</span>
      </div>
      <div className="flex items-center">{RightComponent}</div>
    </div>
  );
};

export default TabBar;
