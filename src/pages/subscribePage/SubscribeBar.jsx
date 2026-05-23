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
      <div
        className={`w-full flex items-center overflow-x-auto whitespace-nowrap bg-white font-semibold box-border ${
          showGuide ? 'py-[18px] px-[10px] pl-3' : 'pt-3 pb-0 px-[10px] pl-4'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div
            onClick={handleShowModal}
            className={`flex h-fit px-3 py-2 justify-center items-center gap-1 rounded-[600px] border-2 border-[#F5F5F5] bg-[#E0E0E0] cursor-pointer text-sm whitespace-nowrap box-border ${
              showGuide ? 'animate-[glow_1.5s_infinite]' : ''
            }`}
          >
            <img src={`${process.env.PUBLIC_URL}/icons/gear.svg`} alt="gear" className="w-[18px] aspect-square object-cover" />
            <p className="m-0">구독 설정</p>
          </div>
          {showGuide && (
            <div className="bg-[#0072CE] text-white px-2 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap leading-[1.4] animate-[fadeIn_0.5s_ease-in-out]">
              클릭해서 구독하기
            </div>
          )}
        </div>

        <div className="w-full flex overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {Array.isArray(subscribeItems) ? (
            subscribeItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleTopicClick(item.englishTopic)}
                className={`flex h-fit px-3 py-2 mx-1 justify-center items-center gap-1 rounded-[600px] border-2 border-[#F5F5F5] cursor-pointer ${
                  selectedTopic === item.englishTopic
                    ? 'bg-[#0A5CA8] text-white'
                    : 'bg-white text-black'
                }`}
              >
                <span>{item.koreanTopic}</span>
                {item.isRead === false && (
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full inline-block" />
                )}
              </div>
            ))
          ) : (
            <p>구독 항목이 없습니다</p>
          )}
        </div>
      </div>

      {showModal && (
        <>
          <div
            onClick={() => setShowModal(false)}
            className="fixed top-0 left-0 w-full h-full bg-black/50 z-[1000]"
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-[10px] overflow-y-auto p-6 z-[1001] w-[90%] h-[80%]">
            <div className="w-full flex items-center pb-4 gap-2">
              <img
                src={`${process.env.PUBLIC_URL}/icons/arrow_back.svg`}
                alt="back"
                className="w-5 aspect-square object-contain cursor-pointer"
                onClick={() => setShowModal(false)}
              />
              <h1 className="text-black text-lg font-bold tracking-[-0.2px] m-0">전체 구독 항목</h1>
            </div>

            {Object.keys(categorizedItems).map((category) => (
              <div key={category}>
                <h2
                  className="text-3xl font-bold mt-10 pb-2.5 border-b border-[#E0E0E0] flex justify-between items-center cursor-pointer"
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
                    className="w-6 h-6"
                  />
                </h2>
                {openCategory === category &&
                  categorizedItems[category].map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center py-2.5 border-b border-[#E0E0E0] font-semibold"
                    >
                      <div>{item.koreanTopic}</div>
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
                            className="inline-flex justify-center items-center px-5 py-2.5 bg-[#0072CE] text-white text-base font-semibold rounded-[50px] border-none cursor-pointer shadow-sm gap-2 hover:bg-[#E0E0E0]"
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
