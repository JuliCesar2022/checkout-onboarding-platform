import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProductsPage } from './pages/ProductsPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { TransactionStatusPage } from './pages/TransactionStatusPage'
import { ROUTES } from './constants/routes'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />
        <Route path={ROUTES.CHECKOUT} element={<CheckoutPage />} />
        <Route path={ROUTES.TRANSACTION_STATUS} element={<TransactionStatusPage />} />
        <Route path="*" element={<Navigate to={ROUTES.PRODUCTS} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
