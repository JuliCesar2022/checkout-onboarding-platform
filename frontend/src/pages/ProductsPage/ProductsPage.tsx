import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../shared/hooks/useAppDispatch';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { fetchProducts, selectProduct } from '../../features/products/store/productsSlice';
import { openCheckoutForm } from '../../features/checkout/store/checkoutSlice';
import { PageWrapper } from '../../shared/layout/PageWrapper';
import { ProductGrid } from '../../features/products/components/ProductGrid';
import { ErrorBanner } from '../../shared/ui/ErrorBanner';
import { Spinner } from '../../shared/ui/Spinner';
import type { Product } from '../../features/products/types';
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
