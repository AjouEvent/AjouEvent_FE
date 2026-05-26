import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TabBar from '../../components/layout/TabBar';
import NotificationList from './NotificationList';
import { getUserKeywords } from '../../services/api/subscription';
import { readAllNotifications } from '../../services/api/notification';
import dialog from '../../utils/dialog';

const NotificationPage = () => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('topic');
  const [keywordCount, setKeywordCount] = useState(0);
  const [notifications, setNotifications] = useState(0);

  useEffect(() => {
    const fetchUserKeywords = async () => {
      try {
        const response = await getUserKeywords();
        setKeywordCount(response.data.length);
      } catch (error) {
        console.error('Error fetching user keywords:', error);
      }
    };
    fetchUserKeywords();
  }, []);

  const handleReadAllNotifications = async () => {
    const confirmed = await dialog.confirm('알림 읽음 처리', '정말 모든 알림을 읽음 처리할까요?');
    if (!confirmed) return;
    try {
      await readAllNotifications();
      dialog.success('읽음 처리 완료', '모든 알림을 읽음 처리했습니다.');
      setNotifications((prev) => prev + 1);
    } catch (error) {
      console.error('Error reading all notifications:', error);
      dialog.error('오류', '알림 읽음 처리 중 오류가 발생했습니다.');
    }
  };

  const handleTabChange = (tab) => setCurrentTab(tab);

  const KeywordSettingButtonClick = () => navigate('/subscribe/keywordSubscribe');

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-screen bg-surface">
      <TabBar
        Title="알림"
        RightComponent={
          <button
            onClick={handleReadAllNotifications}
            className="border border-[#D5E2F2] text-[#003876] bg-[#EEF3FA] hover:bg-[#D5E2F2] active:bg-[#C0D5EC] px-3.5 py-1.5 text-xs font-bold rounded-xl cursor-pointer transition-colors border-0"
          >
            모두 읽음
          </button>
        }
      />

      <div className="flex w-full bg-white px-4 py-2.5 border-b border-[#F0F2F5]">
        <div className="flex w-full bg-[#F2F4F6] rounded-xl p-1 gap-1">
          {['topic', 'keyword'].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`flex-1 py-2 text-center text-sm border-none cursor-pointer transition-all rounded-lg font-semibold ${
                currentTab === tab
                  ? 'bg-white text-[#191F28] shadow-sm'
                  : 'bg-transparent text-[#B0B8C1] hover:text-[#6B7684]'
              }`}
            >
              {tab === 'topic' ? '구독 알림' : '키워드 알림'}
            </button>
          ))}
        </div>
      </div>

      {currentTab === 'keyword' && (
        <div className="flex w-full px-5 py-3.5 bg-[#F8FAFD] justify-between items-center border-b border-[#E8EDF5]">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#3182F6]" />
            <span className="text-[#333D4B] text-sm font-semibold">
              등록된 키워드 <span className="text-[#3182F6] font-bold">{keywordCount}개</span>
            </span>
          </div>
          <button
            onClick={KeywordSettingButtonClick}
            className="bg-[#003876] hover:bg-[#002557] active:bg-[#001a3d] text-white px-3.5 py-1.5 text-xs font-bold rounded-xl cursor-pointer border-none transition-colors"
          >
            키워드 설정
          </button>
        </div>
      )}

      {currentTab === 'topic' ? (
        <NotificationList
          key={`topic-${notifications}`}
          apiUrl={`${process.env.REACT_APP_BE_URL}/api/notification/topic`}
        />
      ) : (
        <NotificationList
          key={`keyword-${notifications}`}
          apiUrl={`${process.env.REACT_APP_BE_URL}/api/notification/keyword`}
        />
      )}
    </div>
  );
};

export default NotificationPage;
