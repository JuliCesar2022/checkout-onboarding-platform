import type { CartItem as ICartItem } from '../../../../shared/interfaces';
import { formatCOP } from '../../../../shared/utils/currencyFormat';

interface CartItemProps {
  item: ICartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove?: () => void;
  onToggleSelect?: () => void;
  isSelected?: boolean;
  showCheckbox?: boolean;
  compact?: boolean;
}

export function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  onToggleSelect,
  isSelected = true,
  showCheckbox = false,
  compact = false,
}: CartItemProps) {
  return (
    <div
      className={`rounded-2xl border p-3 transition-colors ${
        isSelected ? 'border-gray-300 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'
      }`}
    >
      <div className="flex gap-3">
        {showCheckbox && (
          <div className="flex items-start pt-0.5 shrink-0">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onToggleSelect}
              className="w-4 h-4 rounded border-gray-300 accent-[#222] cursor-pointer"
              aria-label={`Seleccionar ${item.name}`}
            />
          </div>
        )}

        <div className={`${compact ? 'w-12 h-12' : 'w-14 h-14'} rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center`}>
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-1" />
          ) : (
            <span className={compact ? 'text-xl' : 'text-2xl'}>📦</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug pr-1">{item.name}</p>
          <p className="text-sm font-bold text-gray-900 mt-1">{formatCOP(item.priceInCents * item.quantity)}</p>
          {item.quantity > 1 && !compact && (
            <p className="text-xs text-gray-400">{formatCOP(item.priceInCents)} c/u</p>
          )}
        </div>

        {onRemove && (
          <button
            onClick={onRemove}
            className="self-start shrink-0 p-1 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
            aria-label="Eliminar del carrito"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 mt-3">
        <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1">
          <button
            onClick={() => onUpdateQuantity(item.quantity - 1)}
            disabled={item.quantity <= 1 && !onRemove}
            className="w-6 h-6 rounded-md flex items-center justify-center text-gray-500 hover:bg-white hover:shadow-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Disminuir cantidad"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
            </svg>
          </button>
          <span className="w-7 text-center text-sm font-semibold text-gray-900">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.quantity + 1)}
            className="w-6 h-6 rounded-md flex items-center justify-center text-gray-500 hover:bg-white hover:shadow-sm transition-all"
            aria-label="Aumentar cantidad"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
