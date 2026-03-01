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

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalCents = items.reduce((sum, i) => sum + i.priceInCents * i.quantity, 0);

  const handleCheckoutItem = (productId: string, quantity: number) => {
    dispatch(closeCart());
    dispatch(selectProduct(productId));
    dispatch(openCheckoutForm({ productId, quantity }));
    navigate(ROUTES.CHECKOUT);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => dispatch(closeCart())}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
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
                onClick={() => dispatch(closeCart())}
                className="rounded-xl bg-[#222] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#333] transition-colors"
              >
                Explorar productos
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-3">
                  {/* Image */}
                  <div className="w-16 h-16 rounded-xl bg-white border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-1" />
                    ) : (
                      <span className="text-2xl text-gray-300">📦</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">{item.name}</p>
                    <p className="text-sm font-bold text-gray-900 mt-1">{formatCOP(item.priceInCents)}</p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          item.quantity === 1
                            ? dispatch(removeFromCart(item.productId))
                            : dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity - 1 }))
                        }
                        className="w-6 h-6 rounded-md border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                        aria-label="Disminuir cantidad"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="w-6 text-center text-sm font-semibold text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity + 1 }))}
                        className="w-6 h-6 rounded-md border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                        aria-label="Aumentar cantidad"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>

                      <button
                        onClick={() => handleCheckoutItem(item.productId, item.quantity)}
                        className="ml-auto rounded-lg bg-[#222] px-3 py-1 text-xs font-semibold text-white hover:bg-[#333] transition-colors"
                      >
                        Comprar
                      </button>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => dispatch(removeFromCart(item.productId))}
                    className="self-start p-1 text-gray-300 hover:text-red-400 transition-colors"
                    aria-label="Eliminar del carrito"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer total */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Subtotal estimado</span>
              <span className="text-base font-bold text-gray-900">{formatCOP(totalCents)}</span>
            </div>
            <p className="text-xs text-gray-400">Los fees de envío y Wompi se calculan al hacer checkout.</p>
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
