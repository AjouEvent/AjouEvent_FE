import { useRef, useEffect } from 'react';

const useInfiniteScroll = (fetchData, loading, hasMore) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) fetchData();
      },
      { threshold: 1 },
    );
    const ref = bottomRef.current;
    if (ref) observer.observe(ref);
    return () => {
      if (ref) observer.unobserve(ref);
    };
  }, [loading, hasMore, fetchData]);

  return bottomRef;
};

export default useInfiniteScroll;
