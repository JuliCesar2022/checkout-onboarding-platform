import { useRef, useState, useEffect, useCallback, memo } from 'react';
import type { Category } from '../../../../shared/interfaces';
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

  // Calcula cuántos items caben visibles y el total de "páginas"
  const recalcPages = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const pageWidth = el.clientWidth;
    const pages = Math.max(1, Math.ceil(el.scrollWidth / pageWidth));
    setTotalPages(pages);
    const current = Math.round(el.scrollLeft / pageWidth);
    setActivePage(current);
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
  cat: Category;
  icon: string;
  isActive?: boolean;
  onSelect?: (cat: Category) => void;
}

const CategoryItem = memo(({ cat, icon, isActive, onSelect }: CategoryItemProps) => {
  return (
    <button
      onClick={() => onSelect?.(cat)}
      className={`group flex flex-col items-center gap-3 shrink-0 p-1 cursor-pointer transition-all duration-300 will-change-transform ${
        isActive ? '-translate-y-1' : 'hover:-translate-y-1'
      }`}
    >
      <div
        className={`w-18 h-18 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center transition-all duration-300 overflow-hidden ${
          isActive
            ? 'bg-blue-50 ring-2 ring-blue-500 ring-offset-2 shadow-lg scale-105'
            : 'bg-gray-50 ring-0 ring-transparent shadow-sm group-hover:bg-gray-100 group-hover:shadow-md group-hover:ring-1 group-hover:ring-gray-200'
        }`}
      >
        {cat.imageUrl ? (
          <ImageWithSkeleton
            src={cat.imageUrl.startsWith('http') ? cat.imageUrl : `http://localhost:3000/uploads/${cat.imageUrl}`}
            alt={cat.name}
            className="w-full h-full object-contain p-2 sm:p-3 transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <span className="text-3xl sm:text-4xl md:text-5xl select-none">{icon}</span>
        )}
      </div>
      <span
        className={`text-[10px] sm:text-xs md:text-sm font-medium transition-colors duration-300 ${
          isActive ? 'text-blue-700 font-bold' : 'text-gray-600 group-hover:text-gray-900'
        }`}
      >
        {cat.name}
      </span>
    </button>
  );
});

CategoryItem.displayName = 'CategoryItem';
