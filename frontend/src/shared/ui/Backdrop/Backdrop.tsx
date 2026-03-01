import React from 'react';

interface BackdropProps {
  isOpen: boolean;
  children: React.ReactNode;
}

/**
 * Material Design Backdrop component.
 * Slides up from the bottom to show the order summary.
 * Reference: https://m2.material.io/components/backdrop
 */
export function Backdrop({ isOpen, children }: BackdropProps) {
  // TODO: implement slide-up animation with Tailwind classes
  if (!isOpen) return null;
  return (
    <div role="region" aria-label="Order summary">
      {children}
    </div>
  );
}
