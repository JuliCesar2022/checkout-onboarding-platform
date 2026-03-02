import { useState, useRef, useCallback } from 'react';
import { ImageWithSkeleton } from '../ImageWithSkeleton';
import { Lightbox } from '../Lightbox/Lightbox';

interface ImageCarouselProps {
  images: string[];
  alt: string;
  className?: string;
  /** Stop click propagation on nav controls (e.g. inside a clickable card) */
  stopPropagation?: boolean;
  /** Show thumbnail strip below the main image instead of dot indicators */
  showThumbnails?: boolean;
}

export function ImageCarousel({
  images,
  alt,
  className = '',
  stopPropagation = false,
  showThumbnails = false,
}: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const total = images.length;

  const prev = useCallback((e?: React.MouseEvent) => {
    if (stopPropagation) e?.stopPropagation();
    setCurrent((c) => (c - 1 + total) % total);
  }, [total, stopPropagation]);

  const next = useCallback((e?: React.MouseEvent) => {
    if (stopPropagation) e?.stopPropagation();
    setCurrent((c) => (c + 1) % total);
  }, [total, stopPropagation]);

  const goTo = useCallback((idx: number, e?: React.MouseEvent) => {
    if (stopPropagation) e?.stopPropagation();
    setCurrent(idx);
  }, [stopPropagation]);

  const openLightbox = useCallback((e: React.MouseEvent) => {
    if (stopPropagation) e.stopPropagation();
    setLightboxOpen(true);
  }, [stopPropagation]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) {
      if (dx < 0) setCurrent((c) => (c + 1) % total);
      else setCurrent((c) => (c - 1 + total) % total);
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  if (total === 0) {
    return (
      <div className={`w-full h-full flex items-center justify-center text-gray-300 text-5xl bg-gray-50 ${className}`}>
        📦
      </div>
    );
  }

  if (total === 1) {
    return (
      <>
        <div
          className={`cursor-zoom-in ${className}`}
          onClick={openLightbox}
        >
          <ImageWithSkeleton src={images[0]} alt={alt} className="w-full h-full" />
        </div>
        {lightboxOpen && (
          <Lightbox
            images={images}
            current={0}
            alt={alt}
            onClose={() => setLightboxOpen(false)}
            onPrev={() => {}}
            onNext={() => {}}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3 w-full">
        {/* Main image */}
        <div
          className={`relative overflow-hidden select-none ${stopPropagation ? '' : 'cursor-zoom-in'} ${className}`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={stopPropagation ? undefined : openLightbox}
        >
          {/* Slides */}
          <div
            className="flex h-full transition-transform duration-300 ease-out will-change-transform"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {images.map((src, i) => (
              <div key={i} className="shrink-0 w-full h-full">
                <ImageWithSkeleton src={src} alt={`${alt} ${i + 1}`} className="w-full h-full" />
              </div>
            ))}
          </div>

          {/* Prev / Next buttons — hidden inside cards (stopPropagation), visible on detail page */}
          {!stopPropagation && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(e); }}
                aria-label="Imagen anterior"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center shadow-md transition-colors z-10"
              >
                <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(e); }}
                aria-label="Siguiente imagen"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center shadow-md transition-colors z-10"
              >
                <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Dot indicators — only when thumbnails are NOT shown */}
          {!showThumbnails && (
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); goTo(i, e); }}
                  aria-label={`Ir a imagen ${i + 1}`}
                  className={`rounded-full transition-all duration-200 ${
                    i === current
                      ? 'bg-white w-3.5 h-1.5'
                      : 'bg-white/50 w-1.5 h-1.5 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnail strip */}
        {showThumbnails && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Ver imagen ${i + 1}`}
                className={`shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200 focus:outline-none ${
                  i === current
                    ? 'border-gray-900 opacity-100 shadow-md'
                    : 'border-transparent opacity-60 hover:opacity-90 hover:border-gray-300'
                }`}
              >
                <img
                  src={src}
                  alt={`${alt} miniatura ${i + 1}`}
                  className="w-16 h-16 object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={images}
          current={current}
          alt={alt}
          onClose={() => setLightboxOpen(false)}
          onPrev={() => setCurrent((c) => (c - 1 + total) % total)}
          onNext={() => setCurrent((c) => (c + 1) % total)}
        />
      )}
    </>
  );
}
