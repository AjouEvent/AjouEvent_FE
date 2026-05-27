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
    <div className="fixed top-2 right-3 z-[200] flex items-center bg-white rounded-2xl shadow-md border border-[#E5E8EB] overflow-hidden">
      <button
        onClick={handleDownloadClick}
        title="앱 다운로드"
        className="w-10 h-10 flex items-center justify-center hover:bg-[#F2F4F6] active:bg-[#E5E8EB] transition-colors text-[#6B7684] hover:text-[#333D4B]"
      >
        <Download size={18} />
      </button>
      <div className="w-px h-5 bg-[#E5E8EB]" />
      <div className="relative">
        <button
          onClick={handleBellClick}
          title="알림"
          className="w-10 h-10 flex items-center justify-center hover:bg-[#F2F4F6] active:bg-[#E5E8EB] transition-colors text-[#6B7684] hover:text-[#333D4B]"
        >
          <Bell size={18} />
        </button>
        {unreadNotificationCount > 0 && (
          <span className="absolute top-1.5 right-1.5 bg-[#F04452] text-white text-[8px] font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-0.5 pointer-events-none leading-none">
            {unreadNotificationCount < LIMITS.NOTIFICATION_BADGE_MAX
              ? unreadNotificationCount
              : '99+'}
          </span>
        )}
      </div>
    </div>
  );
};

export default HelpBox;
