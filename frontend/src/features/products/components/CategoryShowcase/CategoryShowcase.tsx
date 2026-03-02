import type { Category } from '../../../../shared/interfaces';

interface CategoryShowcaseProps {
  categories: Category[];
  onSelect: (category: Category) => void;
}

export function CategoryShowcase({ categories, onSelect }: CategoryShowcaseProps) {
  const parent = categories.find((c) => c.slug === 'LAPTOPS_ACCESSORIES');
  if (!parent || (parent.children ?? []).length === 0) return null;

  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Laptops &amp; Accessories</h2>
        <button
          onClick={() => onSelect(parent)}
          className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors flex items-center gap-1"
        >
          View All <span>&gt;</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {parent.children.map((child) => (
          <button
            key={child.id}
            onClick={() => onSelect(child)}
            className="flex flex-col items-center gap-3 group cursor-pointer"
          >
            <div className="w-full aspect-square rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:shadow-md group-hover:border-gray-300 transition-all duration-200 overflow-hidden">
              {child.imageUrl ? (
                <img
                  src={child.imageUrl}
                  alt={child.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <span className="text-4xl select-none">💻</span>
              )}
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors text-center">
              {child.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
