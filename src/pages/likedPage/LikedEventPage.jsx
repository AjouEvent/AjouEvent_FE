import { useEffect, useState, useRef, useCallback } from 'react';
import EventCard, { EventCardSkeleton } from '../../components/EventCard';
import NavigationBar from '../../components/layout/NavigationBar';
import SearchBar from '../../components/layout/SearchBar';
import LocationBar from '../../components/layout/LocationBar';
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
    <div className="flex items-center flex-col bg-[#F9FAFB] min-h-screen">
      {accessToken ? (
        <div className="flex w-full overflow-x-hidden items-center flex-col pb-20">
          <LocationBar location="내가 찜한 이벤트" />
          <div className="w-full bg-white">
            <SearchBar
              keyword={keyword}
              setKeyword={setKeyword}
              setPage={setPage}
              setEvents={setEvents}
              setSavedKeyword={setSavedKeyword}
              setHasMore={setHasMore}
              fetchData={fetchData}
            />
          </div>
          <div className="w-full bg-white mt-2">
            {events.map((event, index) => (
              <EventCard
                key={`${event.eventId}-${index}`}
                id={event.eventId}
                title={event.title}
                subject={event.subject}
                content={event.content}
                imgUrl={event.imgUrl}
                likesCount={event.likesCount}
                viewCount={event.viewCount}
                star={event.star}
              />
            ))}
            <div ref={bottomRef} style={{ height: '1px' }} />
            {loading && (
              <>
                <EventCardSkeleton />
                <EventCardSkeleton />
                <EventCardSkeleton />
              </>
            )}
            {!loading && events.length === 0 && (
              <div className="flex justify-center items-center w-full text-sm text-[#B0B8C1] font-medium p-12">
                불러올 이벤트가 없습니다.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <p className="text-[#6B7684] text-sm m-0">로그인이 필요한 서비스입니다</p>
          <Link
            to="/login"
            className="flex items-center justify-center bg-[#3182F6] hover:bg-[#1B6EE8] rounded-xl px-6 py-3 text-white text-sm font-semibold no-underline transition-colors"
          >
            로그인
          </Link>
        </div>
      )}
      <NavigationBar />
    </div>
  );
}
