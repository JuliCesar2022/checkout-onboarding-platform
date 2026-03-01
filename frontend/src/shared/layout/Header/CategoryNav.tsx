import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { fetchCategories, fetchProducts, setActiveCategory } from '../../../features/products/store/productsSlice';
import { ROUTES } from '../../../constants/routes';

export function CategoryNav() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { categories, status, activeCategoryId } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (categories.length === 0 && (status === 'idle' || status === 'succeeded')) {
      // Solo fetch si realmente no hay nada
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length, status]);

  const handleCategorySelect = (categoryId: string | null) => {
    dispatch(setActiveCategory(categoryId));
    dispatch(fetchProducts());
    
    // Si no estamos en la página de productos, navegamos a ella
    if (location.pathname !== ROUTES.PRODUCTS) {
      navigate(ROUTES.PRODUCTS);
    }
  };

  return (
    <div style={{ backgroundColor: '#ffffff', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.07)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1 overflow-x-auto py-2" style={{ scrollbarWidth: 'none' }}>
          {/* All Categories button */}
          <button 
            onClick={() => handleCategorySelect(null)}
            className={`flex items-center gap-1.5 shrink-0 text-sm font-semibold cursor-pointer px-3 py-1.5 rounded-lg transition-colors border mr-2 ${
              activeCategoryId === null 
                ? 'bg-[#222] text-white border-[#222] hover:bg-[#333]' 
                : 'text-gray-800 hover:text-gray-600 hover:bg-gray-100 border-gray-200'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            All Categories
            <svg className={`w-3 h-3 ${activeCategoryId === null ? 'text-gray-300' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Category links from backend — max 5 */}
          {categories.slice(0, 5).map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`shrink-0 text-sm cursor-pointer px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                activeCategoryId === cat.id
                  ? 'bg-blue-100 text-blue-700 font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
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
