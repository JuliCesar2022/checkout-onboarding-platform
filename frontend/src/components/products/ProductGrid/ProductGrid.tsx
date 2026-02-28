import type { Product } from '../../../types/product.types';
import { ProductCard } from '../ProductCard';

interface ProductGridProps {
  products: Product[];
  onPay: (product: Product) => void;
}

export function ProductGrid({ products, onPay }: ProductGridProps) {
  // TODO: implement responsive grid with Tailwind grid classes
  return (
    <section aria-label="Product catalog">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onPay={onPay} />
      ))}
    </section>
  );
}
