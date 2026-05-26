import React, { useEffect, useState, useRef, useCallback } from 'react';
import useUIStore from '../../store/useUIStore';
import SubscribeBar from './SubscribeBar';
import SubscribeEvent from './SubscribeEvent';
import { getEventsByCategory, getSubscribedEvents } from '../../services/api/event';
import SearchBar from '../../components/layout/SearchBar';
import { LIMITS } from '../../constants/appConstants';

export default function SubscribeTab({ showGuide }) {
  const { savedKeyword, setSavedKeyword } = useUIStore((state) => ({
    savedKeyword: state.savedKeyword,
    setSavedKeyword: state.setSavedKeyword,
  }));

  const [keyword, setKeyword] = useState(savedKeyword);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isError, setIsError] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const pageSize = LIMITS.PAGE_SIZE;
  const bottomRef = useRef(null);

  const fetchData = useCallback(async () => {
    if (loading || !hasMore || isError) return;
    setLoading(true);
    try {
      const response = selectedTopic
        ? await getEventsByCategory(selectedTopic, page, pageSize, keyword)
        : await getSubscribedEvents(page, pageSize, keyword);
      const newEvents = response.data.result;
      setEvents((prevEvents) => {
        const eventIds = new Set(prevEvents.map((event) => event.eventId));
        const filteredEvents = newEvents.filter((event) => !eventIds.has(event.eventId));
        return [...prevEvents, ...filteredEvents];
      });
      if (response.data.hasNext) setPage((prevPage) => prevPage + 1);
      else setHasMore(false);
    } catch (error) {
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, isError, page, pageSize, keyword, selectedTopic]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) fetchData();
      },
      { threshold: 1 },
    );
    const currentRef = bottomRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, [loading, hasMore, fetchData]);

  const handleTopicSelect = (topic) => {
    setSelectedTopic(selectedTopic === topic ? null : topic);
    setPage(0);
    setEvents([]);
    setHasMore(true);
  };

  useEffect(() => {
    fetchData(selectedTopic);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTopic]);

  return (
    <div className="flex items-center flex-col bg-white">
      <SubscribeBar onTopicSelect={handleTopicSelect} showGuide={showGuide} />
      <SearchBar
        keyword={keyword}
        setKeyword={setKeyword}
        setPage={setPage}
        setEvents={setEvents}
        setSavedKeyword={setSavedKeyword}
        setHasMore={setHasMore}
        fetchData={fetchData}
      />
      <SubscribeEvent
        events={events}
        bottomRef={bottomRef}
        loading={loading}
        hasMore={hasMore}
        isError={isError}
      />
    </div>
  );
}
