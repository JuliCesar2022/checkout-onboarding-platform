import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../../shared/hooks/useAppDispatch';
import { addToCart } from '../../../cart/store/cartSlice';
import { formatCOP } from '../../../../shared/utils/currencyFormat';
import type { Product } from '../../../../shared/interfaces';
import { Button } from '../../../../shared/ui/Button';
import { StockBadge } from '../StockBadge';
import { productDetailPath } from '../../../../constants/routes';
import { ImageCarousel } from '../../../../shared/ui/ImageCarousel';

interface ProductCardProps {
  product: Product;
  onPay: (product: Product) => void;
  /** Force the "Comprar ahora" button to be visible regardless of screen size */
  showBuyButton?: boolean;
}

export const ProductCard = memo(({ product, onPay, showBuyButton = false }: ProductCardProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isOutOfStock = product.stock === 0;

  const images = product.images?.length
    ? product.images
    : product.imageUrl
      ? [product.imageUrl]
      : [];

  return (
    <article
      aria-label={product.name}
      className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-1 will-change-transform h-full"
      onClick={() => navigate(productDetailPath(product.id))}
    >
      {/* Image — aspect-ratio scales with card width */}
      <div className="relative aspect-[4/3] bg-gray-50 shrink-0 w-full">
        <ImageCarousel
          images={images}
          alt={product.name}
          stopPropagation
          className="absolute inset-0"
        />
        <div className="absolute top-2 right-2 z-10">
          <StockBadge stock={product.stock} />
        </div>
      </div>

      <div className="flex flex-col flex-1 p-3 sm:p-4 gap-1.5 sm:gap-2">
        <h2 className="font-semibold text-gray-900 text-sm sm:text-base leading-snug line-clamp-2 h-[2.625rem] sm:h-[3rem]">
          {product.name}
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 h-8 sm:h-10">{product.description}</p>
        <p className="text-base sm:text-lg font-bold text-gray-900 mt-auto pt-2">
          {formatCOP(product.priceInCents)}
        </p>

        <div className="flex gap-1.5 sm:gap-2 mt-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              dispatch(addToCart({ productId: product.id, name: product.name, imageUrl: product.imageUrl, priceInCents: product.priceInCents }));
            }}
            disabled={isOutOfStock}
            className="shrink-0 cursor-pointer rounded-xl border border-gray-200 p-2 sm:p-2.5 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Agregar al carrito"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
          <div className={`${showBuyButton ? 'flex' : 'hidden sm:flex'} flex-1`}>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onPay(product);
              }}
              disabled={isOutOfStock}
              className="flex-1 text-sm"
            >
              Comprar
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
});

ProductCard.displayName = 'ProductCard';
