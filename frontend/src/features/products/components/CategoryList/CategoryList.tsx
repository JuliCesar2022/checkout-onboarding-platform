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
          className="shrink-0 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-400 disabled:opacity-0 disabled:pointer-events-none transition-all"
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
          {categories.map((cat) => (
            <CategoryItem
              key={cat.id}
              cat={cat}
              icon={CATEGORY_ICONS[cat.slug] ?? DEFAULT_ICON}
              onSelect={onSelect}
            />
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className="shrink-0 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-400 disabled:opacity-0 disabled:pointer-events-none transition-all"
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

/* ─── Item de categoría con hover via React state ─── */
interface CategoryItemProps {
  cat: import('../../types').Category;
  icon: string;
  onSelect?: (cat: import('../../types').Category) => void;
}

function CategoryItem({ cat, icon, onSelect }: CategoryItemProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      key={cat.id}
      onClick={() => onSelect?.(cat)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem',
        flexShrink: 0,
        padding: '0.5rem',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'transform 0.2s ease',
      }}
    >
      <div
        style={{
          width: '7rem',
          height: '7rem',
          borderRadius: '9999px',
          backgroundColor: hovered ? '#e5e7eb' : '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: cat.imageUrl ? undefined : '3rem',
          boxShadow: hovered
            ? '0 6px 20px rgba(0, 0, 0, 0.13)'
            : '0 1px 3px rgba(0, 0, 0, 0.05)',
          outline: hovered ? '2px solid #d1d5db' : '2px solid transparent',
          outlineOffset: '3px',
          overflow: 'hidden',
          transition: 'background-color 0.2s ease, box-shadow 0.2s ease, outline-color 0.2s ease',
        }}
      >
        {cat.imageUrl ? (
          <img 
            src={`http://localhost:3000/uploads/${cat.imageUrl}`} 
            alt={cat.name} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'contain',
              padding: '0.5rem' // Add padding so it doesn't touch the edges
            }}
          />
        ) : (
          icon
        )}
      </div>
      <span
        style={{
          fontSize: '0.875rem',
          fontWeight: 500,
          color: hovered ? '#111827' : '#374151',
          transition: 'color 0.2s ease',
        }}
      >
        {cat.name}
      </span>
    </button>
  );
}
