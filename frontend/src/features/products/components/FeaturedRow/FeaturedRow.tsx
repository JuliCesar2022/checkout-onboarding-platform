import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../../shared/hooks/useAppDispatch';
import { addToCart } from '../../../cart/store/cartSlice';
import type { Product } from '../../types';
import { formatCOP } from '../../../../shared/utils/currencyFormat';
import { productDetailPath } from '../../../../constants/routes';

interface FeaturedRowProps {
  title: string;
  products: Product[];
  onPay?: (product: Product) => void;
}

export function FeaturedRow({ title, products, onPay }: FeaturedRowProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  if (products.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <button className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors">
          Ver todos &gt;
        </button>
      </div>

      <div
        className="flex gap-4 overflow-x-auto pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => {
          const isOutOfStock = product.stock === 0;
          return (
            <article
              key={product.id}
              onClick={() => navigate(productDetailPath(product.id))}
              className="flex-shrink-0 w-52 cursor-pointer group"
            >
              <div className="w-full h-48 rounded-xl bg-gray-50 overflow-hidden border border-gray-100 group-hover:shadow-md transition-shadow">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">
                    📦
                  </div>
                )}
              </div>

              <div className="mt-2 px-1">
                <p className="text-sm text-gray-800 font-medium leading-snug line-clamp-2 group-hover:text-gray-900 transition-colors">
                  {product.name}
                </p>
                <p className="text-sm font-bold text-gray-900 mt-1">
                  {formatCOP(product.priceInCents)}
                </p>
                <div className="flex gap-1.5 mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(addToCart({ productId: product.id, name: product.name, imageUrl: product.imageUrl, priceInCents: product.priceInCents }));
                    }}
                    disabled={isOutOfStock}
                    className="flex-shrink-0 rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Agregar al carrito"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>
                  {onPay && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPay(product);
                      }}
                      disabled={isOutOfStock}
                      className="flex-1 rounded-lg bg-[#222] py-1.5 px-2 text-xs font-semibold text-white hover:bg-[#333] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Comprar
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
