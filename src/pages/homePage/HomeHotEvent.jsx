import { useState, useEffect } from 'react';
import EventCard from '../../components/events/EventCard';
import { getPopularEvents } from '../../services/api/event';

export default function HomeHotEvent() {
  const [events, setEvents] = useState([]);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadHotEvent = async () => {
      if (isError || loading) return;
      setLoading(true);
      try {
        const response = await getPopularEvents();
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
        setIsError(true);
      } finally {
        setLoading(false);
      }
    };
    loadHotEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex justify-between flex-wrap w-full px-6 py-1 gap-2">
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
      </div>
      {isError && <p className="text-red-500 text-sm px-6">서버 에러</p>}
    </>
  );
}
