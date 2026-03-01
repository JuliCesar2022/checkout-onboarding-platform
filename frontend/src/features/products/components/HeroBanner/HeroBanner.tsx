import { useState, useEffect, useCallback, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'model-viewer': any;
      }
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
  image?: string;
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
      { area: 'top',  type: 'promo', bg: 'bg-[#f8f9fa]',                                   label: 'Bundle exclusivo', title: 'AirPods Pro',   subtitle: 'Magia para tus oídos.',                    cta: 'Comprar ahora', emoji: '🎧', image: '/airpods.png' },
      { area: 'bot',  type: 'promo', bg: 'bg-[#f8f9fa]',                                   label: 'Experience',      title: 'Vive el Sonido', subtitle: 'Diseñados para tu comodidad diaria.',   cta: 'Saber más',     emoji: '✨', image: '/lifestyle.jpg' },
    ],
  },
  /* ── 2 paneles lado a lado ── */
  {
    areas: '"hero promo"',
    columns: '1.4fr 0.9fr',
    rows: '1fr',
    panels: [
      { 
        area: 'hero',  
        type: 'hero',  
        bg: 'bg-[#f0f2f5]', 
        label: 'Nuevo lanzamiento', 
        title: 'iPhone 17 Pro.', 
        subtitle: 'The future of mobile power and elegancy.', 
        cta: 'Shop Now', 
        emoji: '📱', 
        localModel: '/models/iphone17.glb',
        isSpecial: true 
      },
      { area: 'promo', type: 'sale',  bg: 'from-orange-500 to-rose-600',                label: 'Oferta limitada',  title: '50%',             subtitle: 'OFF en accesorios y gaming. Solo hoy.',           cta: 'Ver descuentos', emoji: '⚡' },
    ],
  },
  /* ── panel grande (PS5 FULL WIDTH) ── */
  {
    areas: '"hero"',
    columns: '1fr',
    rows: '1fr',
    panels: [
      { 
        area: 'hero', 
        type: 'hero',  
        bg: 'bg-[#f0f2f5]', 
        label: 'Gaming Power',     
        title: 'Sony PlayStation 5.',   
        subtitle: 'Experience lightning-fast loading and immersive gaming.',              
        cta: 'Shop Consoles', 
        emoji: '🎮', 
        localModel: '/models/ps5.glb', 
        isSpecial: true 
      },
    ],
  },
];

function BannerPanel({ 
  p, 
  modelRef, 
  activeColor, 
  setActiveColor 
}: { 
  p: Panel;
  modelRef: React.RefObject<any>;
  activeColor: string;
  setActiveColor: (c: string) => void;
}) {
  const COLORS = [
    { name: 'Blue', hex: '#3b82f6' },
    { name: 'Orange', hex: '#f97316' },
    { name: 'Green', hex: '#22c55e' },
    { name: 'Red', hex: '#ef4444' },
    { name: 'Cyan', hex: '#06b6d4' },
  ];

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
            ref={modelRef}
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
          <div className="inline-flex items-center bg-white rounded-full px-4 py-1.5 text-[11px] font-medium text-gray-500 shadow-sm border border-gray-100 mb-8 self-start animate-slide-up animate-stagger-1">
            <span className="mr-2">🎵</span>
            {p.label}
          </div>

          <div className="flex-1">
            <h3 className="text-gray-900 font-bold text-5xl md:text-6xl leading-[1.1] max-w-sm mb-8 animate-slide-up animate-stagger-2">
              {p.title.split(' ').map((word, i) => (
                <span key={i} className="block">{word}</span>
              ))}
            </h3>

            {/* Decorative 01 and subtitle section */}
            <div className="flex items-start gap-6 mb-10 text-gray-400 animate-slide-up animate-stagger-3">
              <span className="text-5xl font-light opacity-30 leading-none">01</span>
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-gray-200 h-px w-12" />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-gray-900">Clear Sounds</span>
                </div>
                <p className="text-[11px] text-gray-500 max-w-[200px] leading-relaxed">
                  {p.subtitle}
                </p>
              </div>
            </div>

            {/* Lime Green Button + Small Color Picker */}
            <div className="flex items-center gap-4 animate-slide-up animate-stagger-4 mt-2">
              <button className="pointer-events-auto flex items-center bg-[#e2ff46] hover:bg-[#d4f035] text-gray-900 font-bold text-xs pl-6 pr-1.5 py-1.5 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95">
                {p.cta}
                <div className="ml-4 bg-black rounded-full p-2 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </button>

              {/* Minimalist Color Selector */}
              {p.localModel?.includes('auriculares') && (
                <div className="flex items-center gap-1.5 pointer-events-auto bg-white/60 backdrop-blur-sm px-3 py-2 rounded-full border border-white/40 shadow-sm ml-2">
                  {COLORS.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => setActiveColor(c.hex)}
                      title={c.name}
                      className={`w-4 h-4 rounded-full transition-all flex items-center justify-center ${
                        activeColor === c.hex ? 'ring-1 ring-gray-900 ring-offset-1 scale-110' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              )}
            </div>
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
      className={`relative overflow-hidden rounded-2xl flex flex-col justify-between p-6 ${p.bg.startsWith('bg-') ? p.bg : `bg-linear-to-br ${p.bg}`}`}
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
      ) : p.image ? (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Subtle gradient overlay to ensure text legibility over full images */}
          <div className="absolute inset-0 bg-linear-to-r from-white/90 via-white/40 to-transparent z-10" />
          <img 
            src={p.image} 
            alt={p.title} 
            className="w-full h-full object-cover opacity-100 animate-reveal-up"
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
        <p className={`${(p.bg.includes('#f8f9fa') || p.bg.includes('#f0f2f5')) ? 'text-gray-500' : 'text-white/60'} text-xs font-semibold uppercase tracking-widest mb-1 animate-slide-up animate-stagger-1`}>{p.label}</p>
        {p.type === 'sale' ? (
          <>
            <p className={`${(p.bg.includes('#f8f9fa') || p.bg.includes('#f0f2f5')) ? 'text-gray-900' : 'text-white'} font-bold text-sm animate-slide-up animate-stagger-1`}>SALE UP TO</p>
            <p className={`${(p.bg.includes('#f8f9fa') || p.bg.includes('#f0f2f5')) ? 'text-gray-900' : 'text-white'} font-extrabold text-6xl leading-none animate-slide-up animate-stagger-2`}>{p.title}</p>
          </>
        ) : (
          <h3 className={`${(p.bg.includes('#f8f9fa') || p.bg.includes('#f0f2f5')) ? 'text-gray-900' : 'text-white'} font-extrabold leading-tight animate-slide-up animate-stagger-2 ${p.type === 'hero' ? 'text-4xl md:text-5xl' : 'text-xl'}`}>
            {p.title}
          </h3>
        )}
        <p className={`${(p.bg.includes('#f8f9fa') || p.bg.includes('#f0f2f5')) ? 'text-gray-500' : 'text-white/70'} text-sm mt-2 max-w-[200px] animate-slide-up animate-stagger-3`}>{p.subtitle}</p>
      </div>

      <button className={`relative z-10 self-start mt-4 ${(p.bg.includes('#f8f9fa') || p.bg.includes('#f0f2f5')) ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} font-semibold text-xs px-5 py-2 rounded-full hover:opacity-90 transition-colors shadow-md animate-slide-up animate-stagger-4`}>
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
  const modelRef = useRef<any>(null);
  const [activeColor, setActiveColor] = useState('#ffffff');

  useEffect(() => {
    const modelViewer = modelRef.current;
    if (!modelViewer) return;

    const applyColor = () => {
      // Solo aplicamos si el modelo está cargado y si es el de auriculares
      if (modelViewer.src?.includes('auriculares')) {
        const material = modelViewer.model?.materials[0];
        if (material) {
          const r = parseInt(activeColor.slice(1, 3), 16) / 255;
          const g = parseInt(activeColor.slice(3, 5), 16) / 255;
          const b = parseInt(activeColor.slice(5, 7), 16) / 255;
          material.pbrMetallicRoughness.setBaseColorFactor([r, g, b, 1]);
        }
      }
    };

    if (modelViewer.model) {
      applyColor();
    } else {
      modelViewer.addEventListener('load', applyColor);
      return () => modelViewer.removeEventListener('load', applyColor);
    }
  }, [activeColor]);

  return (
    <div
      className="grid gap-4 h-128 p-4 bg-white rounded-2xl shadow-sm"
      style={{
        gridTemplateAreas: slide.areas,
        gridTemplateColumns: slide.columns,
        gridTemplateRows: slide.rows,
      }}
    >
      {slide.panels.map((p) => (
        <BannerPanel 
          key={p.area} 
          p={p} 
          modelRef={modelRef} 
          activeColor={activeColor} 
          setActiveColor={setActiveColor} 
        />
      ))}
    </div>
  );
}

export function HeroBanner() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true, 
      duration: 25,
      watchDrag: (_, event) => {
        const target = event.target as HTMLElement;
        return !target.closest('model-viewer');
      }
    },
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
