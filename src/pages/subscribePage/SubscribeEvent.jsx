import EventCard from '../../components/events/EventCard';

const SubscribeEvent = ({ events, bottomRef, loading, hasMore, isError }) => {
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
      <div ref={bottomRef} style={{ height: '1px' }} />
      {loading && (
        <div className="flex justify-center items-start w-full text-base font-semibold text-gray-400 p-4">
          로딩중...
        </div>
      )}
      {!hasMore && (
        <div className="flex justify-center items-start w-full text-base font-semibold text-gray-400 p-4">
          불러올 이벤트가 없습니다.
        </div>
      )}
      {isError && (
        <div className="flex justify-center items-start w-full text-base font-semibold text-gray-400 p-4">
          서버 에러
        </div>
      )}
    </>
  );
};

export default SubscribeEvent;
