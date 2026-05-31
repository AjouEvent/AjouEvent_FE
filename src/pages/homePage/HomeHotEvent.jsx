import { useState, useEffect } from 'react';
import EventCard, { EventCardSkeleton } from '../../components/EventCard';
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

  if (loading) {
    return (
      <div className="w-full bg-white mt-2">
        {[1, 2, 3].map((i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
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
      {isError && (
        <p className="text-[#F04452] text-sm px-5 py-4 font-medium">데이터를 불러오지 못했습니다</p>
      )}
    </div>
  );
}
