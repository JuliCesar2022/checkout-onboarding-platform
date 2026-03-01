import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../shared/hooks/useAppDispatch';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import {
  fetchProducts,
  fetchMoreProducts,
  selectProduct,
} from '../../features/products/store/productsSlice';
import { openCheckoutForm } from '../../features/checkout/store/checkoutSlice';
import { PageWrapper } from '../../shared/layout/PageWrapper';
import { ProductGrid } from '../../features/products/components/ProductGrid';
import { ErrorBanner } from '../../shared/ui/ErrorBanner';
import { Spinner } from '../../shared/ui/Spinner';
import { Button } from '../../shared/ui/Button';
import type { Product } from '../../features/products/types';
import { ROUTES } from '../../constants/routes';

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export function ProductsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items: products, status, error, lastFetchedAt, hasMore, nextCursor } = useAppSelector(
    (state) => state.products,
  );

  useEffect(() => {
    const isStale = !lastFetchedAt || Date.now() - lastFetchedAt > CACHE_TTL_MS;
    if (isStale) dispatch(fetchProducts());
  }, [dispatch, lastFetchedAt]);

  const handlePay = (product: Product) => {
    dispatch(selectProduct(product.id));
    dispatch(openCheckoutForm({ productId: product.id, quantity: 1 }));
    navigate(ROUTES.CHECKOUT);
  };

  const handleLoadMore = () => {
    if (nextCursor) dispatch(fetchMoreProducts(nextCursor));
  };

  const isFirstLoad = status === 'loading' && products.length === 0;

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Products</h1>
        <ErrorBanner message={error} />
        {isFirstLoad ? (
          <Spinner />
        ) : (
          <>
            <ProductGrid products={products} onPay={handlePay} />
            {hasMore && status !== 'loading' && (
              <div className="flex justify-center mt-10">
                <Button variant="secondary" onClick={handleLoadMore}>
                  Load more
                </Button>
              </div>
            )}
            {status === 'loading' && products.length > 0 && (
              <div className="mt-6">
                <Spinner />
              </div>
            )}
          </>
        )}
      </div>
    </PageWrapper>
  );
}
