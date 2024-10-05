import { useEffect, useState, useRef, useCallback } from "react";
import styled from "styled-components";
import LikedEvent from "./LikedEvent";
import NavigationBar from "../components/NavigationBar";
import SearchBar from "../components/SearchBar";
import LocationBar from "../components/LocationBar";
import useStore from "../store/useStore";
import { Link } from "react-router-dom";
import requestWithAccessToken from "../JWTToken/requestWithAccessToken";

const AppContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #ffffff;
`;

const Contaioner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #ffffff;
  height: 100vh;
`;

const MainContentContaioner = styled.div`
  display: flex;
  width: 100vw;
  overflow-x: hidden;
  align-items: center;
  flex-direction: column;
  padding: 0 0 80px 0;
`;

const StyledLink = styled(Link)`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.bgcolor};
  border-radius: 0.5rem;
  border: 1px solid gray;
  width: 6rem;
  height: 1.4rem;
  color: ${(props) => props.color};
  font-size: 0.8rem;
  text-decoration: none;
  margin: 0 1rem 0 1rem;
`;

export default function LikedEventPage() {
  const { savedKeyword, setSavedKeyword } = useStore((state) => ({
    savedKeyword: state.savedKeyword,
    setSavedKeyword: state.setSavedKeyword,
  }));
  const [keyword, setKeyword] = useState(savedKeyword);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 10;
  const bottomRef = useRef(null);

  const accessToken = localStorage.getItem("accessToken");

  const fetchData = useCallback(async () => {
    if (loading || !hasMore || isError) return;

    setLoading(true);

    try {

      const response = await requestWithAccessToken(
        "get",
        `${process.env.REACT_APP_BE_URL}/api/event/liked?AjouNormal&page=${page}&size=${pageSize}&keyword=${keyword}`
      );
      const newEvents = response.data.result;

      setEvents((prevEvents) => {
        const eventIds = new Set(prevEvents.map((event) => event.eventId));
        const filteredEvents = newEvents.filter(
          (event) => !eventIds.has(event.eventId)
        );
        return [...prevEvents, ...filteredEvents];
      });

      if (response.data.hasNext) {
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, keyword]);

  // Handle infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          fetchData();
        }
      },
      { threshold: 1 }
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
      {accessToken ? (
        <MainContentContaioner>
          <LocationBar location="내가 찜한 이벤트"></LocationBar>
          <SearchBar
            keyword={keyword}
            setKeyword={setKeyword}
            setPage={setPage}
            setEvents={setEvents}
            setSavedKeyword={setSavedKeyword}
            setHasMore={setHasMore}
            fetchData={fetchData}
          />
          <LikedEvent
            events={events}
            bottomRef={bottomRef}
            loading={loading}
            hasMore={hasMore}
          />
        </MainContentContaioner>
      ) : (
        <Contaioner>
          <p>로그인이 필요한 서비스입니다</p>
          <StyledLink bgcolor={"white"} color={"black"} to="/login">
            로그인
          </StyledLink>
        </Contaioner>
      )}
      <NavigationBar />
    </AppContainer>
  );
}
