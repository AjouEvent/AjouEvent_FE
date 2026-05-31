import { useState, useRef, useCallback, useEffect } from 'react';

const useCarousel = (length, autoAdvance = false) => {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef(null);
  const intervalRef = useRef(null);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % Math.max(length, 1));
  }, [length]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + Math.max(length, 1)) % Math.max(length, 1));
  }, [length]);

  const resetTimer = useCallback(() => {
    if (!autoAdvance) return;
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(next, 3000);
  }, [autoAdvance, next]);

  useEffect(() => {
    if (!autoAdvance || length <= 1) return;
    intervalRef.current = setInterval(next, 3000);
    return () => clearInterval(intervalRef.current);
  }, [length, next, autoAdvance]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) {
      delta > 0 ? next() : prev();
      resetTimer();
    }
    touchStartX.current = null;
  };

  return { index, setIndex, next, prev, handleTouchStart, handleTouchEnd, resetTimer, intervalRef };
};

export default useCarousel;
