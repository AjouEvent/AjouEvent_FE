import { useEffect, useState, useRef, useCallback } from 'react';
import LikedEvent from './LikedEvent';
import NavigationBar from '../../components/NavigationBar';
import SearchBar from '../../components/SearchBar';
import LocationBar from '../../components/LocationBar';
import useUIStore from '../../store/useUIStore';
import { Link } from 'react-router-dom';
import { LIMITS, STORAGE_KEYS } from '../../constants/appConstants';
import { getLikedEvents } from '../../services/api/event';

export default function LikedEventPage() {
  const { savedKeyword, setSavedKeyword } = useUIStore((state) => ({
    savedKeyword: state.savedKeyword,
    setSavedKeyword: state.setSavedKeyword,
  }));
  const [keyword, setKeyword] = useState(savedKeyword);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = LIMITS.PAGE_SIZE;
  const bottomRef = useRef(null);
  const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

  const fetchData = useCallback(async () => {
    if (loading || !hasMore || isError) return;
    setLoading(true);
    try {
      const response = await getLikedEvents(page, pageSize, keyword);
      const newEvents = response.data.result;
      setEvents((prevEvents) => {
        const eventIds = new Set(prevEvents.map((event) => event.eventId));
        const filteredEvents = newEvents.filter((event) => !eventIds.has(event.eventId));
        return [...prevEvents, ...filteredEvents];
      });
      if (response.data.hasNext) setPage((prevPage) => prevPage + 1);
      else setHasMore(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, isError, page, pageSize, keyword]);

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

  return (
    <div className="flex items-center flex-col bg-white">
      {accessToken ? (
        <div className="flex w-screen overflow-x-hidden items-center flex-col pb-20">
          <LocationBar location="내가 찜한 이벤트" />
          <SearchBar
            keyword={keyword}
            setKeyword={setKeyword}
            setPage={setPage}
            setEvents={setEvents}
            setSavedKeyword={setSavedKeyword}
            setHasMore={setHasMore}
            fetchData={fetchData}
          />
          <LikedEvent events={events} bottomRef={bottomRef} loading={loading} hasMore={hasMore} />
        </div>
      ) : (
        <div className="flex items-center justify-center flex-col bg-white h-screen">
          <p>로그인이 필요한 서비스입니다</p>
          <Link
            to="/login"
            className="flex flex-wrap items-center justify-center bg-white rounded-lg border border-gray-400 w-24 h-[1.4rem] text-black text-sm no-underline mx-4"
          >
            로그인
          </Link>
        </div>
      )}
      <NavigationBar />
    </div>
  );
}
