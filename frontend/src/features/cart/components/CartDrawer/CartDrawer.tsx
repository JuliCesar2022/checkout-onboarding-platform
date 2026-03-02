import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../../shared/hooks/useAppDispatch';
import { useAppSelector } from '../../../../shared/hooks/useAppSelector';
import {
  closeCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} from '../../store/cartSlice';
import { openCheckoutForm } from '../../../checkout/store/checkoutSlice';
import { selectProduct } from '../../../products/store/productsSlice';
import { ROUTES } from '../../../../constants/routes';
import { CartItem } from '../CartItem/CartItem';

const formatCOP = (cents: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(cents / 100);

export function CartDrawer() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, isOpen } = useAppSelector((state) => state.cart);

  // Local selection state — all items selected by default
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(items.map((i) => i.productId))
  );

  // Keep selection in sync when items change (new item added → auto-select it)
  useEffect(() => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      items.forEach((i) => {
        if (!next.has(i.productId)) next.add(i.productId);
      });
      // Remove ids that are no longer in cart
      next.forEach((id) => {
        if (!items.find((i) => i.productId === id)) next.delete(id);
      });
      return next;
    });
  }, [items]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const selectedItems = items.filter((i) => selectedIds.has(i.productId));
  const selectedCents = selectedItems.reduce(
    (sum, i) => sum + i.priceInCents * i.quantity,
    0
  );
  const allSelected = items.length > 0 && selectedIds.size === items.length;

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((i) => i.productId)));
    }
  };

  const toggleItem = (productId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  // Buy all selected items — passes full list to checkout, uses first item as "primary"
  const handleBuySelected = () => {
    if (selectedItems.length === 0) return;
    const first = selectedItems[0];
    dispatch(closeCart());
    dispatch(selectProduct(first.productId));
    dispatch(openCheckoutForm({
      productId: first.productId,
      quantity: first.quantity,
      cartItems: selectedItems,
    }));
    navigate(ROUTES.CHECKOUT);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-55 bg-black/40 backdrop-blur-sm"
          onClick={() => dispatch(closeCart())}
          aria-hidden="true"
        />
      )}

      {/* Drawer — z-[60] so it renders above the sticky header (z-50) */}
      <div
        className={`fixed top-0 right-0 z-60 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Carrito de compras"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="text-base font-semibold text-gray-900">
              Carrito
              {totalItems > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-500">({totalItems} {totalItems === 1 ? 'artículo' : 'artículos'})</span>
              )}
            </h2>
          </div>
          <button
            onClick={() => dispatch(closeCart())}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Cerrar carrito"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Select-all bar */}
        {items.length > 0 && (
          <div className="flex items-center justify-between px-5 py-2 bg-gray-50 border-b border-gray-100">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                className="w-4 h-4 rounded border-gray-300 accent-[#222] cursor-pointer"
              />
              <span className="text-xs font-medium text-gray-600">
                {allSelected ? 'Deseleccionar todo' : 'Seleccionar todo'}
              </span>
            </label>
            {selectedIds.size > 0 && (
              <span className="text-xs text-gray-400">{selectedIds.size} seleccionado{selectedIds.size !== 1 ? 's' : ''}</span>
            )}
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Tu carrito está vacío</p>
                <p className="text-sm text-gray-400 mt-1">Agrega productos para comenzar</p>
              </div>
              <button
                onClick={() => {
                  dispatch(closeCart());
                  navigate(ROUTES.PRODUCTS);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="rounded-xl bg-[#222] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#333] transition-colors"
              >
                Explorar productos
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.productId}>
                  <CartItem
                    item={item}
                    isSelected={selectedIds.has(item.productId)}
                    showCheckbox
                    onToggleSelect={() => toggleItem(item.productId)}
                    onUpdateQuantity={(newQty: number) => {
                      if (newQty < 1) {
                        dispatch(removeFromCart(item.productId));
                      } else {
                        dispatch(updateQuantity({ productId: item.productId, quantity: newQty }));
                      }
                    }}
                    onRemove={() => dispatch(removeFromCart(item.productId))}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Subtotal {selectedIds.size > 0 ? `(${selectedIds.size} seleccionado${selectedIds.size !== 1 ? 's' : ''})` : ''}
              </span>
              <span className="text-base font-bold text-gray-900">{formatCOP(selectedCents)}</span>
            </div>
            <p className="text-xs text-gray-400">Los fees de envío y Wompi se calculan al hacer checkout.</p>

            {/* Buy selected */}
            <button
              onClick={handleBuySelected}
              disabled={selectedIds.size === 0}
              className="w-full rounded-xl bg-[#222] py-2.5 text-sm font-semibold text-white hover:bg-[#333] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {selectedIds.size === 0 ? 'Selecciona artículos' : 'Comprar'}
            </button>

            <button
              onClick={() => dispatch(clearCart())}
              className="w-full rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </>
  );
}
