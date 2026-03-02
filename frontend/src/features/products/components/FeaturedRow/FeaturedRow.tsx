import { ProductCard } from '../ProductCard/ProductCard';
import type { Product } from '../../../../shared/interfaces';

interface FeaturedRowProps {
  title: string;
  products: Product[];
  onPay?: (product: Product) => void;
}

export function FeaturedRow({ title, products, onPay }: FeaturedRowProps) {
  if (products.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <button className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors cursor-pointer">
          Ver todos &gt;
        </button>
      </div>

      <div
        className="flex gap-3 sm:gap-4 overflow-x-auto pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <div key={product.id} className="shrink-0 w-44 sm:w-60">
            <ProductCard
              product={product}
              onPay={onPay || (() => {})}
              showBuyButton
            />
          </div>
        ))}
      </div>
    </section>
  );
}
