import type { Product } from '../../types';
import { ProductCard } from '../ProductCard';

interface ProductGridProps {
  products: Product[];
  onPay: (product: Product) => void;
}

export function ProductGrid({ products, onPay }: ProductGridProps) {
  if (!Array.isArray(products) || products.length === 0) return null;

  return (
    <section
      aria-label="Product catalog"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onPay={onPay} />
      ))}
    </section>
  );
}
