import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import CalendarModal from '../CalendarModal';
import TabBar from '../TabBar';
import requestWithAccessToken from '../../services/jwt/requestWithAccessToken';
import Swal from 'sweetalert2';
import EventBanner from './EventBanner';
import axios from 'axios';
import ImageModal from './ImageModal';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  font-family: 'Pretendard Variable';
`;

const EventContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
  margin: 0;
`;

const Content = styled.div`
  font-size: 16px;
  margin-bottom: 10px;
`;

const Line = styled.div`
  margin: 0;
`;

const Writer = styled.p`
  font-size: 14px;
  margin-bottom: 5px;
`;

const Subject = styled.div`
  width: fit-content;
  padding: 3px 4px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  background: rgba(84, 84, 84, 0.08);
  font-size: 14px;
  color: rgba(84, 84, 84);
  font-weight: bold;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  align-self: stretch;
  color: #000;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 130%; /* 26px */
`;

const LinkButton = styled.div`
  text-align: center;
  width: 100%;
  padding: 10px 20px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  margin: 24px 0 16px 0;
  cursor: pointer;
  display: inline-block;
`;

const ContentContaioner = styled.div`
  width: calc(100%-48px);
  margin: 16px 24px 0px 24px;
  margin-bottom: 68px;
`;

const SubtitleContainer = styled.section`
  width: 100%;
  justify-content: space-between;
  display: flex;
  gap: 20px;
  font:
    700 12px 'Pretendard Variable',
    sans-serif;
`;

const StyledDate = styled.time`
  color: rgba(0, 0, 0, 0.4);
  line-height: 130%;
`;

const Stats = styled.div`
  align-self: start;
  display: flex;
  gap: 8px;
  color: #c2c8d1;
  white-space: nowrap;
  text-align: center;
`;

const StatItem = styled.div`
  display: flex;
  padding-right: 20px;
  gap: 4px;
`;

const StatIcon = styled.img`
  aspect-ratio: 1;
  object-fit: auto;
  object-position: center;
  width: 14px;
`;

const StatValue = styled.span`
  font-family: 'Pretendard Variable';
`;

const HorizontalLine = styled.hr`
  width: 312px;
  height: 1px;
  margin: 24px 0 24px 0;
  background: rgba(0, 0, 0, 0.08);
  border: 0;
`;

const BottomContainer = styled.div`
  width: 100%;
  z-index: 5;
  position: fixed;
  bottom: 0;
  display: flex;
  align-items: center;
  background-color: #fff;
  border-top: 1px solid rgba(35, 102, 175, 0.08);
  padding: 8px 12px; /* 양쪽에 여백 추가 */
  gap: 4px; /* <<< 여기 추가 (북마크와 버튼 사이 거리) */
`;

const BookmarkContainer = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const BottomImage = styled.img`
  width: 30px;
  height: 30px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px; /* 버튼 사이 여백 추가 */
  flex: 1; /* 남는 공간 차지 */
`;

const BottomButton = styled.button`
  flex: 1;
  height: 50px; /* 버튼 높이도 조금 줄여서 여유 느낌 */
  font-family: 'Pretendard Variable';
  font-size: 14px;
  color: #2366af;
  font-weight: 600;
  background-color: rgba(35, 102, 175, 0.08);
  border: none;
  border-radius: 8px; /* 버튼 모서리 둥글게 */
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
`;

function Stat({ iconSrc, value, altText }) {
  return (
    <StatItem>
      <StatIcon src={iconSrc} alt={altText} loading="lazy" />
      <StatValue>{value}</StatValue>
    </StatItem>
  );
}

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
    while (c.charAt(0) === ' ') c = c.substring(1, c.length); // 앞의 공백을 제거
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length); // 쿠키 이름이 일치하는 경우 값 반환
  }
  return null; // 쿠키가 없는 경우 null 반환
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
        const accessToken = localStorage.getItem('accessToken');
        const alreadyViewClubEventNum = getCookie('AlreadyViewClubEventNum');
        console.log(alreadyViewClubEventNum);
        let response;

        if (accessToken) {
          response = await requestWithAccessToken(
            'get',
            `${process.env.REACT_APP_BE_URL}/api/event/detail/${id}`,
          );
        } else {
          const config = alreadyViewClubEventNum
            ? {
                headers: {
                  Cookie: `AlreadyViewClubEventNum=${alreadyViewClubEventNum}`,
                },
                withCredentials: true,
              }
            : { withCredentials: true };

          response = await axios.get(
            `${process.env.REACT_APP_BE_URL}/api/event/detail/${id}`,
            config,
          );
        }

        if (response.data.content) {
          setContent(response.data.content.split('\\n'));
        }
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event:', error);
        if (error.response && error.response.status === 401) {
          Swal.fire({
            icon: 'error',
            title: '세션 만료',
            text: '다시 로그인 해주세요.',
          });
        }
      }
    };

    fetchEvent();
  }, [id]);

  const handleRedirect = () => {
    if (event && event.url) {
      window.location.href = event.url;
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'url 에러',
        text: '바로가기 가능한 url이 없습니다.',
      });
    }
  };

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setIsImageModalOpen(true);
  };

  const handleCalendarClick = () => {
    setIsCalendarModalOpen(true);
  };

  const handleStarClick = async () => {
    try {
      if (event.star) {
        await requestWithAccessToken(
          'delete',
          `${process.env.REACT_APP_BE_URL}/api/event/like/${id}`,
        );
        setEvent((prevEvent) => ({
          ...prevEvent,
          star: false,
          likesCount: prevEvent.likesCount - 1,
        }));
      } else {
        await requestWithAccessToken(
          'post',
          `${process.env.REACT_APP_BE_URL}/api/event/like/${id}`,
        );
        setEvent((prevEvent) => ({
          ...prevEvent,
          star: true,
          likesCount: prevEvent.likesCount + 1,
        }));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      Swal.fire({
        icon: 'error',
        title: '좋아요 에러',
        text: '로그인이 필요한 기능입니다.',
      });
    }
  };

  return (
    <Container>
      {event ? (
        <EventContainer>
          <TabBar Title={'공지사항'} />
          <EventBanner images={event.imgUrl} onImageClick={handleImageClick} />
          <ContentContaioner>
            <TitleContainer>
              <Subject>{event.subject}</Subject>
              <Title>{event.title}</Title>
              <SubtitleContainer>
                <StyledDate>{formatDate(event.createdAt)}</StyledDate>
                <Stats>
                  <Stat
                    iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/62c7bb15f5fd13739601caff1be349795102bd00b8ccfe603cd2e43498657c46?apiKey=75213697ab8e4fbfb70997e546d69efb&"
                    value={event.viewCount}
                    altText="Statistic icon 1"
                  />
                  <Stat
                    onClick={handleStarClick}
                    iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/52d95bd6c4badc487be46d013f44cd23b9800d5d1e753fb3a364bcb97b18044f?apiKey=75213697ab8e4fbfb70997e546d69efb&"
                    value={event.likesCount}
                    altText="Statistic icon 2"
                  />
                </Stats>
              </SubtitleContainer>
            </TitleContainer>
            <HorizontalLine />
            <Content>
              {content.map((line, index) => (
                <Line key={index}>{line}</Line>
              ))}
            </Content>
            <Writer>작성자: {event.writer}</Writer>
            
          </ContentContaioner>
          <BottomContainer>
            <BookmarkContainer onClick={handleStarClick}>
              <BottomImage
                loading="lazy"
                src={
                  event.star
                    ? `${process.env.PUBLIC_URL}/icons/FilledBookmarkIcon.svg`
                    : `${process.env.PUBLIC_URL}/icons/EmptyBookmarkIcon.svg`
                }
                alt="Bookmark"
              />
            </BookmarkContainer>
            <ButtonGroup>
              <BottomButton onClick={handleRedirect}>사이트 바로가기</BottomButton>
              <BottomButton onClick={handleCalendarClick}>캘린더에 추가</BottomButton>
            </ButtonGroup>
          </BottomContainer>
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
        </EventContainer>
      ) : (
        <p>Loading...</p>
      )}
    </Container>
  );
};

export default EventDetail;
