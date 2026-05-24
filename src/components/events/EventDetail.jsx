import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CalendarModal from '../CalendarModal';
import TabBar from '../TabBar';
import Swal from 'sweetalert2';
import EventBanner from './EventBanner';
import ImageModal from './ImageModal';
import { STORAGE_KEYS } from '../../constants/appConstants';
import { getEventDetail, getAuthEventDetail, likeEvent, unlikeEvent } from '../../services/api/event';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
};

const getCookie = (name) => {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [content, setContent] = useState([]);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const alreadyViewClubEventNum = getCookie('AlreadyViewClubEventNum');
        let response;

        if (accessToken) {
          response = await getAuthEventDetail(id);
        } else {
          const config = alreadyViewClubEventNum
            ? { headers: { Cookie: `AlreadyViewClubEventNum=${alreadyViewClubEventNum}` }, withCredentials: true }
            : { withCredentials: true };
          response = await getEventDetail(id, config);
        }

        if (response.data.content) setContent(response.data.content.split('\\n'));
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event:', error);
        if (error.response && error.response.status === 401) {
          Swal.fire({ icon: 'error', title: '세션 만료', text: '다시 로그인 해주세요.' });
        }
      }
    };
    fetchEvent();
  }, [id]);

  const handleRedirect = () => {
    if (event && event.url) {
      window.location.href = event.url;
    } else {
      Swal.fire({ icon: 'warning', title: 'url 에러', text: '바로가기 가능한 url이 없습니다.' });
    }
  };

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setIsImageModalOpen(true);
  };

  const handleCalendarClick = () => setIsCalendarModalOpen(true);

  const handleStarClick = async () => {
    try {
      if (event.star) {
        await unlikeEvent(id);
        setEvent((prev) => ({ ...prev, star: false, likesCount: prev.likesCount - 1 }));
      } else {
        await likeEvent(id);
        setEvent((prev) => ({ ...prev, star: true, likesCount: prev.likesCount + 1 }));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      Swal.fire({ icon: 'error', title: '좋아요 에러', text: '로그인이 필요한 기능입니다.' });
    }
  };

  return (
    <div className="w-full min-h-screen bg-white">
      {event ? (
        <div className="w-full">
          <TabBar Title="공지사항" />
          <EventBanner images={event.imgUrl} onImageClick={handleImageClick} />

          <div className="px-5 pt-5 pb-32">
            <span className="inline-flex px-2 py-0.5 rounded-lg bg-[#F2F4F6] text-xs text-[#6B7684] font-semibold mb-3">
              {event.subject}
            </span>
            <h2 className="text-[#191F28] text-xl font-bold leading-[1.4] tracking-tight mb-3">
              {event.title}
            </h2>

            <div className="flex items-center justify-between mb-5">
              <time className="text-[#B0B8C1] text-xs font-medium">
                {formatDate(event.createdAt)}
              </time>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/62c7bb15f5fd13739601caff1be349795102bd00b8ccfe603cd2e43498657c46?apiKey=75213697ab8e4fbfb70997e546d69efb&"
                    alt="조회수"
                    className="w-3 h-3 object-contain opacity-50"
                    loading="lazy"
                  />
                  <span className="text-xs text-[#6B7684]">{event.viewCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/52d95bd6c4badc487be46d013f44cd23b9800d5d1e753fb3a364bcb97b18044f?apiKey=75213697ab8e4fbfb70997e546d69efb&"
                    alt="좋아요"
                    className="w-3 h-3 object-contain opacity-50"
                    loading="lazy"
                  />
                  <span className="text-xs text-[#6B7684]">{event.likesCount}</span>
                </div>
              </div>
            </div>

            <div className="h-px bg-[#F2F4F6] mb-5" />

            <div className="text-[#333D4B] text-sm leading-relaxed mb-4">
              {content.map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>

            <p className="text-xs text-[#B0B8C1] mt-4">작성자: {event.writer}</p>
          </div>

          <div className="w-full z-[5] fixed bottom-0 flex items-center bg-white/95 backdrop-blur-xl border-t border-[#F0F2F5] px-4 py-3 gap-2 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
            <button
              onClick={handleStarClick}
              className={`w-12 h-12 flex items-center justify-center rounded-xl transition-colors flex-shrink-0 ${
                event.star ? 'bg-[#FFF0F1] hover:bg-[#FFE0E3]' : 'hover:bg-[#F2F4F6] active:bg-[#E5E8EB]'
              }`}
            >
              <img
                loading="lazy"
                src={
                  event.star
                    ? `${process.env.PUBLIC_URL}/icons/FilledBookmarkIcon.svg`
                    : `${process.env.PUBLIC_URL}/icons/EmptyBookmarkIcon.svg`
                }
                alt="Bookmark"
                className="w-6 h-6"
              />
            </button>
            <div className="flex gap-2 flex-1">
              <button
                onClick={handleRedirect}
                className="flex-1 h-12 text-sm text-[#3182F6] font-bold bg-[#EBF4FE] hover:bg-[#D6ECFE] active:bg-[#C5E4FD] border-none rounded-xl cursor-pointer flex justify-center items-center transition-colors"
              >
                사이트 바로가기
              </button>
              <button
                onClick={handleCalendarClick}
                className="flex-1 h-12 text-sm text-[#003876] font-bold bg-[#EEF3FA] hover:bg-[#D5E2F2] active:bg-[#C0D5EC] border-none rounded-xl cursor-pointer flex justify-center items-center transition-colors"
              >
                캘린더에 추가
              </button>
            </div>
          </div>

          {isImageModalOpen && (
            <ImageModal
              images={event.imgUrl}
              currentIndex={currentImageIndex}
              onClose={() => setIsImageModalOpen(false)}
            />
          )}
          {isCalendarModalOpen && (
            <CalendarModal
              setIsModalOpen={setIsCalendarModalOpen}
              title={event.title}
              content={content}
            />
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-[#B0B8C1] text-sm">불러오는 중...</p>
        </div>
      )}
    </div>
  );
};

export default EventDetail;
