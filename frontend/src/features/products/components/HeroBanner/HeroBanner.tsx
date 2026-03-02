import { useState, useEffect, useCallback, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ImageWithSkeleton } from '../../../../shared/ui/ImageWithSkeleton';

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
  secondaryLabel?: string; // e.g. "Clear Sounds"
}

interface Slide {
  areas: string;         // grid-template-areas value
  columns: string;       // grid-template-columns value
  rows: string;          // grid-template-rows value
  panels: Panel[];
}

const SLIDES: Slide[] = [
  {
    areas: '"hero top" "hero bot"',
    columns: '1.4fr 0.9fr',
    rows: '1fr 1fr',
    panels: [
      { 
        area: 'hero', 
        type: 'hero', 
        bg: 'bg-[#f3f4f6]', // Light theme
        label: 'Music is Classic', 
        title: 'Sequoia Inspiring Musico.', 
        subtitle: 'Making your dream music come true stay with Sequios Sounds!', 
        cta: 'View All Products', 
        emoji: '🎧',
        localModel: '/models/auriculares.glb',
        isSpecial: true
      },
      { area: 'top',  type: 'promo', bg: 'bg-[#f3f4f6]',                                   label: 'Bundle exclusivo', title: 'AirPods Pro',   subtitle: 'Magia para tus oídos.',                    cta: 'Comprar ahora', emoji: '🎧', image: '/airpods_new.png' },
      { area: 'bot',  type: 'promo', bg: 'bg-[#f3f4f6]',                                   label: 'Experience',      title: 'Vive el Sonido', subtitle: 'Diseñados para tu comodidad diaria.',   cta: 'Saber más',     emoji: '✨', image: '/lifestyle_new.png' },
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
        bg: 'bg-[#f3f4f6]', 
        label: 'Nuevo lanzamiento', 
        title: 'iPhone 17 Pro.', 
        subtitle: 'Una nueva era de potencia y elegancia en tus manos.', 
        cta: 'Shop Now', 
        emoji: '📱', 
        localModel: '/models/iphone17.glb',
        isSpecial: true,
        secondaryLabel: 'Pro Performance'
      },
      { area: 'promo', type: 'promo', bg: 'bg-[#f3f4f6]',                               label: 'Edición Especial', title: 'Estilo sin Límites', subtitle: 'El color que define una nueva era de innovación.',  cta: 'Descúbrelo',    emoji: '✨', image: '/iphone_promo_transparent.png' },
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
        bg: 'bg-[#f3f4f6]', 
        label: 'Gaming Power',     
        title: 'Sony PlayStation 5.',   
        subtitle: 'Siente el poder de la nueva generación con carga ultrarrápida.',              
        cta: 'Shop Consoles', 
        emoji: '🎮', 
        localModel: '/models/ps5.glb', 
        isSpecial: true,
        secondaryLabel: 'Play Has No Limits'
      },
    ],
  },
];

function BannerPanel({
  p,
  modelRef: externalModelRef,
  activeColor,
  setActiveColor,
  isActive
}: {
  p: Panel;
  modelRef: React.RefObject<any>;
  activeColor: string;
  setActiveColor: (c: string) => void;
  isActive?: boolean;
}) {
  const internalModelRef = useRef<any>(null);
  const modelRef = externalModelRef.current ? externalModelRef : internalModelRef;

  const HEADPHONE_COLORS = [
    { name: 'Blue', hex: '#3b82f6' },
    { name: 'Orange', hex: '#f97316' },
    { name: 'Green', hex: '#22c55e' },
    { name: 'Red', hex: '#ef4444' },
    { name: 'Cyan', hex: '#06b6d4' },
  ];

  const IPHONE_COLORS = [
    { name: 'Cosmic Orange', hex: '#d4632a', gradient: 'linear-gradient(135deg, #e8763a 0%, #b84e1a 60%, #d4622a 100%)' },
    { name: 'Deep Blue',     hex: '#1e3a5f', gradient: 'linear-gradient(135deg, #2a4f7a 0%, #132840 60%, #1e3a5f 100%)' },
    { name: 'Silver',        hex: '#c8cdd2', gradient: 'linear-gradient(135deg, #e2e6ea 0%, #a8b0b8 50%, #d0d5da 100%)' },
  ];

  const isAuriculares = p.localModel?.includes('auriculares');
  const isIphone = p.localModel?.includes('iphone');
  const COLORS = isIphone ? IPHONE_COLORS : HEADPHONE_COLORS;

  // Store original base colors per material index on first load
  const originalColorsRef = useRef<[number, number, number, number][]>([]);

  useEffect(() => {
    if (!isAuriculares && !isIphone) return;
    const mv = internalModelRef.current;
    if (!mv) return;
    const onLoad = () => {
      const materials: any[] = mv.model?.materials;
      if (!materials?.length) return;
      originalColorsRef.current = materials.map((m: any) =>
        [...(m.pbrMetallicRoughness?.baseColorFactor ?? [1, 1, 1, 1])] as [number, number, number, number]
      );
    };
    if (mv.model) onLoad();
    else { mv.addEventListener('load', onLoad); return () => mv.removeEventListener('load', onLoad); }
  }, [isAuriculares, isIphone]);

  useEffect(() => {
    if (!isAuriculares && !isIphone) return;
    const mv = internalModelRef.current;
    if (!mv) return;
    const applyColor = () => {
      const materials: any[] = mv.model?.materials;
      if (!materials?.length) return;
      const r = parseInt(activeColor.slice(1, 3), 16) / 255;
      const g = parseInt(activeColor.slice(3, 5), 16) / 255;
      const b = parseInt(activeColor.slice(5, 7), 16) / 255;
      if (isIphone) {
        const originals = originalColorsRef.current;
        // Find the brightest material — that's the body/back panel
        let maxLum = -1;
        let maxIdx = 0;
        originals.forEach((orig, i) => {
          const lum = orig[0] * 0.299 + orig[1] * 0.587 + orig[2] * 0.114;
          if (lum > maxLum) { maxLum = lum; maxIdx = i; }
        });
        // Only paint the brightest material (body back) plus any others with similar color
        originals.forEach((orig, i) => {
          const lum = orig[0] * 0.299 + orig[1] * 0.587 + orig[2] * 0.114;
          // Paint only if luminance is within 15% of the max (same part family as body)
          if (lum >= maxLum * 0.85) {
            materials[i]?.pbrMetallicRoughness?.setBaseColorFactor([r, g, b, 1]);
          }
        });
      } else {
        // Auriculares: pintar solo el cuerpo exterior (earcaps, headband, scrims)
        const HEADPHONE_PAINT = ['earcaps_mtl', 'headband_mtl', 'scrims_mtl', 'emit_mtl'];
        for (const mat of materials) {
          const name = (mat.name ?? '').toLowerCase();
          if (HEADPHONE_PAINT.some(n => name.includes(n))) {
            mat.pbrMetallicRoughness?.setBaseColorFactor([r, g, b, 1]);
          }
        }
      }
    };
    if (mv.model) applyColor();
    else { mv.addEventListener('load', applyColor); return () => mv.removeEventListener('load', applyColor); }
  }, [activeColor, isAuriculares, isIphone]);

  if (p.isSpecial) {
    return (
      <div
        className={`relative overflow-hidden rounded-2xl ${p.bg} flex flex-col sm:justify-between sm:pt-10 sm:pb-16 sm:px-10 border border-gray-200 shadow-md h-full`}
        style={{ gridArea: p.area }}
      >
        {/* Floating background particles (simplified) */}
        <div className="absolute top-20 right-40 w-3 h-3 rounded-full bg-gray-300 opacity-50" />
        <div className="absolute bottom-40 right-10 w-4 h-4 rounded-full bg-gray-400 opacity-30" />
        <div className="absolute top-10 right-10 w-2 h-2 rounded-full bg-blue-500 opacity-40" />

        {/* 3D Model Layer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[85%] h-[72%] md:left-auto md:translate-x-0 md:right-0 md:w-[55%] md:h-full z-10 overflow-hidden pointer-events-auto">
          <model-viewer
            ref={internalModelRef}
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

        {/* Gradient overlay for mobile text legibility */}
        <div className="sm:hidden absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#f3f4f6] to-transparent z-10 pointer-events-none" />

        {/* Badge — mobile only, top-left */}
        <div className={`sm:hidden absolute top-4 left-5 z-20 inline-flex items-center bg-white rounded-full px-4 py-1.5 text-[11px] font-medium text-gray-500 shadow-sm border border-gray-100 ${isActive ? 'animate-slide-up animate-stagger-1' : 'opacity-0'}`}>
          <span className="mr-2">{p.emoji || '✨'}</span>
          {p.label}
        </div>

        {/* Content Layer */}
        <div className="sm:relative absolute bottom-0 left-0 right-0 sm:bottom-auto sm:left-auto sm:right-auto z-20 flex flex-col sm:h-full px-5 sm:px-0 pb-6 sm:pb-0" style={{ pointerEvents: 'none' }}>
          {/* Badge — desktop only */}
          <div className={`hidden sm:inline-flex items-center bg-white rounded-full px-4 py-1.5 text-[11px] font-medium text-gray-500 shadow-sm border border-gray-100 mb-3 sm:mb-8 self-start ${isActive ? 'animate-slide-up animate-stagger-1' : 'opacity-0'}`}>
            <span className="mr-2">{p.emoji || '✨'}</span>
            {p.label}
          </div>

          {/* Mobile color picker - above title */}
          {(isAuriculares || isIphone) && (
            <div className="sm:hidden flex items-center gap-1.5 pointer-events-auto mb-3">
              {COLORS.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setActiveColor(c.hex)}
                  title={c.name}
                  className={`rounded-full transition-all shadow-sm ${activeColor === c.hex ? 'ring-2 ring-gray-900 ring-offset-1 scale-110' : 'hover:scale-110'} ${isIphone ? 'w-6 h-6' : 'w-5 h-5'}`}
                  style={{ background: (c as any).gradient ?? c.hex }}
                />
              ))}
            </div>
          )}

          <div className="sm:flex-1">
            <h3 className={`text-gray-900 font-bold text-3xl sm:text-5xl md:text-6xl leading-[1.1] max-w-sm mb-4 sm:mb-8 ${isActive ? 'animate-slide-up animate-stagger-2' : 'opacity-0'}`}>
              {p.title.split(' ').map((word, i) => (
                <span key={i} className="sm:block">{word}{' '}</span>
              ))}
            </h3>

            {/* Decorative 01 and subtitle section */}
            <div className={`hidden sm:flex items-start gap-4 mb-6 sm:mb-10 text-gray-400 ${isActive ? 'animate-slide-up animate-stagger-3' : 'opacity-0'}`}>
              <span className="text-3xl sm:text-5xl font-light opacity-30 leading-none">01</span>
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-gray-200 h-px w-12" />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-gray-900">
                    {p.secondaryLabel || 'Clear Sounds'}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 max-w-[200px] leading-relaxed">
                  {p.subtitle}
                </p>
              </div>
            </div>

            {/* Lime Green Button + Small Color Picker */}
            <div className={`hidden sm:flex items-center gap-4 mt-2 ${isActive ? 'animate-slide-up animate-stagger-4' : 'opacity-0'}`}>
              <button className="pointer-events-auto flex items-center bg-[#e2ff46] hover:bg-[#d4f035] text-gray-900 font-bold text-xs pl-6 pr-1.5 py-1.5 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95">
                {p.cta}
                <div className="ml-4 bg-black rounded-full p-2 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </button>

              {/* Minimalist Color Selector */}
              {(isAuriculares || isIphone) && (
                <div className="flex items-center gap-1.5 pointer-events-auto bg-white/60 backdrop-blur-sm px-3 py-2 rounded-full border border-white/40 shadow-sm ml-2">
                  {COLORS.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => setActiveColor(c.hex)}
                      title={c.name}
                      className={`rounded-full transition-all shadow-sm ${activeColor === c.hex ? 'ring-1 ring-gray-900 ring-offset-1 scale-110' : 'hover:scale-110'} ${isIphone ? 'w-5 h-5' : 'w-4 h-4'}`}
                      style={{ background: (c as any).gradient ?? c.hex }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-3xl flex flex-col justify-between pt-6 pb-8 px-6 border border-gray-200 shadow-md ${p.bg.startsWith('bg-') ? p.bg : `bg-linear-to-br ${p.bg}`}`}
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
          {/* Subtle gradient overlay to ensure text legibility */}
          <div className={`absolute inset-0 z-10 ${p.bg.includes('#f3f4f6') ? 'bg-linear-to-r from-white/90 via-white/40 to-transparent' : 'bg-linear-to-r from-purple-900/40 via-transparent to-transparent'}`} />
          <ImageWithSkeleton 
            src={p.image} 
            alt={p.title} 
            className={`opacity-100 transform ${isActive ? 'animate-reveal-up' : 'opacity-0'} ${
              p.image.includes('lifestyle') 
                ? 'absolute right-0 bottom-0 h-[110%] w-auto translate-x-12 object-contain' 
                : p.image.includes('airpods')
                ? 'absolute right-4 top-1/2 -translate-y-1/2 w-[50%] h-auto object-contain translate-x-4'
                : p.image.includes('iphone_promo')
                ? 'absolute right-0 top-1/2 -translate-y-1/2 h-[90%] w-auto object-contain translate-x-2'
                : 'w-full h-full object-cover'
            }`}
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
      ) : null}

      <div className={`relative z-10 pointer-events-none ${isActive ? '' : 'opacity-0'}`}>
        <p className={`${p.bg.includes('#f3f4f6') ? 'text-gray-500' : 'text-white/60'} text-xs font-semibold uppercase tracking-widest mb-1 ${isActive ? 'animate-slide-up animate-stagger-1' : ''}`}>{p.label}</p>
        {p.type === 'sale' ? (
          <>
            <p className={`${p.bg.includes('#f3f4f6') ? 'text-gray-900' : 'text-white'} font-bold text-sm ${isActive ? 'animate-slide-up animate-stagger-1' : ''}`}>SALE UP TO</p>
            <p className={`${p.bg.includes('#f3f4f6') ? 'text-gray-900' : 'text-white'} font-extrabold text-6xl leading-none ${isActive ? 'animate-slide-up animate-stagger-2' : ''}`}>{p.title}</p>
          </>
        ) : (
          <h3 className={`${p.bg.includes('#f3f4f6') ? 'text-gray-900' : 'text-white'} font-extrabold leading-tight ${p.type === 'hero' ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'} ${isActive ? 'animate-slide-up animate-stagger-2' : ''}`}>
            {p.title}
          </h3>
        )}
        <p className={`${p.bg.includes('#f3f4f6') ? 'text-gray-500' : 'text-white/70'} text-sm mt-2 max-w-[200px] ${isActive ? 'animate-slide-up animate-stagger-3' : ''}`}>{p.subtitle}</p>
      </div>

      <button className={`relative z-10 self-start mt-4 ${p.bg.includes('#f3f4f6') ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} font-semibold text-xs px-5 py-2 rounded-full hover:opacity-90 transition-colors shadow-md ${isActive ? 'animate-slide-up animate-stagger-4' : 'opacity-0'}`}>
        {p.cta}
      </button>


    </div>
  );
}

function SlideGrid({ slide, isActive }: { slide: Slide; isActive: boolean }) {
  const modelRef = useRef<any>(null);
  const heroPanel = slide.panels.find(p => p.type === 'hero');
  const defaultColor = heroPanel?.localModel?.includes('iphone') ? '#d4632a' : '#ffffff';
  const [activeColor, setActiveColor] = useState(defaultColor);

  return (
    <>
      {/* Mobile/tablet: solo el panel hero */}
      <div className="lg:hidden h-[420px]">
        {slide.panels.filter(p => p.type === 'hero').map((p) => (
          <BannerPanel
            key={p.area}
            p={p}
            modelRef={modelRef}
            activeColor={activeColor}
            setActiveColor={setActiveColor}
            isActive={isActive}
          />
        ))}
      </div>

      {/* Desktop: grid completo */}
      <div
        className="hidden lg:grid gap-4 h-[540px] p-4 bg-white rounded-2xl shadow-sm"
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
            isActive={isActive}
          />
        ))}
      </div>
    </>
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
    <div className="flex flex-col gap-3 pb-4 select-none">
      {/* viewport */}
      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex touch-pan-y" style={{ backfaceVisibility: 'hidden' }}>
          {SLIDES.map((slide, i) => (
            <div key={i} style={{ flex: '0 0 100%', minWidth: 0 }}>
              <SlideGrid slide={slide} isActive={i === selectedIndex} />
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
