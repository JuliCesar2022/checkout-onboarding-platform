const banners = [
  {
    title: 'Free Shipping',
    subtitle: 'On orders over $100.000 COP',
    bg: 'from-emerald-500 to-teal-600',
    icon: '🚚',
  },
  {
    title: 'Secure Payments',
    subtitle: 'Safe & encrypted checkout',
    bg: 'from-indigo-500 to-blue-600',
    icon: '🔒',
  },
  {
    title: 'Best Prices',
    subtitle: 'Guaranteed quality products',
    bg: 'from-orange-500 to-red-500',
    icon: '🏷️',
  },
];

export function PromoBanners() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {banners.map((b) => (
        <div
          key={b.title}
          className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${b.bg} p-5 text-white`}
        >
          <div className="relative z-10">
            <p className="text-sm font-medium opacity-90">{b.subtitle}</p>
            <h3 className="text-lg font-bold mt-1">{b.title}</h3>
          </div>
          <span className="absolute -bottom-2 -right-2 text-6xl opacity-20">{b.icon}</span>
        </div>
      ))}
    </div>
  );
}
