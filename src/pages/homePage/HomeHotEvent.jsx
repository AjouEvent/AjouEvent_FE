import { useState, useEffect } from 'react';
import EventCard from '../../components/EventCard';
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
          <div key={i} className="flex items-center gap-3.5 px-5 py-4 border-b border-[#F5F6F8]">
            <div className="w-[62px] h-[62px] rounded-xl bg-[#F2F4F6] animate-pulse flex-shrink-0" />
            <div className="flex flex-col flex-1 gap-2">
              <div className="h-3.5 bg-[#F2F4F6] rounded-lg animate-pulse w-4/5" />
              <div className="h-3 bg-[#F2F4F6] rounded-lg animate-pulse w-3/5" />
              <div className="h-2.5 bg-[#F2F4F6] rounded-md animate-pulse w-1/3" />
            </div>
          </div>
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
