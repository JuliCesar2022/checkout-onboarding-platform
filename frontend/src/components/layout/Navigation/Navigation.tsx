import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

export function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-slate-100 border-b border-slate-300 px-4 py-3">
      <div className="max-w-6xl mx-auto flex gap-6 items-center">
        <h1 className="font-bold text-lg text-slate-800">Wompi Checkout</h1>

        <div className="flex gap-4 ml-auto">
          <Link
            to={ROUTES.PRODUCTS}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              isActive(ROUTES.PRODUCTS)
                ? 'bg-blue-600 text-white'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            1. Products
          </Link>

          <Link
            to={ROUTES.CHECKOUT}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              isActive(ROUTES.CHECKOUT)
                ? 'bg-blue-600 text-white'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            2. Checkout
          </Link>

          <Link
            to={ROUTES.TRANSACTION_STATUS}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              isActive(ROUTES.TRANSACTION_STATUS)
                ? 'bg-blue-600 text-white'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            3. Status
          </Link>
        </div>
      </div>

      {/* Info actual de Redux state */}
      <div className="max-w-6xl mx-auto mt-2 text-xs text-slate-600">
        📍 Current path: <code className="bg-slate-200 px-2 py-1 rounded">{location.pathname}</code>
      </div>
    </nav>
  );
}
