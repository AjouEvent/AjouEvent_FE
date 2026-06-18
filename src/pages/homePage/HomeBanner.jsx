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
    return (
      <div className="w-full px-4 pt-3 pb-1 bg-white">
        <div className="w-full aspect-square md:aspect-[4/3] bg-gradient-to-br from-[#F2F4F6] to-[#E5E8EB] rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white px-4 pt-3 pb-1">
      <div
        className="relative h-full w-full aspect-square md:aspect-[4/3] overflow-hidden rounded-2xl shadow-sm"
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
                className="w-full h-full object-cover"
                fetchpriority={idx === 0 ? 'high' : 'low'}
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none rounded-2xl" />

        <div className="absolute bottom-3 right-3 bg-black/35 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-[11px] font-semibold">
          {index + 1} / {images.length}
        </div>

        {images.length > 1 && (
          <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`rounded-full transition-all duration-300 ${
                  idx === index ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
