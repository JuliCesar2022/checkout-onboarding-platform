import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

interface Panel {
  bg: string;
  label: string;
  title: string;
  subtitle: string;
  cta: string;
  emoji: string;
  type: 'hero' | 'sale' | 'promo';
  area: string;
  sketchfabId?: string;
  localModel?: string;
  isSpecial?: boolean; // For the redesigned headphones layout
}

interface Slide {
  areas: string;         // grid-template-areas value
  columns: string;       // grid-template-columns value
  rows: string;          // grid-template-rows value
  panels: Panel[];
}

const SLIDES: Slide[] = [
  /* ── 3D Focal Headphones (REDESIGN) ── */
  {
    areas: '"hero top" "hero bot"',
    columns: '1.4fr 0.9fr',
    rows: '1fr 1fr',
    panels: [
      { 
        area: 'hero', 
        type: 'hero', 
        bg: 'bg-[#f8f9fa]', // Light theme
        label: 'Music is Classic', 
        title: 'Sequoia Inspiring Musico.', 
        subtitle: 'Making your dream music come true stay with Sequios Sounds!', 
        cta: 'View All Products', 
        emoji: '🎧',
        localModel: '/models/auriculares.glb',
        isSpecial: true
      },
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
];

function BannerPanel({ p }: { p: Panel }) {
  if (p.isSpecial) {
    return (
      <div
        className={`relative overflow-hidden rounded-2xl ${p.bg} flex flex-col justify-between p-10 border border-gray-100 shadow-sm`}
        style={{ gridArea: p.area }}
      >
        {/* Floating background particles (simplified) */}
        <div className="absolute top-20 right-40 w-3 h-3 rounded-full bg-gray-300 opacity-50" />
        <div className="absolute bottom-40 right-10 w-4 h-4 rounded-full bg-gray-400 opacity-30" />
        <div className="absolute top-10 right-10 w-2 h-2 rounded-full bg-blue-500 opacity-40" />

        {/* 3D Model Layer */}
        <div className="absolute top-0 right-0 w-full md:w-[55%] h-full z-10 overflow-hidden pointer-events-auto">
          <model-viewer
            src={p.localModel}
            alt={p.title}
            auto-rotate
            camera-controls
            camera-orbit="45deg 75deg 105%"
            field-of-view="30deg"
            shadow-intensity="1"
            environment-image="neutral"
            exposure="1.2"
            interaction-prompt="none"
            style={{ width: '100%', height: '100%', outline: 'none' }}
          />
        </div>

        {/* Content Layer */}
        <div className="relative z-20 flex flex-col h-full pointer-events-none">
          {/* Badge */}
          <div className="inline-flex items-center bg-white rounded-full px-4 py-1.5 text-[11px] font-medium text-gray-500 shadow-sm border border-gray-100 mb-8 self-start">
            <span className="mr-2">🎵</span>
            {p.label}
          </div>

          <div className="flex-1">
            <h3 className="text-gray-900 font-bold text-5xl md:text-6xl leading-[1.1] max-w-sm mb-8">
              {p.title.split(' ').map((word, i) => (
                <span key={i} className="block">{word}</span>
              ))}
            </h3>

            {/* Decorative 01 and subtitle section */}
            <div className="flex items-start gap-6 mb-10 text-gray-400">
              <span className="text-5xl font-light opacity-30 leading-none">01</span>
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-gray-200 h-[1px] w-12" />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-gray-900">Clear Sounds</span>
                </div>
                <p className="text-[11px] text-gray-500 max-w-[200px] leading-relaxed">
                  {p.subtitle}
                </p>
              </div>
            </div>

            {/* Lime Green Button */}
            <button className="pointer-events-auto flex items-center bg-[#e2ff46] hover:bg-[#d4f035] text-gray-900 font-bold text-xs pl-6 pr-1.5 py-1.5 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95">
              {p.cta}
              <div className="ml-4 bg-black rounded-full p-2 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </button>
          </div>

          {/* Social Links Footer */}
          <div className="flex items-center gap-4 text-gray-400 mt-auto">
            <span className="text-[10px] font-medium uppercase tracking-tight">Follow us on:</span>
            <div className="flex gap-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-7 h-7 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm hover:text-gray-900 cursor-pointer pointer-events-auto transition-colors">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-sm" /> {/* Placeholder for real icons */}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${p.bg} flex flex-col justify-between p-6`}
      style={{ gridArea: p.area }}
    >
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />

      {p.localModel ? (
        <div className="absolute top-0 right-0 w-full md:w-1/2 h-full z-0 overflow-hidden">
          <model-viewer
            src={p.localModel}
            alt={p.title}
            auto-rotate
            camera-controls
            shadow-intensity="1"
            environment-image="neutral"
            exposure="1"
            interaction-prompt="none"
            style={{ width: '100%', height: '100%', outline: 'none' }}
          />
        </div>
      ) : p.sketchfabId ? (
        <div className="absolute top-0 right-0 w-full md:w-1/2 h-full z-0 opacity-90 overflow-hidden transform translate-x-4">
           <iframe
            title={p.title}
            frameBorder="0"
            allowFullScreen
            allow="autoplay; fullscreen; xr-spatial-tracking"
            src={`https://sketchfab.com/models/${p.sketchfabId}/embed?autostart=1&ui_infos=0&ui_controls=0&ui_stop=0&transparent=1&preload=1`}
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      ) : (
        p.type === 'hero' && (
          <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[120px] opacity-20 select-none pointer-events-none">
            {p.emoji}
          </span>
        )
      )}

      <div className="relative z-10 pointer-events-none">
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

      {p.type !== 'hero' && !p.sketchfabId && !p.localModel && (
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
