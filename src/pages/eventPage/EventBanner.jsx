import React from 'react';
import useCarousel from '../../hooks/useCarousel';

export default function EventBanner({ images, onImageClick }) {
  const { index, setIndex, next, prev, handleTouchStart, handleTouchEnd } = useCarousel(
    images?.length ?? 0,
  );

  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col items-center justify-center bg-white w-full h-[100vw]">
      <div
        className="relative w-full h-[100vw] overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex h-full transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {images.map((src, idx) => (
            <div key={idx} className="min-w-full h-full flex-shrink-0">
              <img
                src={src}
                alt={`Slide ${idx + 1}`}
                className="w-full h-full object-contain cursor-pointer"
                onClick={() => onImageClick(idx)}
              />
            </div>
          ))}
        </div>

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
                  ? 'bg-[#434a52] w-5 h-[15px] opacity-100'
                  : 'bg-gray-400 w-2.5 h-2.5 opacity-50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
