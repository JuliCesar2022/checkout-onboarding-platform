import type { Category } from '../../types';

interface GamingShowcaseProps {
  categories: Category[];
  onSelect: (category: Category) => void;
}

export function GamingShowcase({ categories, onSelect }: GamingShowcaseProps) {
  const parent = categories.find((c) => c.slug === 'GAMING');
  if (!parent || (parent.children ?? []).length === 0) return null;
  const children = parent.children ?? [];

  return (
    <section>
      <div className="relative">
        {/* Banner background — top half only */}
        <div className="absolute inset-0 bottom-1/3 bg-linear-to-r from-[#0d0d0d] via-[#1a0533] to-[#2d0a5e] rounded-2xl overflow-hidden">
          <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 right-32 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
          <span className="absolute right-12 top-1/2 -translate-y-1/2 text-[120px] opacity-10 select-none pointer-events-none">
            🕹️
          </span>
        </div>

        {/* Content */}
        <div className="relative z-10 px-8 pt-8 pb-4">
          <div className="flex items-center justify-between mb-8">
            <div className="max-w-sm">
              <h2 className="text-3xl font-extrabold text-white leading-tight">
                Level Up Your <span className="text-purple-400">Gaming</span> Setup!
              </h2>
              <p className="text-gray-400 text-sm mt-2">
                Equipos de alto rendimiento — domina cada partida.
              </p>
            </div>
            <button
              onClick={() => onSelect(parent)}
              className="bg-white text-gray-900 font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-gray-100 transition-colors shadow-lg shrink-0"
            >
              Ver gaming &rarr;
            </button>
          </div>

          {/* Category cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => onSelect(child)}
                className="group cursor-pointer"
              >
                <div className="w-full aspect-square rounded-xl bg-gray-50 border border-gray-100 shadow-md flex flex-col items-center justify-between group-hover:shadow-lg group-hover:border-purple-200 transition-all duration-200 overflow-hidden">
                  {child.imageUrl ? (
                    <img
                      src={child.imageUrl}
                      alt={child.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <span className="text-6xl group-hover:scale-110 transition-transform duration-200 select-none flex-1 flex items-center">
                      🎮
                    </span>
                  )}
                </div>
                <span className="block mt-2 text-sm font-medium text-gray-700 group-hover:text-purple-600 transition-colors text-center pb-1">
                  {child.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
