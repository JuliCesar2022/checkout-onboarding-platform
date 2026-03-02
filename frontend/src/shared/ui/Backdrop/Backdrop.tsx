import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface BackdropProps {
  isOpen: boolean;
  children: React.ReactNode;
  onClose?: () => void;
}

/**
 * Material Design Backdrop component.
 * Slides up from the bottom to show the order summary (mobile only).
 * Reference: https://m2.material.io/components/backdrop
 */
export function Backdrop({ isOpen, children, onClose }: BackdropProps) {
  useEffect(() => {
    if (isOpen) {
      const isMobile = window.innerWidth < 1024;
      if (isMobile) {
        document.body.style.overflow = 'hidden';
      }
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="lg:hidden fixed inset-0 z-[9999]">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        className="fixed inset-x-0 bottom-0 z-[10000] flex max-h-[90vh] flex-col rounded-t-2xl bg-white shadow-2xl animate-in slide-in-from-bottom duration-300 ease-out pb-[env(safe-area-inset-bottom)]"
        role="region"
        aria-label="Resumen del pedido"
      >
        <div className="flex items-center justify-center pb-2 pt-4">
          <div className="h-1.5 w-12 rounded-full bg-gray-300" />
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-8 pt-2">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
