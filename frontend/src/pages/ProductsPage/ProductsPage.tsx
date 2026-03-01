import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../shared/hooks/useAppDispatch';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import {
  fetchProducts,
  fetchMoreProducts,
  fetchCategories,
  selectProduct,
} from '../../features/products/store/productsSlice';
import { openCheckoutForm } from '../../features/checkout/store/checkoutSlice';
import { PageWrapper } from '../../shared/layout/PageWrapper';
import { ProductGrid } from '../../features/products/components/ProductGrid';
import { HeroBanner } from '../../features/products/components/HeroBanner';
import { CategoryList } from '../../features/products/components/CategoryList';
import { SectionHeader } from '../../features/products/components/SectionHeader';
import { ErrorBanner } from '../../shared/ui/ErrorBanner';
import { Spinner } from '../../shared/ui/Spinner';
import { Button } from '../../shared/ui/Button';
import type { Product } from '../../features/products/types';
import { FeaturedRow } from '../../features/products/components/FeaturedRow';
import { ROUTES } from '../../constants/routes';

const CACHE_TTL_MS = 5 * 60 * 1000;

export function ProductsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    items: products,
    categories,
    status,
    error,
    lastFetchedAt,
    hasMore,
    nextCursor,
  } = useAppSelector((state) => state.products);

  useEffect(() => {
    const isStale = !lastFetchedAt || Date.now() - lastFetchedAt > CACHE_TTL_MS;
    if (isStale) dispatch(fetchProducts());
    dispatch(fetchCategories());
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
      <div className="flex flex-col gap-10">
        {/* Hero Banner */}
        <HeroBanner />

        {/* Featured products row */}
        {products.length > 0 && (
          <FeaturedRow
            title="⚡ Más vendidos"
            products={products.slice(0, 8)}
            onPay={handlePay}
          />
        )}

        {/* Explore Popular Categories */}
        <section>
          <SectionHeader title="Explore Popular Categories" actionLabel="View All" onAction={() => {}} />
          <CategoryList categories={categories} />
        </section>

        {/* Products Grid */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <SectionHeader title="Today's Best Deals For You!" />
          <ErrorBanner message={error} />
          {isFirstLoad ? (
            <Spinner />
          ) : (
            <>
              <ProductGrid products={products} onPay={handlePay} />
              {hasMore && status !== 'loading' && (
                <div className="flex justify-center mt-8">
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
        </section>
      </div>
    </PageWrapper>
  );
}
