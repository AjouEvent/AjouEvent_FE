import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useSubscriptionStore from '../../store/useSubscriptionStore';
import NavigationBar from '../../components/layout/NavigationBar';
import LocationBar from '../../components/layout/LocationBar';
import SubscribeTab from './SubscribeTab';
import KeywordTab from './KeywordTab';
import { STORAGE_KEYS } from '../../constants/appConstants';

export default function SubscribePage() {
  const location = useLocation();
  const { subscribeItems, subscribedKeywords, fetchSubscribedKeywords } = useSubscriptionStore();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'subscribe');
  const [showGuide, setShowGuide] = useState(false);

  const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

  useEffect(() => {
    if (activeTab === 'subscribe') setShowGuide(subscribeItems.length === 0);
    else if (activeTab === 'keyword') setShowGuide(subscribedKeywords.length === 0);
  }, [subscribeItems, subscribedKeywords, activeTab]);

  useEffect(() => {
    fetchSubscribedKeywords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getGuideMessage = (tab) => {
    if (tab === 'subscribe')
      return (
        <>
          아직 구독한 항목이 없습니다.<br />
          아래의 <strong>⚙️ 구독 설정</strong>에서 관심있는 공지를 구독해보세요!
        </>
      );
    if (tab === 'keyword')
      return (
        <>
          아직 구독한 키워드가 없습니다.<br />
          아래의 <strong>🔔 키워드 설정</strong>에서 관심있는 키워드를 구독해보세요!
        </>
      );
    return (
      <>
        아직 구독한 항목이 없습니다.<br />
        아래의 톱니바퀴/종 모양의 <strong>'설정'</strong>에서 관심있는 공지를 구독해보세요!
      </>
    );
  };

  return (
    <div className="flex items-center flex-col bg-[#F9FAFB] min-h-screen">
      {accessToken ? (
        <div className="flex w-full overflow-x-hidden items-center flex-col pb-20">
          <LocationBar location="구독" />

          {showGuide && (
            <div className="w-full px-5 py-3 bg-[#EBF4FE] text-sm text-[#3182F6] text-center font-medium leading-relaxed break-keep">
              {getGuideMessage(activeTab)}
            </div>
          )}

          <div className="flex w-full bg-white px-4 py-2.5 border-b border-[#F0F2F5]">
            <div className="flex w-full bg-[#F2F4F6] rounded-xl p-1 gap-1">
              {[
                { key: 'subscribe', label: '구독 알림' },
                { key: 'keyword', label: '키워드 알림' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  className={`relative flex-1 py-2 text-center text-sm font-semibold border-none cursor-pointer transition-all rounded-lg ${
                    activeTab === key
                      ? 'bg-white text-[#191F28] shadow-sm'
                      : 'bg-transparent text-[#B0B8C1] hover:text-[#6B7684]'
                  }`}
                  onClick={() => setActiveTab(key)}
                >
                  {label}
                  {key === 'subscribe' && subscribeItems.some((item) => !item.isRead) && (
                    <div className="absolute top-1.5 right-3 w-1.5 h-1.5 bg-[#F04452] rounded-full" />
                  )}
                  {key === 'keyword' && subscribedKeywords.some((item) => !item.isRead) && (
                    <div className="absolute top-1.5 right-3 w-1.5 h-1.5 bg-[#F04452] rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'subscribe' && (
            <div className="w-full">
              <SubscribeTab showGuide={showGuide} />
            </div>
          )}
          {activeTab === 'keyword' && (
            <div className="w-full">
              <KeywordTab showGuide={showGuide} />
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <p className="text-[#6B7684] text-sm m-0">로그인이 필요한 서비스입니다</p>
          <Link
            to="/login"
            className="flex items-center justify-center bg-[#3182F6] hover:bg-[#1B6EE8] rounded-xl px-6 py-3 text-white text-sm font-semibold no-underline transition-colors"
          >
            로그인
          </Link>
        </div>
      )}
      <NavigationBar />
    </div>
  );
}
