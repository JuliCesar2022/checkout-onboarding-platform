import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

interface Panel {
  bg: string;
  label: string;
  title: string;
  subtitle: string;
  cta: string;
  emoji: string;
  type: 'hero' | 'sale' | 'promo';
  area: string;
}

interface Slide {
  areas: string;         // grid-template-areas value
  columns: string;       // grid-template-columns value
  rows: string;          // grid-template-rows value
  panels: Panel[];
}

const SLIDES: Slide[] = [
  /* ── 2 paneles lado a lado ── */
  {
    areas: '"hero promo"',
    columns: '1.4fr 0.9fr',
    rows: '1fr',
    panels: [
      { area: 'hero',  type: 'hero',  bg: 'from-[#1a1a2e] via-[#16213e] to-[#0f3460]', label: 'Nuevo lanzamiento', title: 'iPhone 16 Pro Max', subtitle: 'Chip A18, cámara Pro, pantalla Super Retina XDR.', cta: 'Shop Now', emoji: '📱' },
      { area: 'promo', type: 'sale',  bg: 'from-orange-500 to-rose-600',                label: 'Oferta limitada',  title: '50%',             subtitle: 'OFF en accesorios y gaming. Solo hoy.',           cta: 'Ver descuentos', emoji: '⚡' },
    ],
  },
  /* ── panel grande + 2 apilados ── */
  {
    areas: '"hero top" "hero bot"',
    columns: '1.4fr 0.9fr',
    rows: '1fr 1fr',
    panels: [
      { area: 'hero', type: 'hero',  bg: 'from-[#003087] via-[#0070cc] to-[#00439c]', label: 'Gaming Power',     title: 'PlayStation 5',   subtitle: 'Velocidad de siguiente generación.',              cta: 'Ver consolas', emoji: '🎮' },
      { area: 'top',  type: 'promo', bg: 'from-violet-600 to-purple-800',              label: 'Bundle exclusivo', title: 'Consola + 2 juegos', subtitle: 'Arma tu setup con los mejores títulos.',       cta: 'Ver bundle',   emoji: '🕹️' },
      { area: 'bot',  type: 'sale',  bg: 'from-amber-500 to-yellow-500',               label: 'Flash sale',       title: '30%',             subtitle: 'OFF en mandos y accesorios.',                     cta: 'Ver oferta',   emoji: '🔥' },
    ],
  },
  /* ── 2 paneles lado a lado ── */
  {
    areas: '"hero promo"',
    columns: '1.4fr 0.9fr',
    rows: '1fr',
    panels: [
      { area: 'hero',  type: 'hero',  bg: 'from-[#1c1c1e] via-[#2c2c2e] to-[#3a3a3c]', label: 'Potencia total', title: 'MacBook Air M3',   subtitle: 'Hasta 18 h de batería. Más delgado que nunca.', cta: 'Comprar ahora', emoji: '💻' },
      { area: 'promo', type: 'promo', bg: 'from-emerald-600 to-teal-700',                label: 'Envío gratis',  title: 'En pedidos +$100K', subtitle: 'Sin costo adicional en todo el país.',          cta: 'Saber más',     emoji: '🚚' },
    ],
  },
  /* ── panel grande + 2 apilados ── */
  {
    areas: '"hero top" "hero bot"',
    columns: '1.4fr 0.9fr',
    rows: '1fr 1fr',
    panels: [
      { area: 'hero', type: 'hero',  bg: 'from-[#0d1b2a] via-[#1b263b] to-[#415a77]', label: 'Realidad Virtual', title: 'Meta Quest 3',    subtitle: 'Sumérgete en experiencias mixtas sin cables.', cta: 'Descubrir',  emoji: '🥽' },
      { area: 'top',  type: 'sale',  bg: 'from-rose-600 to-pink-700',                  label: 'Mega sale',        title: '70%',             subtitle: 'OFF en laptops gaming seleccionadas.',         cta: 'Ver laptops', emoji: '💥' },
      { area: 'bot',  type: 'promo', bg: 'from-sky-600 to-blue-700',                   label: 'Soporte 24/7',     title: 'Siempre contigo', subtitle: 'Asesoría técnica en todos los productos.',     cta: 'Contactar',   emoji: '🎧' },
    ],
  },
];

function BannerPanel({ p }: { p: Panel }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${p.bg} flex flex-col justify-between p-6`}
      style={{ gridArea: p.area }}
    >
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />

      {p.type === 'hero' && (
        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[120px] opacity-20 select-none pointer-events-none">
          {p.emoji}
        </span>
      )}

      <div className="relative z-10">
        <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">{p.label}</p>
        {p.type === 'sale' ? (
          <>
            <p className="text-white font-bold text-sm">SALE UP TO</p>
            <p className="text-white font-extrabold text-6xl leading-none">{p.title}</p>
          </>
        ) : (
          <h3 className={`text-white font-extrabold leading-tight ${p.type === 'hero' ? 'text-4xl md:text-5xl' : 'text-xl'}`}>
            {p.title}
          </h3>
        )}
        <p className="text-white/70 text-sm mt-2 max-w-[200px]">{p.subtitle}</p>
      </div>

      <button className="relative z-10 self-start mt-4 bg-white text-gray-900 font-semibold text-xs px-5 py-2 rounded-full hover:bg-gray-100 transition-colors shadow-md">
        {p.cta}
      </button>

      {p.type !== 'hero' && (
        <span className="absolute bottom-3 right-3 text-[80px] opacity-15 select-none pointer-events-none">
          {p.emoji}
        </span>
      )}
    </div>
  );
}

function SlideGrid({ slide }: { slide: Slide }) {
  return (
    <div
      className="grid gap-4 h-[32rem] p-4 bg-white rounded-2xl shadow-sm"
      style={{
        gridTemplateAreas: slide.areas,
        gridTemplateColumns: slide.columns,
        gridTemplateRows: slide.rows,
      }}
    >
      {slide.panels.map((p) => (
        <BannerPanel key={p.area} p={p} />
      ))}
    </div>
  );
}

export function HeroBanner() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 25 },
    [Autoplay({ delay: 4500, stopOnInteraction: false })],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  return (
    <div className="flex flex-col gap-3 pb-4">
      {/* viewport */}
      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex touch-pan-y" style={{ backfaceVisibility: 'hidden' }}>
          {SLIDES.map((slide, i) => (
            <div key={i} style={{ flex: '0 0 100%', minWidth: 0 }}>
              <SlideGrid slide={slide} />
            </div>
          ))}
        </div>
      </div>

      {/* dots */}
      <div className="flex justify-center items-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === selectedIndex
                ? 'w-6 h-2 bg-[#222]'
                : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
