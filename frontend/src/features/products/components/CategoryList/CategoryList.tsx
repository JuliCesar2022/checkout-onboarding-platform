import { useRef, useState, useEffect, useCallback } from 'react';
import type { Category } from '../../types';

interface CategoryListProps {
  categories: Category[];
  onSelect?: (category: Category) => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  HARDWARE: '🖥️',
  PLAYSTATION: '🎮',
  XBOX: '🟢',
  NINTENDO: '🔴',
  'GAMING LAPTOPS': '💻',
  ACCESORIOS: '🎧',
  MACBOOKS: '🍎',
  CELULARES: '📱',
  'REALIDAD VIRTUAL': '🥽',
  // legacy
  AUDIO: '🎧',
  PERIPHERALS: '⌨️',
  NETWORKING: '🌐',
};

const DEFAULT_ICON = '📦';

export function CategoryList({ categories, onSelect }: CategoryListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Calcula cuántos items caben visibles y el total de "páginas"
  const recalcPages = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const pageWidth = el.clientWidth;
    const pages = Math.max(1, Math.ceil(el.scrollWidth / pageWidth));
    setTotalPages(pages);
    const current = Math.round(el.scrollLeft / pageWidth);
    setActivePage(current);
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    recalcPages();
    const el = scrollRef.current;
    el?.addEventListener('scroll', recalcPages, { passive: true });
    window.addEventListener('resize', recalcPages);
    return () => {
      el?.removeEventListener('scroll', recalcPages);
      window.removeEventListener('resize', recalcPages);
    };
  }, [categories, recalcPages]);

  const scrollToPage = (page: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: page * el.clientWidth, behavior: 'smooth' });
  };

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const pageWidth = el.clientWidth;
    el.scrollBy({ left: dir === 'left' ? -pageWidth : pageWidth, behavior: 'smooth' });
  };

  if (categories.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Row: arrow + items + arrow */}
      <div className="relative flex items-center gap-2">
        {/* Left arrow */}
        <button
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          className="flex-shrink-0 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-400 disabled:opacity-0 disabled:pointer-events-none transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Scrollable strip */}
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((cat) => {
            const icon = CATEGORY_ICONS[cat.slug] ?? DEFAULT_ICON;
            return (
              <button
                key={cat.id}
                onClick={() => onSelect?.(cat)}
                className="flex flex-col items-center gap-3 flex-shrink-0 group p-2"
              >
                <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center text-5xl group-hover:ring-2 group-hover:ring-gray-400 group-hover:ring-offset-2 transition-all">
                  {icon}
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className="flex-shrink-0 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-400 disabled:opacity-0 disabled:pointer-events-none transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Dots */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToPage(i)}
              className={`rounded-full transition-all duration-300 ${
                i === activePage
                  ? 'w-6 h-2 bg-[#222]'
                  : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
