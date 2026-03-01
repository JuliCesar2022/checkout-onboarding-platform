import type { Category } from '../../types';

interface CategoryListProps {
  categories: Category[];
  onSelect?: (category: Category) => void;
}

const CATEGORY_ICONS: Record<string, { icon: string; bg: string }> = {
  AUDIO: { icon: '🎧', bg: 'bg-violet-100' },
  PERIPHERALS: { icon: '⌨️', bg: 'bg-blue-100' },
  NETWORKING: { icon: '🌐', bg: 'bg-emerald-100' },
};

const DEFAULT_ICON = { icon: '📦', bg: 'bg-gray-100' };

export function CategoryList({ categories, onSelect }: CategoryListProps) {
  if (categories.length === 0) return null;

  return (
    <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((cat) => {
        const { icon, bg } = CATEGORY_ICONS[cat.slug] ?? DEFAULT_ICON;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect?.(cat)}
            className="flex flex-col items-center gap-2 flex-shrink-0 group"
          >
            <div
              className={`w-20 h-20 rounded-full ${bg} flex items-center justify-center text-3xl group-hover:ring-2 group-hover:ring-indigo-400 group-hover:ring-offset-2 transition-all`}
            >
              {icon}
            </div>
            <span className="text-xs font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
              {cat.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
