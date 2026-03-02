import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from './constants/routes'
import { CartDrawer } from './features/cart/components/CartDrawer/CartDrawer'
import { Spinner } from './shared/ui/Spinner'

const ProductsPage = lazy(() => import('./pages/ProductsPage').then(m => ({ default: m.ProductsPage })))
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })))
const TransactionStatusPage = lazy(() => import('./pages/TransactionStatusPage').then(m => ({ default: m.TransactionStatusPage })))

function App() {
  return (
    <BrowserRouter>
      <CartDrawer />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Spinner />
        </div>
      }>
        <Routes>
          <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />
          <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetailPage />} />
          <Route path={ROUTES.CHECKOUT} element={<CheckoutPage />} />
          <Route path={ROUTES.TRANSACTION_STATUS} element={<TransactionStatusPage />} />
          <Route path="*" element={<Navigate to={ROUTES.PRODUCTS} replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
