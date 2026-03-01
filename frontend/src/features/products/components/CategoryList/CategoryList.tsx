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
  if (categories.length === 0) return null;

  return (
    <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((cat) => {
        const icon = CATEGORY_ICONS[cat.slug] ?? DEFAULT_ICON;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect?.(cat)}
            className="flex flex-col items-center gap-3 flex-shrink-0 group p-2"
          >
            <div
              className="w-28 h-28 rounded-full bg-indigo-50 flex items-center justify-center text-5xl group-hover:ring-2 group-hover:ring-indigo-400 group-hover:ring-offset-2 transition-all"
            >
              {icon}
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
              {cat.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
