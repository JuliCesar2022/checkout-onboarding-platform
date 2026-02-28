import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { fetchProducts, selectProduct } from '../../store/slices/productsSlice';
import { openCheckoutForm } from '../../store/slices/checkoutSlice';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { ProductGrid } from '../../components/products/ProductGrid';
import { ErrorBanner } from '../../components/ui/ErrorBanner';
import { Spinner } from '../../components/ui/Spinner';
import type { Product } from '../../types/product.types';
import { ROUTES } from '../../constants/routes';

export function ProductsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items: products, status, error } = useAppSelector((state) => state.products);

  useEffect(() => {
    // TODO: check lastFetchedAt cache before fetching
    dispatch(fetchProducts());
  }, [dispatch]);

  const handlePay = (product: Product) => {
    dispatch(selectProduct(product.id));
    dispatch(openCheckoutForm({ productId: product.id, quantity: 1 }));
    navigate(ROUTES.CHECKOUT);
  };

  return (
    <PageWrapper>
      {status === 'loading' && <Spinner />}
      <ErrorBanner message={error} />
      <ProductGrid products={products} onPay={handlePay} />
    </PageWrapper>
  );
}
