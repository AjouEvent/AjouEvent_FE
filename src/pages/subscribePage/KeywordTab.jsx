import React, { useEffect, useState, useRef } from 'react';
import KeywordBar from './KeywordBar';
import SearchBar from '../../components/SearchBar';
import EventCard from '../../components/events/EventCard';
import { getPostsByKeyword } from '../../services/api/event';
import { LIMITS } from '../../constants/appConstants';

export default function KeywordTab({ showGuide }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isError, setIsError] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const pageSize = LIMITS.PAGE_SIZE;
  const bottomRef = useRef(null);

  const handleKeywordSelect = (keyword) => {
    setSelectedKeyword(keyword);
    setHasMore(true);
    setEvents([]);
    setPage(0);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!hasMore || loading || page < 0) return;
      setLoading(true);
      setIsError(false);
      try {
        const response = await getPostsByKeyword(selectedKeyword?.encodedKeyword, page, pageSize);
        const newEvents = response.data.result;
        setEvents((prevEvents) => (page === 0 ? newEvents : [...prevEvents, ...newEvents]));
        if (newEvents.length < pageSize) setHasMore(false);
      } catch (error) {
        setIsError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, selectedKeyword]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) setPage((prev) => prev + 1);
      },
      { threshold: 1 },
    );
    const currentRef = bottomRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, [hasMore, loading]);

  return (
    <div className="flex items-center flex-col bg-white">
      <KeywordBar onKeywordSelect={handleKeywordSelect} showGuide={showGuide} />
      <SearchBar setKeyword={setSelectedKeyword} />
      <div className="flex justify-between flex-wrap w-full px-6 py-1 gap-2">
        {events.map((event, index) => (
          <EventCard
            key={`${event.eventId}-${index}`}
            id={event.eventId}
            {...event}
          />
        ))}
      </div>
      {loading && (
        <div className="flex justify-center items-start w-full text-base font-semibold text-gray-400 p-4">
          로딩중...
        </div>
      )}
      {isError && (
        <div className="flex justify-center items-start w-full text-base font-semibold text-gray-400 p-4">
          서버 에러
        </div>
      )}
      <div ref={bottomRef} style={{ height: '1px' }} />
    </div>
  );
}
