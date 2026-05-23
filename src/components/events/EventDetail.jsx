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
    <div className="w-full h-full overflow-y-auto">
      {event ? (
        <div className="w-full h-full overflow-y-auto">
          <TabBar Title="공지사항" />
          <EventBanner images={event.imgUrl} onImageClick={handleImageClick} />
          <div className="mx-6 mt-4 mb-[68px]">
            <div className="flex flex-col items-start gap-3 text-black text-xl font-bold leading-[130%]">
              <div className="w-fit px-1 py-[3px] h-5 flex justify-center items-center rounded bg-black/[0.08] text-sm text-[rgba(84,84,84)] font-bold">
                {event.subject}
              </div>
              <h2 className="text-2xl mb-2.5 m-0">{event.title}</h2>
              <section className="w-full justify-between flex gap-5 font-bold text-xs">
                <time className="text-black/40 leading-[130%]">{formatDate(event.createdAt)}</time>
                <div className="flex gap-2 self-start text-[#c2c8d1] whitespace-nowrap text-center">
                  <div className="flex pr-5 gap-1">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/62c7bb15f5fd13739601caff1be349795102bd00b8ccfe603cd2e43498657c46?apiKey=75213697ab8e4fbfb70997e546d69efb&"
                      alt="조회수"
                      className="w-3.5 aspect-square object-auto"
                      loading="lazy"
                    />
                    <span className="text-xs">{event.viewCount}</span>
                  </div>
                  <div className="flex pr-5 gap-1">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/52d95bd6c4badc487be46d013f44cd23b9800d5d1e753fb3a364bcb97b18044f?apiKey=75213697ab8e4fbfb70997e546d69efb&"
                      alt="좋아요"
                      className="w-3.5 aspect-square object-auto"
                      loading="lazy"
                    />
                    <span className="text-xs">{event.likesCount}</span>
                  </div>
                </div>
              </section>
            </div>
            <hr className="w-[312px] h-px my-6 bg-black/[0.08] border-0" />
            <div className="text-base mb-2.5">
              {content.map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
            <p className="text-sm mb-1.5">작성자: {event.writer}</p>
          </div>

          <div className="w-full z-[5] fixed bottom-0 flex items-center bg-white border-t border-[#2366AF]/[0.08] px-3 py-2 gap-1">
            <div
              onClick={handleStarClick}
              className="w-10 h-10 flex items-center justify-center cursor-pointer"
            >
              <img
                loading="lazy"
                src={
                  event.star
                    ? `${process.env.PUBLIC_URL}/icons/FilledBookmarkIcon.svg`
                    : `${process.env.PUBLIC_URL}/icons/EmptyBookmarkIcon.svg`
                }
                alt="Bookmark"
                className="w-[30px] h-[30px]"
              />
            </div>
            <div className="flex gap-2 flex-1">
              <button
                onClick={handleRedirect}
                className="flex-1 h-[50px] text-sm text-[#2366AF] font-semibold bg-[rgba(35,102,175,0.08)] border-none rounded-lg cursor-pointer flex justify-center items-center whitespace-nowrap"
              >
                사이트 바로가기
              </button>
              <button
                onClick={handleCalendarClick}
                className="flex-1 h-[50px] text-sm text-[#2366AF] font-semibold bg-[rgba(35,102,175,0.08)] border-none rounded-lg cursor-pointer flex justify-center items-center whitespace-nowrap"
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
        <p className="p-4">Loading...</p>
      )}
    </div>
  );
};

export default EventDetail;
