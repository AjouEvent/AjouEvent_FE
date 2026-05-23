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
    <div className="w-full flex items-center justify-between px-6 py-4 gap-2">
      <div className="flex items-center gap-2">
        <img
          onClick={arrowBackClicked}
          loading="lazy"
          src={`${process.env.PUBLIC_URL}/icons/arrow_back.svg`}
          alt="뒤로가기"
          className="w-5 aspect-square object-contain cursor-pointer"
        />
        <div className="text-black text-lg font-bold">{Title}</div>
      </div>
      <div className="flex items-center">{RightComponent}</div>
    </div>
  );
};

export default TabBar;
