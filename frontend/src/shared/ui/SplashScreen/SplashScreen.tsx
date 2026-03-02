import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onDone: () => void;
}

export function SplashScreen({ onDone }: SplashScreenProps) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Start fade-out after 1.6s
    const fadeTimer = setTimeout(() => setFading(true), 1600);
    // Notify parent after fade completes (300ms transition)
    const doneTimer = setTimeout(() => onDone(), 1900);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black transition-opacity duration-300 ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Logo */}
      <div className="flex flex-col items-center gap-6 animate-[splash-in_0.5s_ease-out]">
        <img
          src="/logo.png"
          alt="TechStore logo"
          className="w-28 h-28 drop-shadow-2xl"
        />
        <span className="text-white text-2xl font-bold tracking-widest uppercase">
          TechStore
        </span>
      </div>

      {/* Bottom loading bar */}
      <div className="absolute bottom-12 w-32 h-0.5 bg-white/20 rounded-full overflow-hidden">
        <div className="h-full bg-white rounded-full animate-[loading-bar_1.6s_ease-out_forwards]" />
      </div>
    </div>
  );
}
