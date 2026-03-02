import { useRef, useState, useEffect, useCallback } from 'react';
import type { Category } from '../../types';
import { ImageWithSkeleton } from '../../../../shared/ui/ImageWithSkeleton';

interface CategoryListProps {
  categories: Category[];
  activeCategoryId?: string | null;
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

export function CategoryList({ categories, activeCategoryId, onSelect }: CategoryListProps) {
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
            isActive={activeCategoryId === cat.id}
            icon={CATEGORY_ICONS[cat.slug] ?? DEFAULT_ICON}
            onSelect={onSelect}
          />
        ))}
      </div>

      {/* Dots */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToPage(i)}
              className={`cursor-pointer rounded-full transition-all duration-300 ${
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
  isActive?: boolean;
  onSelect?: (cat: import('../../types').Category) => void;
}

function CategoryItem({ cat, icon, isActive, onSelect }: CategoryItemProps) {
  const [hovered, setHovered] = useState(false);
  const bgColor = isActive ? '#dbeafe' : (hovered ? '#e5e7eb' : '#f3f4f6');
  const outlineColor = isActive ? '#3b82f6' : (hovered ? '#d1d5db' : 'transparent');
  const textColor = isActive ? '#1d4ed8' : (hovered ? '#111827' : '#374151');

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
        padding: 'clamp(0.25rem, 1vw, 0.5rem)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        transform: hovered || isActive ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'transform 0.2s ease',
      }}
    >
      <div
        style={{
          width: 'clamp(4.5rem, 12vw, 7rem)',
          height: 'clamp(4.5rem, 12vw, 7rem)',
          borderRadius: '9999px',
          backgroundColor: bgColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: cat.imageUrl ? undefined : '3rem',
          boxShadow: hovered || isActive
            ? '0 6px 20px rgba(0, 0, 0, 0.13)'
            : '0 1px 3px rgba(0, 0, 0, 0.05)',
          outline: `2px solid ${outlineColor}`,
          outlineOffset: '2px', // slightly tighter outline
          overflow: 'hidden',
          transition: 'background-color 0.2s ease, box-shadow 0.2s ease, outline-color 0.2s ease',
        }}
      >
        {cat.imageUrl ? (
          <ImageWithSkeleton
            src={cat.imageUrl.startsWith('http') ? cat.imageUrl : `http://localhost:3000/uploads/${cat.imageUrl}`}
            alt={cat.name}
            className="w-full h-full object-contain p-2"
          />
        ) : (
          icon
        )}
      </div>
      <span
        style={{
          fontSize: 'clamp(0.65rem, 2vw, 0.875rem)',
          fontWeight: isActive ? 600 : 500,
          color: textColor,
          transition: 'color 0.2s ease, font-weight 0.2s ease',
        }}
      >
        {cat.name}
      </span>
    </button>
  );
}
