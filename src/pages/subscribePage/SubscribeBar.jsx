import React, { useState, useEffect } from 'react';
import useSubscriptionStore from '../../store/useSubscriptionStore';
import { toast } from 'sonner';
import { getTopicSubscriptionsStatus, subscribeTopic } from '../../services/api/subscription';
import SubscribeStatusDropdown from './SubscribeStatusDropdown';
import { Settings, ChevronDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { ScrollArea } from '../../components/ui/scroll-area';

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
  const [closingCategory, setClosingCategory] = useState(null);
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
    if (openCategory === category) {
      setClosingCategory(category);
      setTimeout(() => {
        setOpenCategory(null);
        setClosingCategory(null);
      }, 150);
    } else {
      setOpenCategory(category);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await getTopicSubscriptionsStatus();
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const handleOpenChange = async (open) => {
    if (open) await fetchMenuItems();
    setShowModal(open);
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
      toast.info(`${topic.koreanTopic} 구독 중`);
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
      toast.error('구독 실패', { description: '서버 에러' });
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
        <div className="flex items-center gap-2 flex-shrink-0">
          <Dialog open={showModal} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <button
                className={`flex h-9 px-3 justify-center items-center gap-1.5 rounded-full border border-[#E5E8EB] bg-[#F2F4F6] cursor-pointer text-sm font-semibold whitespace-nowrap text-[#333D4B] hover:bg-[#E5E8EB] transition-colors ${
                  showGuide ? 'ring-2 ring-[#3182F6]' : ''
                }`}
              >
                <Settings className="w-4 h-4 text-[#6B7684]" />
                <span>구독 설정</span>
              </button>
            </DialogTrigger>

            <DialogContent className="h-[80vh] flex flex-col p-0 gap-0 overflow-hidden">
              <DialogHeader className="px-5 py-4 border-b border-[#F0F2F5] flex-shrink-0">
                <DialogTitle className="text-[#191F28] text-lg font-bold tracking-tight">
                  전체 구독 항목
                </DialogTitle>
              </DialogHeader>

              <ScrollArea className="flex-1">
              <div className="px-5 py-2">
                {Object.keys(categorizedItems).map((category) => (
                  <div key={category} className="mb-1">
                    <button
                      className="w-full text-left text-base font-bold py-3.5 border-b border-[#E5E8EB] flex justify-between items-center cursor-pointer bg-transparent text-[#191F28]"
                      onClick={() => handleCategoryClick(category)}
                    >
                      <span>{category}</span>
                      <ChevronDown className={`w-5 h-5 text-[#8B95A1] transition-transform duration-200 ${
                        openCategory === category ? 'rotate-0' : '-rotate-90'
                      }`} />
                    </button>
                    {(openCategory === category || closingCategory === category) && (
                      <div className={closingCategory === category ? 'animate-accordion-up' : 'animate-accordion-down'}>
                        {categorizedItems[category].map((item) => (
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
                    )}
                  </div>
                ))}
              </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>

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
    </div>
  );
};

export default SubscribeBar;
