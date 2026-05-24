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
    <div className="fixed right-0 top-0 z-[100] flex items-center gap-1 p-3">
      <div className="flex items-center gap-0.5 bg-white/85 backdrop-blur-md rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.10)] px-1.5 py-1.5 border border-white/60">
        <div className="relative cursor-pointer" onClick={handleBellClick}>
          <div className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-black/5 active:bg-black/10 transition-colors">
            <img
              loading="lazy"
              src={`${process.env.PUBLIC_URL}/icons/notiOn.svg`}
              alt="bellIcon"
              className="w-[18px] h-[18px] object-cover"
            />
          </div>
          {unreadNotificationCount > 0 && (
            <span className="absolute top-0 right-0 bg-[#F04452] text-white text-[8px] font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-0.5 shadow-sm">
              {unreadNotificationCount < LIMITS.NOTIFICATION_BADGE_MAX
                ? unreadNotificationCount
                : '99+'}
            </span>
          )}
        </div>

        <div
          onClick={handleInstallClicked}
          className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-black/5 active:bg-black/10 transition-colors cursor-pointer"
        >
          <img
            loading="lazy"
            src={`${process.env.PUBLIC_URL}/icons/InstallAppOn.svg`}
            alt="installIcon"
            className="w-[18px] h-[18px] object-cover"
          />
        </div>

        <div className="w-px h-4 bg-black/10 mx-0.5" />

        <button
          onClick={handleTeamInfoClicked}
          className="flex cursor-pointer bg-[#003876] hover:bg-[#002557] active:bg-[#001a3d] text-white font-bold h-8 items-center text-center px-3 rounded-xl text-[11px] tracking-tight transition-colors border-0"
        >
          팀소개
        </button>
      </div>
    </div>
  );
};

export default HelpBox;
