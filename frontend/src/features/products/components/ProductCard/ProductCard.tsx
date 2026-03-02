import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../../shared/hooks/useAppDispatch';
import { addToCart } from '../../../cart/store/cartSlice';
import { formatCOP } from '../../../../shared/utils/currencyFormat';
import type { Product } from '../../../../shared/interfaces';
import { Button } from '../../../../shared/ui/Button';
import { StockBadge } from '../StockBadge';
import { productDetailPath } from '../../../../constants/routes';
import { ImageWithSkeleton } from '../../../../shared/ui/ImageWithSkeleton';

interface ProductCardProps {
  product: Product;
  onPay: (product: Product) => void;
}

export const ProductCard = memo(({ product, onPay }: ProductCardProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isOutOfStock = product.stock === 0;

  return (
    <article
      aria-label={product.name}
      className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-1 will-change-transform"
      onClick={() => navigate(productDetailPath(product.id))}
    >
      <div className="relative h-36 sm:h-48 bg-gray-50 shrink-0">
        {product.imageUrl ? (
          <ImageWithSkeleton
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-5xl">
            📦
          </div>
        )}
        <div className="absolute top-2 right-2">
          <StockBadge stock={product.stock} />
        </div>
      </div>

      <div className="flex flex-col flex-1 p-3 sm:p-4 gap-1.5 sm:gap-2">
        <h2 className="font-semibold text-gray-900 text-sm sm:text-base leading-snug line-clamp-2">
          {product.name}
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 truncate">{product.description}</p>
        <p className="text-base sm:text-xl font-bold text-gray-900 mt-1">{formatCOP(product.priceInCents)}</p>

        <div className="flex gap-1.5 sm:gap-2 mt-1 sm:mt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              dispatch(addToCart({ productId: product.id, name: product.name, imageUrl: product.imageUrl, priceInCents: product.priceInCents }));
            }}
            disabled={isOutOfStock}
            className="shrink-0 cursor-pointer rounded-xl border border-gray-200 p-2 sm:p-3 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Agregar al carrito"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
          <div className="hidden sm:flex flex-1">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onPay(product);
              }}
              disabled={isOutOfStock}
              className="flex-1"
            >
              Comprar ahora
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
});

ProductCard.displayName = 'ProductCard';
