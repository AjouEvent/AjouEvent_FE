import React from 'react';
import NotificationCard from './NotificationCard';
import usePagination from '../../hooks/usePagination';
import styled from 'styled-components';

const MessageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: start;
  width: 100%;
  height: 100%;
  font-family: 'Pretendard Variable', serif;
  font-size: 16px;
  font-weight: 600;
  color: gray;
  padding: 16px;
`;

const NotificationList = ({ apiUrl }) => {
  const { data, loading, isError, observerRef, hasNext } =
    usePagination(apiUrl);

  return (
    <>
      {data.map((notification) => (
        <NotificationCard key={notification.id} {...notification} />
      ))}
      <div ref={observerRef} style={{ height: 10 }}></div>
      {loading && <MessageContainer>알림 불러오는 중...</MessageContainer>}
      {!loading && isError && (
        <MessageContainer>Error fetching notifications</MessageContainer>
      )}
      {!loading && !isError && !hasNext && (
        <MessageContainer>알림이 없습니다.</MessageContainer>
      )}
    </>
  );
};

export default React.memo(NotificationList); // ✅ React.memo로 불필요한 리렌더링 방지
