import { useEffect, useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import NavigationBar from '../../components/NavigationBar';
import SearchDropBox from './SearchDropBox';
import SearchBar from '../../components/SearchBar';
import useUIStore from '../../store/useUIStore';
import { KtoECodes } from '../../constant/departmentCodes';
import LocationBar from '../../components/LocationBar';
import SearchEvent from './SearchEvent';
import { LIMITS, COLORS } from '../../constant/appConstants';
import { getEventsByCategory } from '../../services/api/event';

const AppContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${COLORS.WHITE};
`;

const MainContentContaioner = styled.div`
  display: flex;
  width: 100vw;
  overflow-x: hidden;
  align-items: center;
  flex-direction: column;
  padding: 0 0 80px 0;
`;

export default function SearchEventPage() {
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
        const filteredEvents = newEvents.filter(
          (event) => !eventIds.has(event.eventId),
        );
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
  }, [loading, hasMore, page, option2, keyword]);

  // Handle infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          fetchData();
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
  }, [loading, hasMore, fetchData]);

  return (
    <AppContainer>
      <MainContentContaioner>
        <LocationBar location="전체 이벤트 검색" />
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
        <SearchEvent
          events={events}
          bottomRef={bottomRef}
          loading={loading}
          hasMore={hasMore}
          isError={isError}
        />
      </MainContentContaioner>
      <NavigationBar />
    </AppContainer>
  );
}