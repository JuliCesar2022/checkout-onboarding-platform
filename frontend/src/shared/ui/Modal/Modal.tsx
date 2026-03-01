import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;
  // TODO: implement full-screen mobile modal with Tailwind
  return (
    <div role="dialog" aria-modal="true" aria-label={title}>
      <div onClick={onClose} />
      <div>
        {title && <h2>{title}</h2>}
        <button onClick={onClose} aria-label="Close modal">✕</button>
        {children}
      </div>
    </div>
  );
}
