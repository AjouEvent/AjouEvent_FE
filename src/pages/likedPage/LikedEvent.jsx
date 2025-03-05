import styled from 'styled-components';
import EventCard from '../../components/events/EventCard';

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
  padding: 0.25rem 1.5rem;
  gap: 0.5rem;
`;

const MessageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: start;
  width: 100%;
  height: 100%;
  font-family: 'Pretendard Variable';
  font-size: 16px;
  font-weight: 600;
  color: gray;
  padding: 16px;
`;

const LikedEvent = ({ events, bottomRef, loading, hasMore }) => {
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
      <div ref={bottomRef} style={{ height: '1px' }}></div>
      {loading && <MessageContainer>로딩중...</MessageContainer>}
      {events.length === 0 && (
        <MessageContainer>불러올 이벤트가 없습니다.</MessageContainer>
      )}
    </>
  );
};

export default LikedEvent;
