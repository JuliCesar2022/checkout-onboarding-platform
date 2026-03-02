import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { openCart, closeCart } from '../../../features/cart/store/cartSlice';
import { CategoryNav } from '../Header/CategoryNav';
import { ROUTES } from '../../../constants/routes';

export function BottomNav() {
  const [showCategories, setShowCategories] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { items: cartItems, isOpen: cartIsOpen } = useAppSelector((state) => state.cart);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const isHome = location.pathname === ROUTES.PRODUCTS;

  return (
    <>
      {/* Categories bottom sheet */}
      {showCategories && (
        <div
          className="sm:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setShowCategories(false)}
        >
          <div
            className="absolute bottom-16 left-0 right-0 bg-white rounded-t-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 pb-2">
              Categorías
            </p>
            <CategoryNav />
            <div className="h-2" />
          </div>
        </div>
      )}

      {/* Bottom bar — mobile only */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100">
        <div className="flex items-center justify-around h-16 px-2">

          {/* Inicio */}
          <button
            onClick={() => { setShowCategories(false); navigate(ROUTES.PRODUCTS); }}
            className={`flex flex-col items-center gap-0.5 flex-1 py-2 transition-colors ${
              isHome && !showCategories ? 'text-gray-900' : 'text-gray-400'
            }`}
          >
            <svg
              className="w-6 h-6"
              fill={isHome && !showCategories ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={isHome && !showCategories ? 0 : 1.8}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-[10px] font-medium">Inicio</span>
          </button>

          {/* Categorías */}
          <button
            onClick={() => setShowCategories((v) => !v)}
            className={`flex flex-col items-center gap-0.5 flex-1 py-2 transition-colors ${
              showCategories ? 'text-gray-900' : 'text-gray-400'
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={showCategories ? 2.5 : 1.8}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <span className="text-[10px] font-medium">Categorías</span>
          </button>

          {/* Carrito */}
          <button
            onClick={() => {
              setShowCategories(false);
              dispatch(cartIsOpen ? closeCart() : openCart());
            }}
            className={`relative flex flex-col items-center gap-0.5 flex-1 py-2 transition-colors ${
              cartIsOpen ? 'text-gray-900' : 'text-gray-400'
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={cartIsOpen ? 2.5 : 1.8}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute top-1.5 right-[calc(50%-12px)] flex h-4 w-4 items-center justify-center rounded-full bg-[#222] text-[9px] font-bold text-white leading-none">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
            <span className="text-[10px] font-medium">Carrito</span>
          </button>

        </div>
      </nav>
    </>
  );
}
