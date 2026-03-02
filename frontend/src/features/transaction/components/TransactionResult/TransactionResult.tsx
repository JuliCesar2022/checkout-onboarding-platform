import React from 'react';
import type { TransactionStatus } from '../../types';

interface TransactionResultProps {
  status: TransactionStatus | null;
  reference: string | null;
  amountInCents: number | null;
  onReturn: () => void;
}

const CONFIG: Record<
  NonNullable<TransactionStatus>,
  { bg: string; label: string; icon: React.ReactNode }
> = {
  APPROVED: {
    bg: '#22c55e',
    label: '¡Pago aprobado!',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="w-20 h-20">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
  DECLINED: {
    bg: '#ef4444',
    label: 'Pago rechazado',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="w-20 h-20">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
  },
  PENDING: {
    bg: '#f59e0b',
    label: 'Pago en proceso',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-20 h-20">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  ERROR: {
    bg: '#6b7280',
    label: 'Error en el pago',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="w-20 h-20">
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
  },
  VOIDED: {
    bg: '#9ca3af',
    label: 'Pago anulado',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="w-20 h-20">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
        <path d="M15 9l-6 6M9 9l6 6" />
      </svg>
    ),
  },
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount / 100);

export function TransactionResult({ status, reference, amountInCents, onReturn }: TransactionResultProps) {
  const cfg = CONFIG[status ?? 'PENDING'];

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-white">
      {/* Expanding blob */}
      <div
        className="blob-expand absolute rounded-full pointer-events-none"
        style={{
          width: 80,
          height: 80,
          backgroundColor: cfg.bg,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Icon — pops after blob settles */}
      <div className="icon-pop relative z-10 flex items-center justify-center">
        {cfg.icon}
      </div>

      {/* Content — fades up after icon appears */}
      <div className="content-fade-up relative z-10 mt-8 flex flex-col items-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-bold text-white">{cfg.label}</h1>

        <div className="flex flex-col gap-1 text-white/90 text-sm">
          {reference && (
            <p>
              Referencia: <span className="font-semibold">{reference}</span>
            </p>
          )}
          {amountInCents != null && (
            <p>
              Total: <span className="font-semibold">{formatCurrency(amountInCents)}</span>
            </p>
          )}
        </div>

        <button
          onClick={onReturn}
          className="mt-4 rounded-xl border-2 border-white/80 px-8 py-3 text-sm font-semibold text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
        >
          Volver a la tienda
        </button>
      </div>
    </div>
  );
}
