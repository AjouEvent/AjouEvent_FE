import EventCard, { EventCardSkeleton } from '../../components/EventCard';

const LikedEvent = ({ events, bottomRef, loading, hasMore }) => {
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
  );
};

export default LikedEvent;
