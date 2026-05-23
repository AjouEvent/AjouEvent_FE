import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { updateTopicNotification, unsubscribeTopic } from '../../services/api/subscription';

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

  const bellFilter = topic.receiveNotification
    ? 'invert(29%) sepia(97%) saturate(937%) hue-rotate(187deg) brightness(91%) contrast(90%)'
    : 'none';

  return (
    <div className="relative inline-block">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-1.5 bg-[#F5F5F5] px-3 py-1.5 border-none rounded-full cursor-pointer font-semibold"
      >
        <img
          src={
            topic.receiveNotification
              ? `${process.env.PUBLIC_URL}/icons/bell_ring.svg`
              : `${process.env.PUBLIC_URL}/icons/bell_off.svg`
          }
          alt="알림 상태 아이콘"
          className={`w-[25px] h-[25px] ${ringing ? 'animate-[ring_1s_ease-in-out]' : ''}`}
          style={{ filter: bellFilter }}
        />
        구독중
        <img src={`${process.env.PUBLIC_URL}/icons/arrow_down.svg`} alt="arrow" />
      </button>

      {isOpen && (
        <ul className="absolute top-full left-0 bg-white list-none p-1.5 border border-[#CDCDCD] rounded-lg w-[130px] z-[100]">
          <li
            onClick={() => !topic.receiveNotification !== false && handleOptionChange('all')}
            className={`px-3 py-2 flex justify-between items-center ${
              topic.receiveNotification === true
                ? 'cursor-default text-[#bbb] pointer-events-none'
                : 'cursor-pointer hover:bg-[#F5F5F5]'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <img src={`${process.env.PUBLIC_URL}/icons/bell_ring.svg`} alt="알림 받기" className="w-4 h-4" />
              알림 받기
            </div>
            {topic.receiveNotification === true && <span className="text-[#0072CE] font-bold">✔</span>}
          </li>
          <li
            onClick={() => topic.receiveNotification !== false && handleOptionChange('none')}
            className={`px-3 py-2 flex justify-between items-center ${
              topic.receiveNotification === false
                ? 'cursor-default text-[#bbb] pointer-events-none'
                : 'cursor-pointer hover:bg-[#F5F5F5]'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <img src={`${process.env.PUBLIC_URL}/icons/bell_off.svg`} alt="알림 없음" className="w-4 h-4" />
              알림 없음
            </div>
            {topic.receiveNotification === false && <span className="text-[#0072CE] font-bold">✔</span>}
          </li>
          <li
            onClick={() => handleOptionChange('unsubscribe')}
            className="px-3 py-2 flex justify-between items-center cursor-pointer hover:bg-[#F5F5F5]"
          >
            <div className="flex items-center gap-1.5">
              <img src={`${process.env.PUBLIC_URL}/icons/bell_minus.svg`} alt="구독 취소" className="w-4 h-4" />
              구독 취소
            </div>
          </li>
        </ul>
      )}
    </div>
  );
}
