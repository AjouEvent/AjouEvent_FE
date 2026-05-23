import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TabBar from '../../components/TabBar';
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
    <div className="flex flex-col items-center justify-start w-full min-h-screen">
      <TabBar
        Title="알림"
        RightComponent={
          <button
            onClick={handleReadAllNotifications}
            className="bg-[#0066b3] text-white px-3.5 py-1 text-base rounded-[10px] cursor-pointer font-medium hover:bg-[#004f8a] transition-colors"
          >
            모두 읽음
          </button>
        }
      />
      <div className="flex w-full border-b border-black/[0.08]">
        <button
          onClick={() => handleTabChange('topic')}
          className={`flex-1 py-4 text-center text-lg font-semibold border-none bg-transparent cursor-pointer transition-colors duration-300 ${
            currentTab === 'topic'
              ? 'text-black border-b-2 border-black'
              : 'text-gray-400 border-b border-gray-400'
          }`}
        >
          구독
        </button>
        <button
          onClick={() => handleTabChange('keyword')}
          className={`flex-1 py-4 text-center text-lg font-semibold border-none bg-transparent cursor-pointer transition-colors duration-300 ${
            currentTab === 'keyword'
              ? 'text-black border-b-2 border-black'
              : 'text-gray-400 border-b border-gray-400'
          }`}
        >
          키워드
        </button>
      </div>

      {currentTab === 'keyword' && (
        <div className="flex w-full h-[60px] px-4 bg-black/[0.05] justify-between items-center text-lg font-semibold">
          <div>알림 등록한 키워드 {keywordCount}개</div>
          <button
            onClick={KeywordSettingButtonClick}
            className="bg-[#0066b3] text-white px-3.5 py-1 text-base rounded-[10px] cursor-pointer font-medium hover:bg-[#004f8a] transition-colors"
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
