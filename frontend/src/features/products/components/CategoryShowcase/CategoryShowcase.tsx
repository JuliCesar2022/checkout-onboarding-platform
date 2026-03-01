interface ShowcaseItem {
  label: string;
  emoji: string;
}

const ITEMS: ShowcaseItem[] = [
  { label: 'Laptop',          emoji: '💻' },
  { label: 'Monitor',         emoji: '🖥️' },
  { label: 'MacBooks',        emoji: '🍎' },
  { label: 'Storage Device',  emoji: '💾' },
  { label: 'Printer',         emoji: '🖨️' },
];

export function CategoryShowcase() {
  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Laptops &amp; Accessories</h2>
        <button className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors flex items-center gap-1">
          View All <span>&gt;</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {ITEMS.map((item) => (
          <button
            key={item.label}
            className="flex flex-col items-center gap-3 group cursor-pointer"
          >
            <div className="w-full aspect-square rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:shadow-md group-hover:border-gray-300 transition-all duration-200 overflow-hidden">
              <span className="text-6xl group-hover:scale-110 transition-transform duration-200 select-none">
                {item.emoji}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
