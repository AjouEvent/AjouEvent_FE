import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { updateTopicNotification, unsubscribeTopic } from '../../services/api/subscription';
import { Bell, BellOff, BellMinus, ChevronDown, Check } from 'lucide-react';

export default function SubscribeStatusDropdown({ topic, fetchMenuItems, ringing }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionChange = async (option) => {
    if (option === 'unsubscribe') {
      await handleUnsubscribe();
    } else {
      await updateNotificationPreference(option === 'all');
    }
    setIsOpen(false);
  };

  const updateNotificationPreference = async (receiveNotification) => {
    try {
      await updateTopicNotification(topic.englishTopic, receiveNotification);
      fetchMenuItems();
      Swal.fire('알림 설정 변경 완료', '', 'success');
    } catch (error) {
      Swal.fire('오류', '알림 설정 변경 실패', 'error');
    }
  };

  const handleUnsubscribe = async () => {
    try {
      await unsubscribeTopic(topic.englishTopic);
      fetchMenuItems();
      Swal.fire('구독 취소 완료', `${topic.koreanTopic} 구독을 취소했습니다.`, 'success');
    } catch (error) {
      Swal.fire('오류', '구독 취소 실패', 'error');
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={toggleDropdown}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full cursor-pointer font-semibold text-sm border-none transition-colors ${
          topic.receiveNotification
            ? 'bg-[#EBF4FE] text-[#3182F6]'
            : 'bg-[#F2F4F6] text-[#6B7684]'
        } ${ringing ? 'animate-[ring_1s_ease-in-out]' : ''}`}
      >
        {topic.receiveNotification ? (
          <Bell className="w-4 h-4" />
        ) : (
          <BellOff className="w-4 h-4" />
        )}
        구독중
        <ChevronDown className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <ul className="absolute top-full right-0 bg-white list-none p-1.5 border border-[#E5E8EB] rounded-xl shadow-lg w-[148px] z-[100] mt-1">
          <li
            onClick={() => !topic.receiveNotification !== false && handleOptionChange('all')}
            className={`px-3 py-2 flex justify-between items-center rounded-lg ${
              topic.receiveNotification === true
                ? 'cursor-default text-[#3182F6] bg-[#F0F7FF]'
                : 'cursor-pointer hover:bg-[#F5F5F5] text-[#333D4B]'
            }`}
          >
            <div className="flex items-center gap-2 text-sm">
              <Bell className="w-4 h-4 flex-shrink-0" />
              알림 받기
            </div>
            {topic.receiveNotification === true && (
              <Check className="w-3.5 h-3.5 text-[#3182F6] flex-shrink-0" />
            )}
          </li>
          <li
            onClick={() => topic.receiveNotification !== false && handleOptionChange('none')}
            className={`px-3 py-2 flex justify-between items-center rounded-lg ${
              topic.receiveNotification === false
                ? 'cursor-default text-[#3182F6] bg-[#F0F7FF]'
                : 'cursor-pointer hover:bg-[#F5F5F5] text-[#333D4B]'
            }`}
          >
            <div className="flex items-center gap-2 text-sm">
              <BellOff className="w-4 h-4 flex-shrink-0" />
              알림 없음
            </div>
            {topic.receiveNotification === false && (
              <Check className="w-3.5 h-3.5 text-[#3182F6] flex-shrink-0" />
            )}
          </li>
          <li
            onClick={() => handleOptionChange('unsubscribe')}
            className="px-3 py-2 flex items-center gap-2 rounded-lg cursor-pointer hover:bg-[#FFF0F0] text-[#F04452] text-sm"
          >
            <BellMinus className="w-4 h-4 flex-shrink-0" />
            구독 취소
          </li>
        </ul>
      )}
    </div>
  );
}
