import React, { useState } from 'react';
import { LIMITS } from '../../constants/appConstants';

function ImageModal({ images, currentIndex, onClose }) {
  const [index, setIndex] = useState(currentIndex);
  const [startX, setStartX] = useState(0);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handlePrev = () => setIndex((i) => (i > 0 ? i - 1 : images.length - 1));
  const handleNext = () => setIndex((i) => (i < images.length - 1 ? i + 1 : 0));

  const handleTouchStart = (e) => setStartX(e.touches[0].clientX);

  const handleTouchEnd = (e) => {
    const diffX = startX - e.changedTouches[0].clientX;
    if (diffX > LIMITS.SWIPE_THRESHOLD) handleNext();
    else if (diffX < -LIMITS.SWIPE_THRESHOLD) handlePrev();
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed top-0 left-0 w-full h-full bg-black/70 flex justify-center items-center z-[1000]"
    >
      <div
        className="relative max-w-[90vw] max-h-[90vh] w-auto h-auto rounded-lg overflow-auto"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={images[index]}
          alt={`슬라이드 ${index + 1}`}
          className="w-full h-full max-w-screen max-h-screen object-contain rounded-lg"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute top-1/2 left-[7px] -translate-y-1/2 bg-transparent border-none text-4xl text-white cursor-pointer outline-none z-[1001] invert-[70%]"
            >
              &lt;
            </button>
            <button
              onClick={handleNext}
              className="absolute top-1/2 right-[7px] -translate-y-1/2 bg-transparent border-none text-4xl text-white cursor-pointer outline-none z-[1001] invert-[70%]"
            >
              &gt;
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ImageModal;
