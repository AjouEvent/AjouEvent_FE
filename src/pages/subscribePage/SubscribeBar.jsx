import React, { useState, useEffect } from 'react';
import useSubscriptionStore from '../../store/useSubscriptionStore';
import Swal from 'sweetalert2';
import { getTopicSubscriptionsStatus, subscribeTopic } from '../../services/api/subscription';
import SubscribeStatusDropdown from './SubscribeStatusDropdown';
import { LIMITS } from '../../constants/appConstants';

const Toast = Swal.mixin({
  toast: true,
  position: 'center-center',
  showConfirmButton: false,
  timer: LIMITS.TOAST_TIMER.MEDIUM,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

const SubscribeBar = ({ onTopicSelect, showGuide }) => {
  const {
    isTopicTabRead,
    setIsTopicTabRead,
    markTopicAsRead,
    subscribeItems,
    fetchSubscribeItems,
  } = useSubscriptionStore();

  const [menuItems, setMenuItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [ringingTopics, setRingingTopics] = useState({});

  const handleTopicClick = (topic) => {
    if (selectedTopic === topic) {
      setSelectedTopic(null);
      onTopicSelect(null);
    } else {
      setSelectedTopic(topic);
      onTopicSelect(topic);
    }
    markTopicAsRead(topic);
  };

  const handleCategoryClick = (category) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  const fetchMenuItems = async () => {
    try {
      const response = await getTopicSubscriptionsStatus();
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const handleShowModal = async () => {
    if (!showModal) await fetchMenuItems();
    setShowModal(!showModal);
  };

  useEffect(() => {
    fetchSubscribeItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuItems]);

  useEffect(() => {
    const allTopicsRead =
      subscribeItems.length > 0 && subscribeItems.every((item) => item.isRead === true);
    if (allTopicsRead && !isTopicTabRead) setIsTopicTabRead(true);
    else if (!allTopicsRead && !isTopicTabRead) setIsTopicTabRead(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscribeItems, isTopicTabRead]);

  const handleSubscribe = async (topic) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      Toast.fire({ icon: 'info', title: `${topic.koreanTopic} 구독 중` });
      await subscribeTopic(topic.englishTopic);
      await fetchMenuItems();
      setIsTopicTabRead(false);
      setRingingTopics((prev) => ({ ...prev, [topic.id]: true }));
      setTimeout(() => setRingingTopics((prev) => ({ ...prev, [topic.id]: false })), 1000);
      setMenuItems((prev) =>
        prev.map((item) =>
          item.koreanTopic === topic.koreanTopic ? { ...item, subscribed: true } : item
        )
      );
    } catch (error) {
      Swal.fire({ icon: 'error', title: '구독 실패', text: '서버 에러' });
    } finally {
      setIsProcessing(false);
    }
  };

  const categorizeAndSortItems = (items) => {
    const categories = { 학과: [], 단과대: [], 공지사항: [], 기숙사: [], 대학원: [] };
    items.forEach((item) => {
      if (categories[item.classification]) categories[item.classification].push(item);
    });
    Object.keys(categories).forEach((cat) => {
      categories[cat].sort((a, b) => a.koreanOrder - b.koreanOrder);
    });
    return categories;
  };

  const categorizedItems = categorizeAndSortItems(menuItems);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="w-full flex items-center overflow-x-auto whitespace-nowrap bg-white px-4 py-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex items-center gap-2">
          <button
            onClick={handleShowModal}
            className={`flex h-9 px-3 justify-center items-center gap-1.5 rounded-full border border-[#E5E8EB] bg-[#F2F4F6] cursor-pointer text-sm font-semibold whitespace-nowrap text-[#333D4B] hover:bg-[#E5E8EB] transition-colors ${
              showGuide ? 'ring-2 ring-[#3182F6]' : ''
            }`}
          >
            <img src={`${process.env.PUBLIC_URL}/icons/gear.svg`} alt="gear" className="w-4 h-4 opacity-60" />
            <span>구독 설정</span>
          </button>
          {showGuide && (
            <span className="bg-[#3182F6] text-white px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap">
              클릭해서 구독하기
            </span>
          )}
        </div>

        <div className="flex gap-2 ml-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {Array.isArray(subscribeItems) ? (
            subscribeItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTopicClick(item.englishTopic)}
                className={`flex h-9 px-3 justify-center items-center gap-1 rounded-full border text-sm font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  selectedTopic === item.englishTopic
                    ? 'bg-[#3182F6] border-[#3182F6] text-white'
                    : 'bg-white border-[#E5E8EB] text-[#333D4B] hover:bg-[#F9FAFB]'
                }`}
              >
                <span>{item.koreanTopic}</span>
                {item.isRead === false && (
                  <div className="w-1.5 h-1.5 bg-[#F04452] rounded-full" />
                )}
              </button>
            ))
          ) : (
            <p className="text-sm text-[#B0B8C1]">구독 항목이 없습니다</p>
          )}
        </div>
      </div>

      {showModal && (
        <>
          <div
            onClick={() => setShowModal(false)}
            className="fixed top-0 left-0 w-full h-full bg-black/50 z-[1000]"
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl overflow-y-auto p-5 z-[1001] w-[90%] h-[80%]">
            <div className="flex items-center gap-3 mb-5">
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[#F2F4F6] transition-colors"
              >
                <img
                  src={`${process.env.PUBLIC_URL}/icons/arrow_back.svg`}
                  alt="back"
                  className="w-5 aspect-square object-contain"
                />
              </button>
              <h1 className="text-[#191F28] text-lg font-bold tracking-tight m-0">전체 구독 항목</h1>
            </div>

            {Object.keys(categorizedItems).map((category) => (
              <div key={category} className="mb-2">
                <button
                  className="w-full text-left text-xl font-bold py-3 border-b border-[#E5E8EB] flex justify-between items-center cursor-pointer bg-transparent text-[#191F28]"
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                  <img
                    src={
                      openCategory === category
                        ? `${process.env.PUBLIC_URL}/icons/arrow_down.svg`
                        : `${process.env.PUBLIC_URL}/icons/arrow_right.svg`
                    }
                    alt="arrow"
                    className="w-5 h-5 opacity-50"
                  />
                </button>
                {openCategory === category &&
                  categorizedItems[category].map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center py-3 border-b border-[#F2F4F6]"
                    >
                      <span className="text-[#333D4B] text-sm font-medium">{item.koreanTopic}</span>
                      <div>
                        {item.subscribed ? (
                          <SubscribeStatusDropdown
                            topic={item}
                            fetchMenuItems={fetchMenuItems}
                            ringing={ringingTopics[item.id]}
                          />
                        ) : (
                          <button
                            onClick={() => handleSubscribe(item)}
                            className="px-4 py-2 bg-[#3182F6] hover:bg-[#1B6EE8] text-white text-xs font-semibold rounded-xl border-none cursor-pointer transition-colors"
                          >
                            구독
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SubscribeBar;
