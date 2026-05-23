import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useSubscriptionStore from '../../store/useSubscriptionStore';
import NavigationBar from '../../components/NavigationBar';
import LocationBar from '../../components/LocationBar';
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
          아직 구독한 항목이 없습니다.
          <br />
          아래의 <strong>⚙️ 구독 설정</strong>에서 관심있는 공지를 구독해보세요!
        </>
      );
    if (tab === 'keyword')
      return (
        <>
          아직 구독한 키워드가 없습니다.
          <br />
          아래의 <strong>🔔 키워드 설정</strong>에서 관심있는 키워드를 구독해보세요!
        </>
      );
    return (
      <>
        아직 구독한 항목이 없습니다.
        <br />
        아래의 톱니바퀴/종 모양의 <strong>'설정'</strong>에서 관심있는 공지를 구독해보세요!
      </>
    );
  };

  return (
    <div className="flex items-center flex-col bg-white">
      {accessToken ? (
        <div className="flex w-full overflow-x-hidden items-center flex-col pb-20">
          <LocationBar location="구독" />
          {showGuide && (
            <div className="w-full px-3 py-3 bg-[#f0f8ff] text-sm text-[#0072CE] text-center font-semibold leading-[1.5] break-keep whitespace-normal">
              {getGuideMessage(activeTab)}
            </div>
          )}
          <div className="flex w-full">
            <div
              className={`flex-1 px-5 py-2.5 cursor-pointer text-center transition-colors duration-300 relative ${
                activeTab === 'subscribe'
                  ? 'border-b-2 border-black text-black font-bold'
                  : 'border-b border-[#CDCDCD] text-[#333]'
              }`}
              onClick={() => setActiveTab('subscribe')}
            >
              구독 알림
              {subscribeItems.some((item) => !item.isRead) && (
                <div className="absolute top-0 right-5 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </div>
            <div
              className={`flex-1 px-5 py-2.5 cursor-pointer text-center transition-colors duration-300 relative ${
                activeTab === 'keyword'
                  ? 'border-b-2 border-black text-black font-bold'
                  : 'border-b border-[#CDCDCD] text-[#333]'
              }`}
              onClick={() => setActiveTab('keyword')}
            >
              키워드 알림
              {subscribedKeywords.some((item) => !item.isRead) && (
                <div className="absolute top-0 right-5 w-2 h-2 bg-red-500 rounded-full" />
              )}
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
        <div className="flex items-center justify-center flex-col bg-white h-screen">
          <p>로그인이 필요한 서비스입니다</p>
          <Link
            to="/login"
            className="flex flex-wrap items-center justify-center bg-white rounded-lg border border-gray-400 w-24 h-[1.4rem] text-black text-sm no-underline mx-4"
          >
            로그인
          </Link>
        </div>
      )}
      <NavigationBar />
    </div>
  );
}
