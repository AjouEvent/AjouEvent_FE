import React, { useState, useRef } from 'react';

export default function EventBanner({ images, onImageClick }) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef(null);

  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) delta > 0 ? next() : prev();
    touchStartX.current = null;
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col bg-white w-full h-full min-h-0">
      <div
        className="relative w-full flex-1 overflow-hidden min-h-0"
        style={{ WebkitTransform: 'translateZ(0)' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((src, idx) => (
          <div
            key={idx}
            className="absolute inset-0 transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(${(idx - index) * 100}%)` }}
          >
            <img
              src={src}
              alt={`Slide ${idx + 1}`}
              className="w-full h-full object-contain cursor-pointer"
              onClick={() => onImageClick(idx)}
            />
          </div>
        ))}

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg leading-none"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg leading-none"
            >
              ›
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex justify-center items-center gap-2 mt-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setIndex(idx)}
              className={`rounded-full transition-all ${
                index === idx
                  ? 'bg-[#434a52] w-5 h-[10px] opacity-100'
                  : 'bg-gray-400 w-2.5 h-1.5 opacity-50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
