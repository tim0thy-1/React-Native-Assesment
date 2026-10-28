import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { tokens } from '../theme/tokens';

interface ImageCarouselProps {
  images: string[];
  title: string;
  isFavorite: boolean;
  onBack: () => void;
  onToggleFavorite: () => void;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  title,
  isFavorite,
  onBack,
  onToggleFavorite,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);

  // Fallback image if array is empty
  const displayImages = images && images.length > 0 ? images : ['https://via.placeholder.com/600'];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : displayImages.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev < displayImages.length - 1 ? prev + 1 : 0));
  };

  // Touch and drag swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = startXRef.current - e.changedTouches[0].clientX;
    if (diff > 40 && activeIndex < displayImages.length - 1) {
      setActiveIndex((prev) => prev + 1);
    } else if (diff < -40 && activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const diff = startXRef.current - e.clientX;
    if (diff > 50 && activeIndex < displayImages.length - 1) {
      setActiveIndex((prev) => prev + 1);
    } else if (diff < -50 && activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className="relative w-full overflow-hidden select-none bg-neutral-100 flex items-center justify-center cursor-grab active:cursor-grabbing"
      style={{
        height: '38vh',
        minHeight: 280,
        maxHeight: 380,
      }}
    >
      {/* Floating round back button at top-left */}
      <button
        type="button"
        onClick={onBack}
        className="absolute top-4 left-4 z-20 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md transition-transform active:scale-90 hover:bg-white shadow-md cursor-pointer"
        style={{
          width: 44,
          height: 44,
          color: tokens.colors.text,
        }}
        aria-label="Go back"
      >
        <ArrowLeft size={20} color={tokens.colors.text} />
      </button>

      {/* Floating round heart button at top-right */}
      <button
        type="button"
        onClick={onToggleFavorite}
        className="absolute top-4 right-4 z-20 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md transition-transform active:scale-90 hover:bg-white shadow-md cursor-pointer"
        style={{
          width: 44,
          height: 44,
        }}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart
          size={20}
          fill={isFavorite ? tokens.colors.danger : 'none'}
          color={isFavorite ? tokens.colors.danger : tokens.colors.mutedText}
          strokeWidth={2}
        />
      </button>

      {/* Main Image Slider */}
      <div
        className="w-full h-full flex transition-transform duration-300 ease-out"
        style={{
          transform: `translateX(-${activeIndex * 100}%)`,
        }}
      >
        {displayImages.map((imgUrl, index) => (
          <div
            key={index}
            className="w-full h-full shrink-0 flex items-center justify-center bg-white p-4"
          >
            <img
              src={imgUrl}
              alt={`${title} - image ${index + 1}`}
              className="max-w-full max-h-full object-contain pointer-events-none"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>

      {/* Subtle chevron arrows if multiple images */}
      {displayImages.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 text-white flex items-center justify-center backdrop-blur-xs hover:bg-black/40 transition-colors z-10 cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 text-white flex items-center justify-center backdrop-blur-xs hover:bg-black/40 transition-colors z-10 cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* Page indicator dots at bottom */}
      {displayImages.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 z-10 flex items-center justify-center gap-1.5">
          {displayImages.map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              onClick={() => setActiveIndex(dotIdx)}
              className="transition-all duration-300 rounded-full cursor-pointer"
              style={{
                width: dotIdx === activeIndex ? 18 : 6,
                height: 6,
                backgroundColor:
                  dotIdx === activeIndex ? tokens.colors.primary : `${tokens.colors.mutedText}60`,
              }}
              aria-label={`Go to slide ${dotIdx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
