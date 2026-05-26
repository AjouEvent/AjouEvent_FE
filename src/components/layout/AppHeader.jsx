import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Download } from 'lucide-react';
import useNotificationStore from '../../store/useNotificationStore';
import { LIMITS } from '../../constants/appConstants';

function AppHeader() {
  const navigate = useNavigate();
  const { unreadNotificationCount, fetchUnreadNotificationCount } =
    useNotificationStore();

  useEffect(() => {
    fetchUnreadNotificationCount();
  }, [fetchUnreadNotificationCount]);

  const handleInstallClick = () => {
    window.location.href = 'https://frill-cactus-d3c.notion.site/?pvs=74';
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-white/95 backdrop-blur-xl border-b border-[#F0F2F5] flex items-center justify-between px-4 h-14 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
      <span className="text-[#191F28] text-[17px] font-bold tracking-tight">
        AjouEvent
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={handleInstallClick}
          className="p-2 rounded-full hover:bg-[#F0F2F5] transition-colors text-[#6B7684]"
          aria-label="앱 설치"
        >
          <Download size={22} strokeWidth={1.8} />
        </button>
        <button
          onClick={() => navigate('/notification')}
          className="relative p-2 rounded-full hover:bg-[#F0F2F5] transition-colors text-[#6B7684]"
          aria-label="알림"
        >
          <Bell size={22} strokeWidth={1.8} />
          {unreadNotificationCount > 0 && (
            <span className="absolute top-1 right-1 bg-[#F04452] text-white text-[8px] font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-0.5 shadow-sm">
              {unreadNotificationCount < LIMITS.NOTIFICATION_BADGE_MAX
                ? unreadNotificationCount
                : '99+'}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

export default AppHeader;
