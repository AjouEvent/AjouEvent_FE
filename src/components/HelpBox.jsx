import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useNotificationStore from '../store/useNotificationStore';
import { LIMITS } from '../constants/appConstants';

const HelpBox = () => {
  const navigate = useNavigate();
  const { unreadNotificationCount, fetchUnreadNotificationCount } = useNotificationStore();

  useEffect(() => {
    fetchUnreadNotificationCount();
  }, [fetchUnreadNotificationCount]);

  const handleBellClick = () => {
    navigate('/notification');
  };

  const handleInstallClicked = () => {
    window.location.href = 'https://frill-cactus-d3c.notion.site/?pvs=74';
  };

  const handleTeamInfoClicked = () => {
    window.location.href =
      'https://frill-cactus-d3c.notion.site/ajouevent-com-1078a120218e80f78847e9b9b8cd330a?pvs=74';
  };

  return (
    <div className="fixed right-0 top-0 z-[100] flex items-center gap-1.5 p-2.5">
      <div className="relative inline-block cursor-pointer" onClick={handleBellClick}>
        <img
          loading="lazy"
          src={`${process.env.PUBLIC_URL}/icons/notiOn.svg`}
          alt="bellIcon"
          className="w-10 aspect-square object-cover opacity-75 cursor-pointer"
        />
        {unreadNotificationCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-[8px] font-bold rounded-full w-[15px] h-[15px] flex items-center justify-center">
            {unreadNotificationCount < LIMITS.NOTIFICATION_BADGE_MAX
              ? unreadNotificationCount
              : '99+'}
          </span>
        )}
      </div>

      <img
        onClick={handleInstallClicked}
        loading="lazy"
        src={`${process.env.PUBLIC_URL}/icons/InstallAppOn.svg`}
        alt="installIcon"
        className="w-10 aspect-square object-cover opacity-75 cursor-pointer"
      />

      <span
        onClick={handleTeamInfoClicked}
        className="flex cursor-pointer bg-[#4784be] text-white font-semibold h-10 items-center text-center px-4 rounded-full"
      >
        팀소개
      </span>
    </div>
  );
};

export default HelpBox;
