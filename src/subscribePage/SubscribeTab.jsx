import React, { useEffect, useState, useRef, useCallback } from "react";
import useStore from "../store/useStore";
import styled from "styled-components";
import SubscribeBar from "./SubscribeBar";
import requestWithAccessToken from "../JWTToken/requestWithAccessToken";
import SubscribeEvent from "./SubscribeEvent";
import SearchBar from "../components/SearchBar";

const AppContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #ffffff;
`;

export default function SubscribeTab() {
    const { savedKeyword, setSavedKeyword } = useStore((state) => ({
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
  const pageSize = 10;
  const bottomRef = useRef(null);

  const accessToken = localStorage.getItem("accessToken");

     // 서버에서 읽음 상태를 받아와서 갱신하는 함수
  const fetchReadStatus = async () => {
    try {
      const response = await requestWithAccessToken("get", `${process.env.REACT_APP_BE_URL}/api/users/readStatus`);
      console.log("읽음 상태 받아옴:", response.data);
    } catch (error) {
      console.error("읽음 상태 갱신 오류:", error);
    }
  };

  useEffect(() => {
    fetchReadStatus(); // 컴포넌트 마운트 시 읽음 상태 확인
  }, []);


  const fetchData = useCallback(async () => {
    if (loading || !hasMore || isError) return;

    setLoading(true);

    try {
      const url = selectedTopic
        ? `${process.env.REACT_APP_BE_URL}/api/event/${encodeURIComponent(selectedTopic)}?page=${page}&size=${pageSize}&keyword=${keyword}`
        : `${process.env.REACT_APP_BE_URL}/api/event/subscribed?page=${page}&size=${pageSize}&keyword=${keyword}`;

      console.log("호출하는 url", url);
      const response = await requestWithAccessToken("get", url);
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
      setIsError(true);
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, isError, page, keyword, selectedTopic]);

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
    

    const handleTopicSelect = (topic) => {
      if (selectedTopic === topic) {
        setSelectedTopic(null);  
      } else {
        setSelectedTopic(topic); 
        fetchReadStatus(); // 토픽을 선택할 때 읽음 상태를 갱신
      }
      setPage(0); 
      setEvents([]);
      setHasMore(true); 
    };

  useEffect(() => {
    fetchData(selectedTopic); // Topic이나 페이지 변경 시 데이터 재로드
    fetchReadStatus(); // 토픽을 선택할 때 읽음 상태를 갱신
  }, [selectedTopic]);

    return (
        <AppContainer>
            <SubscribeBar 
              onTopicSelect={handleTopicSelect} />
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
        </AppContainer>
    );
}
