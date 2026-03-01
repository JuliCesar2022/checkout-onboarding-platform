import { useEffect } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { fetchCategories } from '../../../features/products/store/productsSlice';

export function CategoryNav() {
  const dispatch = useAppDispatch();
  const { categories, status } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (categories.length === 0 && (status === 'idle' || status === 'succeeded')) {
      // Solo fetch si realmente no hay nada
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length, status]);

  return (
    <div style={{ backgroundColor: '#ffffff', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.07)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1 overflow-x-auto py-2" style={{ scrollbarWidth: 'none' }}>
          {/* All Categories button */}
          <button className="flex items-center gap-1.5 flex-shrink-0 text-sm font-semibold text-gray-800 hover:text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 mr-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            All Categories
            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Category links from backend */}
          {categories.map((cat) => (
            <button
              key={cat.id}
              className="flex-shrink-0 text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              {cat.name}
            </button>
          ))}

          {/* Loading placeholders if needed */}
          {status === 'loading' && categories.length === 0 && (
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-8 w-24 bg-gray-100 animate-pulse rounded-lg" />
              ))}
            </div>
          )}
        </nav>
      </div>
    </div>
  );
}
