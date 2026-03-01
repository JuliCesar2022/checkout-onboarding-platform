import { useState } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { openCart, closeCart } from '../../../features/cart/store/cartSlice';
import { CategoryNav } from './CategoryNav';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  const [query, setQuery] = useState('');
  const dispatch = useAppDispatch();
  const { items: cartItems, isOpen: cartIsOpen } = useAppSelector((state) => state.cart);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query.trim());
  };

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-100">
      {/* Top bar: logo + search + cart */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
        <span className="text-xl font-bold flex-shrink-0" style={{ color: '#222222' }}>TechStore</span>

        <form onSubmit={handleSubmit} className="flex-1 max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full rounded-xl border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-400 transition-colors"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </form>

        {/* Cart button */}
        <button
          onClick={() => dispatch(cartIsOpen ? closeCart() : openCart())}
          className="relative flex-shrink-0 rounded-xl p-2.5 text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
          aria-label={`Carrito${cartCount > 0 ? `, ${cartCount} artículos` : ''}`}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#222] text-[10px] font-bold text-white">
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Category nav bar */}
      <CategoryNav />
    </header>
  );
}
