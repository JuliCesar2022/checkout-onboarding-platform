import { useNavigate } from 'react-router-dom';
import { formatCOP } from '../../../../shared/utils/currencyFormat';
import type { Product } from '../../types';
import { Button } from '../../../../shared/ui/Button';
import { StockBadge } from '../StockBadge';
import { productDetailPath } from '../../../../constants/routes';

interface ProductCardProps {
  product: Product;
  onPay: (product: Product) => void;
}

export function ProductCard({ product, onPay }: ProductCardProps) {
  const navigate = useNavigate();
  const isOutOfStock = product.stock === 0;

  return (
    <article
      aria-label={product.name}
      className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={() => navigate(productDetailPath(product.id))}
    >
      <div className="relative h-48 bg-gray-50 flex-shrink-0">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
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

      <div className="flex flex-col flex-1 p-4 gap-2">
        <h2 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2">
          {product.name}
        </h2>
        <p className="text-sm text-gray-500 line-clamp-3 flex-1">{product.description}</p>
        <p className="text-xl font-bold text-indigo-600 mt-1">{formatCOP(product.priceInCents)}</p>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onPay(product);
          }}
          disabled={isOutOfStock}
          className="w-full mt-2"
        >
          Pay with credit card
        </Button>
      </div>
    </article>
  );
}
