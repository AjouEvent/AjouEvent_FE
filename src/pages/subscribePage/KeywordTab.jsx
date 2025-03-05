import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import KeywordBar from './KeywordBar';
import SearchBar from '../../components/SearchBar';
import requestWithAccessToken from '../../services/jwt/requestWithAccessToken';
import KeywordEventCard from '../../components/events/KeywordEventCard';
import useStore from '../../store/useStore';

const AppContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #ffffff;
`;

const KeywordListContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
  padding: 0.25rem 1.5rem;
  gap: 0.5rem;
`;

const MessageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: start;
  width: 100%;
  height: 100%;
  font-family: 'Pretendard Variable';
  font-size: 16px;
  font-weight: 600;
  color: gray;
  padding: 16px;
`;

export default function KeywordTab({ showGuide }) {
  const { setIsKeywordTabRead } = useStore((state) => ({
    setIsKeywordTabRead: state.setIsKeywordTabRead,
  }));

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isError, setIsError] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const pageSize = 10;
  const bottomRef = useRef(null);

  const handleKeywordSelect = (keyword) => {
    setSelectedKeyword(keyword); // 키워드 변경
    setHasMore(true); // 로드 가능 상태 초기화
    setEvents([]); // 기존 이벤트 초기화
    setPage(0); // 페이지 초기화
  };

  // Infinite Scroll 및 키워드 변경 시 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      if (!hasMore || loading || page < 0) return;

      setLoading(true);
      setIsError(false);

      try {
        const url = selectedKeyword
          ? `${process.env.REACT_APP_BE_URL}/api/event/getSubscribedPostsByKeyword/${selectedKeyword.encodedKeyword}?page=${page}&size=${pageSize}`
          : `${process.env.REACT_APP_BE_URL}/api/event/getSubscribedPostsByKeyword?page=${page}&size=${pageSize}`;

        const response = await requestWithAccessToken('get', url);
        const newEvents = response.data.result;

        setEvents((prevEvents) =>
          page === 0 ? newEvents : [...prevEvents, ...newEvents],
        );

        if (newEvents.length < pageSize) {
          setHasMore(false);
        }
      } catch (error) {
        setIsError(true);
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, selectedKeyword]);

  // 무한 스크롤에서 중복 호출 방지
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1 },
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => {
      if (bottomRef.current) {
        observer.unobserve(bottomRef.current);
      }
    };
  }, [hasMore, loading]);

  return (
    <AppContainer>
      <KeywordBar onKeywordSelect={handleKeywordSelect} showGuide={showGuide} />
      <SearchBar setKeyword={setSelectedKeyword} />
      <KeywordListContainer>
        {events.map((event, index) => (
          <KeywordEventCard
            key={`${event.eventId}-${index}`}
            id={event.eventId}
            {...event}
          />
        ))}
      </KeywordListContainer>
      {loading && <MessageContainer>로딩중...</MessageContainer>}
      {isError && <MessageContainer>서버 에러</MessageContainer>}
      <div ref={bottomRef} style={{ height: '1px' }}></div>
    </AppContainer>
  );
}
