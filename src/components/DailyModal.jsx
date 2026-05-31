import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { STORAGE_KEYS } from '../constants/appConstants';

const DailyModal = ({ show, onClose }) => {
  const [doNotShowToday, setDoNotShowToday] = useState(false);

  const handleDoNotShowTodayChange = (e) => setDoNotShowToday(e.target.checked);

  const handleClose = () => {
    if (doNotShowToday) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      localStorage.setItem(STORAGE_KEYS.MODAL_DISMISSED_UNTIL, tomorrow.toISOString());
    }
    onClose();
  };

  return (
    <div className="fixed z-[1000] left-0 top-0 w-full h-full flex justify-center items-center bg-black/50">
      <div className="flex flex-col items-center bg-white p-5 border border-[#888] w-[80%] max-w-[500px] rounded-[20px]">
        <div className="flex flex-col items-center text-center mt-2.5 gap-5">
          <img src={`${process.env.PUBLIC_URL}/logo196.png`} alt="Modal" className="w-1/2" />
          <p className="m-0">
            홈화면에 앱 추가하고 <br />
            공지사항, 이벤트 알림을 받아보세요.
          </p>
        </div>
        <Link
          to="/guide"
          className="inline-block px-5 py-2.5 bg-[#0066b3] text-white no-underline rounded-[50px] font-bold text-center mt-4 hover:bg-[#004f8a] transition-colors"
        >
          설치없이 앱으로 열기
        </Link>
        <div className="w-full mt-5 flex justify-between items-center">
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={doNotShowToday}
              onChange={handleDoNotShowTodayChange}
              className="mr-1"
            />
            오늘은 보지 않기
          </label>
          <button
            onClick={handleClose}
            className="w-[100px] bg-transparent border border-black/[0.04] text-xl px-5 py-1 rounded-[10px] cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyModal;
