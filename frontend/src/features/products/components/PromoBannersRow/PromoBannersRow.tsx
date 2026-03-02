interface PromoCard {
  bg: string;
  label?: string;
  title: string;
  subtitle: string;
  cta: string;
  imageEmoji: string;
  accentColor: string;
}

const CARDS: PromoCard[] = [
  {
    bg: 'from-[#b5005b] via-[#8b0042] to-[#6a0032]',
    label: '50% SAVE',
    title: 'Fresh & New',
    subtitle: 'Smartphones de última generación con descuento',
    cta: 'Shop Now',
    imageEmoji: '📱',
    accentColor: 'bg-yellow-400 text-gray-900',
  },
  {
    bg: 'from-[#b8d4f0] via-[#a0c4e8] to-[#8ab4de]',
    label: '',
    title: 'Galaxy S24 FE',
    subtitle: 'Galaxy AI is here — experiencia premium al alcance',
    cta: 'Shop Now',
    imageEmoji: '📲',
    accentColor: 'bg-[#1a3a6b] text-white',
  },
  {
    bg: 'from-[#d42b2b] via-[#b52020] to-[#8c1515]',
    label: 'قبل نفاذ المخزون',
    title: 'Oferta Flash',
    subtitle: 'Solo mientras duren las existencias — ¡no te lo pierdas!',
    cta: 'Shop Now',
    imageEmoji: '🛒',
    accentColor: 'bg-yellow-400 text-gray-900',
  },
];

export function PromoBannersRow() {
  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {CARDS.map((card, i) => (
          <div
            key={i}
            className={`relative overflow-hidden rounded-2xl bg-linear-to-br ${card.bg} h-88 flex flex-col justify-between p-6 shadow-md`}
          >
            {/* Decorative circle */}
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none" />

            {/* Badge */}
            {card.label && (
              <span className={`self-start text-xs font-bold px-3 py-1 rounded-full ${card.accentColor}`}>
                {card.label}
              </span>
            )}

            {/* Big emoji product image */}
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[110px] opacity-25 select-none pointer-events-none">
              {card.imageEmoji}
            </span>

            {/* Text */}
            <div className="relative z-10">
              <h3 className="text-white font-extrabold text-2xl leading-tight">{card.title}</h3>
              <p className="text-white/70 text-sm mt-2 max-w-[180px]">{card.subtitle}</p>
            </div>

            {/* CTA */}
            <button className={`relative z-10 self-start text-sm font-semibold px-5 py-2 rounded-full shadow-md transition-opacity hover:opacity-90 ${card.accentColor}`}>
              {card.cta}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
