import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types';
import { formatCOP } from '../../../../shared/utils/currencyFormat';
import { productDetailPath } from '../../../../constants/routes';

interface FeaturedRowProps {
  title: string;
  products: Product[];
  onPay?: (product: Product) => void;
}

export function FeaturedRow({ title, products }: FeaturedRowProps) {
  const navigate = useNavigate();

  if (products.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
          View All &gt;
        </button>
      </div>

      <div
        className="flex gap-4 overflow-x-auto pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
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
              <p className="text-sm text-gray-800 font-medium leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
                {product.name}
              </p>
              <p className="text-sm font-bold text-indigo-600 mt-1">
                {formatCOP(product.priceInCents)}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
