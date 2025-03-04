import { useState, useEffect } from 'react';
import styled from 'styled-components';
import requestWithAccessToken from '../../services/jwt/requestWithAccessToken';
import EventCard from '../../components/events/EventCard';

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
  padding: 0.25rem 1.5rem;
  gap: 0.5rem;
`;

export default function HomeHotEvent() {
  const [events, setEvents] = useState([]);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const loadHotEvent = async () => {
      if (isError || loading) return;

      setLoading(true);
      try {
        const response = await requestWithAccessToken(
          'get',
          `${process.env.REACT_APP_BE_URL}/api/event/popular`,
        );
        const newEvents = response.data;

        setEvents(newEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
        setIsError(true);
      } finally {
        setLoading(false);
      }
    };
    loadHotEvent();
  }, []);

  return (
    <>
      <FlexContainer>
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
      </FlexContainer>
      {isError && <p>서버 에러</p>}
    </>
  );
}
