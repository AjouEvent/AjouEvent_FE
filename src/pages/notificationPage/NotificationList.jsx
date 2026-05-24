import React from 'react';
import NotificationCard from './NotificationCard';
import usePagination from '../../hooks/usePagination';

const NotificationList = ({ apiUrl }) => {
  const { data, loading, isError, observerRef, hasNext } = usePagination(apiUrl);

  return (
    <div className="w-full">
      {data.map((notification) => (
        <NotificationCard key={notification.id} {...notification} />
      ))}
      <div ref={observerRef} style={{ height: 10 }} />
      {loading && (
        <div className="flex justify-center items-center w-full text-sm text-gray-400 font-medium p-8">
          알림 불러오는 중...
        </div>
      )}
      {!loading && isError && (
        <div className="flex justify-center items-center w-full text-sm text-red-500 font-medium p-8">
          알림을 불러오지 못했습니다.
        </div>
      )}
      {!loading && !isError && !hasNext && data.length === 0 && (
        <div className="flex flex-col justify-center items-center w-full py-20 gap-3">
          <div className="w-14 h-14 rounded-full bg-[#F2F4F6] flex items-center justify-center">
            <img
              src={`${process.env.PUBLIC_URL}/icons/notification.svg`}
              alt="empty"
              className="w-6 h-6 opacity-30"
            />
          </div>
          <p className="text-[#B0B8C1] text-sm font-semibold m-0">알림이 없습니다</p>
        </div>
      )}
    </div>
  );
};

export default React.memo(NotificationList);
