import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

export function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-100 px-4 py-3">
      <div className="max-w-7xl mx-auto flex gap-6 items-center">
        <h1 className="font-bold text-lg text-gray-900">Checkout Flow</h1>

        <div className="flex gap-2 ml-auto">
          <Link
            to={ROUTES.PRODUCTS}
            className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${
              isActive(ROUTES.PRODUCTS)
                ? 'bg-gray-900 text-white shadow-sm'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            1. Products
          </Link>

          <Link
            to={ROUTES.CHECKOUT}
            className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${
              isActive(ROUTES.CHECKOUT)
                ? 'bg-gray-900 text-white shadow-sm'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            2. Checkout
          </Link>

          <Link
            to={ROUTES.TRANSACTION_STATUS}
            className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${
              isActive(ROUTES.TRANSACTION_STATUS)
                ? 'bg-gray-900 text-white shadow-sm'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            3. Status
          </Link>
        </div>
      </div>

    </nav>
  );
}
