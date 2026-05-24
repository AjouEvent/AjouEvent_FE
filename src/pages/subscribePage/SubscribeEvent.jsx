import EventCard from '../../components/events/EventCard';

const SubscribeEvent = ({ events, bottomRef, loading, hasMore, isError }) => {
  return (
    <div className="w-full">
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
        <div className="flex justify-center items-center w-full text-sm text-[#B0B8C1] font-medium p-6">
          로딩중...
        </div>
      )}
      {!loading && !hasMore && events.length === 0 && (
        <div className="flex justify-center items-center w-full text-sm text-[#B0B8C1] font-medium p-12">
          불러올 이벤트가 없습니다.
        </div>
      )}
      {isError && (
        <div className="flex justify-center items-center w-full text-sm text-[#F04452] font-medium p-6">
          서버 에러
        </div>
      )}
    </div>
  );
};

export default SubscribeEvent;
