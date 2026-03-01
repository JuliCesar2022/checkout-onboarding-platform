import { ProductCard } from '../ProductCard/ProductCard';
import type { Product } from '../../types';

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
        className="flex gap-4 overflow-x-auto pb-6"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <div key={product.id} className="shrink-0 w-72">
            <ProductCard 
              product={product} 
              onPay={onPay || (() => {})} 
            />
          </div>
        ))}
      </div>
    </section>
  );
}
