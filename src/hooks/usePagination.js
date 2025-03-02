import { useState, useRef, useEffect, useCallback } from 'react';
import requestWithAccessToken from '../services/jwt/requestWithAccessToken';

const usePagination = (apiUrl, pageSize = 10) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(true);
  const [isError, setIsError] = useState(false);
  const observerRef = useRef(null);

  // 데이터 가져오는 함수
  const fetchData = useCallback(async () => {
    if (!hasNext || loading || isError) return;

    setLoading(true);
    try {
      const response = await requestWithAccessToken(
        'get',
        `${apiUrl}?page=${page}&size=${pageSize}`,
      );
      const newData = response.data.result;

      setData((prevData) => {
        const existingIds = new Set(prevData.map((item) => item.id));
        const filteredNewData = newData.filter(
          (item) => !existingIds.has(item.id),
        );
        return [...prevData, ...filteredNewData];
      });

      if (response.data.hasNext) {
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasNext(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, page, hasNext, loading, isError, pageSize]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasNext) {
          fetchData();
        }
      },
      { threshold: 1 },
    );

    const ref = observerRef.current;
    if (ref) {
      observer.observe(ref);
    }

    return () => {
      if (ref) {
        observer.unobserve(ref);
      }
    };
  }, [loading, hasNext, fetchData]);

  return { data, loading, isError, observerRef, hasNext };
};

export default usePagination;
