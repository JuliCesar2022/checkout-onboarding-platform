interface GamingCategory {
  label: string;
  emoji: string;
}

const GAMING_CATEGORIES: GamingCategory[] = [
  { label: 'Consolas',     emoji: '🎮' },
  { label: 'Headsets',     emoji: '🎧' },
  { label: 'Teclados',     emoji: '⌨️' },
  { label: 'Sillas Gamer', emoji: '🪑' },
  { label: 'Monitores',    emoji: '🖥️' },
];

export function GamingShowcase() {
  return (
    <section>
      {/* Wrapper con fondo del banner arriba y blanco abajo */}
      <div className="relative">
        {/* Banner de color — ocupa solo la mitad superior */}
        <div className="absolute inset-0 bottom-1/3 bg-gradient-to-r from-[#0d0d0d] via-[#1a0533] to-[#2d0a5e] rounded-2xl overflow-hidden">
          {/* Decorative glows */}
          <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 right-32 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
          {/* Decorative emoji */}
          <span className="absolute right-12 top-1/2 -translate-y-1/2 text-[120px] opacity-10 select-none pointer-events-none">
            🕹️
          </span>
        </div>

        {/* Content — sobre el banner */}
        <div className="relative z-10 px-8 pt-8 pb-4">
          {/* Header row */}
          <div className="flex items-center justify-between mb-8">
            <div className="max-w-sm">
              <h2 className="text-3xl font-extrabold text-white leading-tight">
                Level Up Your <span className="text-purple-400">Gaming</span> Setup!
              </h2>
              <p className="text-gray-400 text-sm mt-2">
                Equipos de alto rendimiento — domina cada partida.
              </p>
            </div>
            <button className="bg-white text-gray-900 font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-gray-100 transition-colors shadow-lg flex-shrink-0">
              Ver gaming &rarr;
            </button>
          </div>

          {/* Cards — la mitad superior sobre el color, la mitad inferior sobre blanco */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {GAMING_CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                className="group cursor-pointer"
              >
                <div className="w-full aspect-square rounded-xl bg-gray-50 border border-gray-100 shadow-md flex flex-col items-center justify-between group-hover:shadow-lg group-hover:border-purple-200 transition-all duration-200 p-4">
                  <span className="text-6xl group-hover:scale-110 transition-transform duration-200 select-none flex-1 flex items-center">
                    {cat.emoji}
                  </span>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600 transition-colors pb-1">
                    {cat.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
