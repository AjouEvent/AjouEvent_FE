import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Download } from 'lucide-react';
import useNotificationStore from '../../store/useNotificationStore';
import { LIMITS } from '../../constants/appConstants';

const HelpBox = () => {
  const navigate = useNavigate();
  const { unreadNotificationCount, fetchUnreadNotificationCount } = useNotificationStore();

  useEffect(() => {
    fetchUnreadNotificationCount();
  }, [fetchUnreadNotificationCount]);

  const handleBellClick = () => navigate('/notification');

  const handleDownloadClick = () => {
    window.location.href = 'https://frill-cactus-d3c.notion.site/?pvs=74';
  };

  return (
    <div className="fixed top-2 right-3 z-[200] flex items-center gap-2">
      <div className="relative">
        <button
          onClick={handleBellClick}
          title="알림"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#3182F6] hover:bg-[#2070E8] active:bg-[#1560D4] transition-colors text-white shadow-md"
        >
          <Bell size={18} />
        </button>
        {unreadNotificationCount > 0 && (
          <span className="absolute top-0.5 right-0.5 bg-[#F04452] text-white text-[8px] font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-0.5 pointer-events-none leading-none">
            {unreadNotificationCount < LIMITS.NOTIFICATION_BADGE_MAX
              ? unreadNotificationCount
              : '99+'}
          </span>
        )}
      </div>
      <button
        onClick={handleDownloadClick}
        title="앱 다운로드"
        className="w-10 h-10 flex items-center justify-center rounded-full bg-[#3182F6] hover:bg-[#2070E8] active:bg-[#1560D4] transition-colors text-white shadow-md"
      >
        <Download size={18} />
      </button>
    </div>
  );
};

export default HelpBox;
