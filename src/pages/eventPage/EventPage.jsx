import { useEffect, useState, useRef, useCallback } from 'react';
import NavigationBar from '../../components/NavigationBar';
import SearchDropBox from '../searchPage/SearchDropBox';
import SearchBar from '../../components/SearchBar';
import useUIStore from '../../store/useUIStore';
import { KtoECodes } from '../../constants/departmentCodes';
import LocationBar from '../../components/LocationBar';
import SearchEvent from '../searchPage/SearchEvent';
import { LIMITS } from '../../constants/appConstants';
import { getEventsByCategory } from '../../services/api/event';

export default function EventPage() {
  const {
    savedKeyword,
    setSavedKeyword,
    savedOption1,
    setSavedOption1,
    savedOption2,
    setSavedOption2,
  } = useUIStore((state) => ({
    savedKeyword: state.savedKeyword,
    setSavedKeyword: state.setSavedKeyword,
    savedOption1: state.savedOption1,
    setSavedOption1: state.setSavedOption1,
    savedOption2: state.savedOption2,
    setSavedOption2: state.setSavedOption2,
  }));

  const [keyword, setKeyword] = useState(savedKeyword);
  const [option1, setOption1] = useState(savedOption1);
  const [option2, setOption2] = useState(savedOption2);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isError, setIsError] = useState(false);
  const pageSize = LIMITS.PAGE_SIZE;
  const bottomRef = useRef(null);

  const fetchData = useCallback(async () => {
    if (loading || !hasMore || isError) return;
    setLoading(true);
    try {
      const response = await getEventsByCategory(KtoECodes[option2], page, pageSize, keyword);
      const newEvents = response.data.result;
      setEvents((prevEvents) => {
        const eventIds = new Set(prevEvents.map((event) => event.eventId));
        const filteredEvents = newEvents.filter((event) => !eventIds.has(event.eventId));
        return [...prevEvents, ...filteredEvents];
      });
      if (response.data.hasNext) {
        setPage((prevPage) => prevPage + 1);
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, isError, page, pageSize, option2, keyword]);

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
      <div className="flex w-full overflow-x-hidden items-center flex-col pb-20">
        <LocationBar location="전체 이벤트 검색" />
        <div className="w-full bg-white">
          <SearchDropBox
            setPage={setPage}
            setEvents={setEvents}
            setHasMore={setHasMore}
            fetchData={fetchData}
            option1={option1}
            setOption1={setOption1}
            option2={option2}
            setOption2={(newOption2) => {
              setOption2(newOption2);
              setPage(0);
              setHasMore(true);
            }}
            savedOption1={savedOption1}
            setSavedOption1={setSavedOption1}
            savedOption2={savedOption2}
            setSavedOption2={setSavedOption2}
          />
          <SearchBar
            keyword={keyword}
            setKeyword={setKeyword}
            setPage={setPage}
            setEvents={setEvents}
            setSavedKeyword={setSavedKeyword}
            setHasMore={setHasMore}
          />
        </div>
        <div className="w-full bg-white mt-2">
          <SearchEvent
            events={events}
            bottomRef={bottomRef}
            loading={loading}
            hasMore={hasMore}
            isError={isError}
          />
        </div>
      </div>
      <NavigationBar />
    </div>
  );
}
