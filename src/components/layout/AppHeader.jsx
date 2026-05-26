import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Download } from 'lucide-react';
import useNotificationStore from '../../store/useNotificationStore';
import { LIMITS } from '../../constants/appConstants';

const AppHeader = () => {
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
    <header className="h-12 bg-white border-b border-[#F0F2F5] flex items-center justify-between px-4 flex-shrink-0 z-[100]">
      <span className="text-[#003876] text-xl font-bold tracking-tight">AjouEvent</span>
      <div className="flex items-center gap-1">
        <button
          onClick={handleDownloadClick}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-black/5 active:bg-black/10 transition-colors border-0 bg-transparent cursor-pointer text-[#6B7684]"
        >
          <Download size={20} />
        </button>
        <div className="relative">
          <button
            onClick={handleBellClick}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-black/5 active:bg-black/10 transition-colors border-0 bg-transparent cursor-pointer text-[#6B7684]"
          >
            <Bell size={20} />
          </button>
          {unreadNotificationCount > 0 && (
            <span className="absolute top-0.5 right-0.5 bg-[#F04452] text-white text-[8px] font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-0.5 shadow-sm pointer-events-none">
              {unreadNotificationCount < LIMITS.NOTIFICATION_BADGE_MAX
                ? unreadNotificationCount
                : '99+'}
            </span>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
