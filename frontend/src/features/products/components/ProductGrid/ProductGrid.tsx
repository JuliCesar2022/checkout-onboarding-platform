import type { Product } from '../../types';
import { ProductCard } from '../ProductCard';
import { ProductCardSkeleton } from '../ProductCard/ProductCardSkeleton';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onPay: (product: Product) => void;
}

export function ProductGrid({ products, isLoading, onPay }: ProductGridProps) {
  if (!isLoading && (!Array.isArray(products) || products.length === 0)) return null;

  return (
    <section
      aria-label="Product catalog"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {isLoading
        ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={`skeleton-${i}`} />)
        : products.map((product) => (
            <ProductCard key={product.id} product={product} onPay={onPay} />
          ))}
    </section>
  );
}
