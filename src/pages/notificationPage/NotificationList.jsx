import React from 'react';
import NotificationCard from './NotificationCard';
import usePagination from '../../hooks/usePagination';

const NotificationList = ({ apiUrl }) => {
  const { data, loading, isError, observerRef, hasNext } = usePagination(apiUrl);

  return (
    <>
      {data.map((notification) => (
        <NotificationCard key={notification.id} {...notification} />
      ))}
      <div ref={observerRef} style={{ height: 10 }} />
      {loading && (
        <div className="flex justify-center items-start w-full text-base font-semibold text-gray-400 p-4">
          알림 불러오는 중...
        </div>
      )}
      {!loading && isError && (
        <div className="flex justify-center items-start w-full text-base font-semibold text-gray-400 p-4">
          Error fetching notifications
        </div>
      )}
      {!loading && !isError && !hasNext && (
        <div className="flex justify-center items-start w-full text-base font-semibold text-gray-400 p-4">
          알림이 없습니다.
        </div>
      )}
    </>
  );
};

export default React.memo(NotificationList);
