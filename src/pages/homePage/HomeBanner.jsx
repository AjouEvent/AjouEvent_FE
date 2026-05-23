import React, { useState, useEffect, useRef, useCallback } from 'react';

export default function HomeBanner({ images }) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef(null);
  const intervalRef = useRef(null);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % Math.max(images.length, 1));
  }, [images.length]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + Math.max(images.length, 1)) % Math.max(images.length, 1));
  }, [images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    intervalRef.current = setInterval(next, 3000);
    return () => clearInterval(intervalRef.current);
  }, [images.length, next]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) {
      delta > 0 ? next() : prev();
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(next, 3000);
    }
    touchStartX.current = null;
  };

  const handleClick = (url) => {
    window.location.href = url;
  };

  if (!Array.isArray(images) || images.length === 0) {
    return <div className="w-full h-[100vw] bg-gray-100" />;
  }

  return (
    <div className="flex flex-col items-center justify-center bg-white h-[100vw] w-full">
      <div
        className="relative w-full h-[100vw] overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex h-full transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {images.map((image, idx) => (
            <div
              key={idx}
              className="min-w-full h-full flex-shrink-0 cursor-pointer"
              onClick={() => handleClick(image.siteUrl)}
            >
              <img
                src={image.imgUrl}
                alt={`Slide ${idx + 1}`}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>

        <div className="absolute bottom-2.5 right-2.5 bg-black/50 text-white px-2.5 py-1 rounded text-sm">
          {index + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}
