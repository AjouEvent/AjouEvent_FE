import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { likeEvent, unlikeEvent } from '../services/api/event';

const useEventLike = (eventId, initialLiked = false, initialCount = 0) => {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    setIsLiked(initialLiked);
    setCount(initialCount);
  }, [initialLiked, initialCount]);

  const toggleLike = async (e) => {
    if (e?.stopPropagation) e.stopPropagation();
    try {
      if (isLiked) {
        await unlikeEvent(eventId);
        setIsLiked(false);
        setCount((c) => c - 1);
      } else {
        await likeEvent(eventId);
        setIsLiked(true);
        setCount((c) => c + 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('좋아요 에러', { description: '로그인이 필요한 기능입니다.' });
    }
  };

  return { isLiked, count, toggleLike };
};

export default useEventLike;
