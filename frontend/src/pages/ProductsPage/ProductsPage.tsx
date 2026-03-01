import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../shared/hooks/useAppDispatch';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import {
  fetchProducts,
  fetchCategories,
  selectProduct,
} from '../../features/products/store/productsSlice';
import { openCheckoutForm } from '../../features/checkout/store/checkoutSlice';
import { PageWrapper } from '../../shared/layout/PageWrapper';
import { HeroBanner } from '../../features/products/components/HeroBanner';
import { CategoryList } from '../../features/products/components/CategoryList';
import { SectionHeader } from '../../features/products/components/SectionHeader';
import type { Product } from '../../features/products/types';
import { FeaturedRow } from '../../features/products/components/FeaturedRow';
import { PromoBannersRow } from '../../features/products/components/PromoBannersRow';
import { CategoryShowcase } from '../../features/products/components/CategoryShowcase';
import { GamingShowcase } from '../../features/products/components/GamingShowcase';
import { SmartphoneShowcase } from '../../features/products/components/SmartphoneShowcase';
import { ROUTES } from '../../constants/routes';
import { useScrollReveal } from '../../shared/hooks/useScrollReveal';

const CACHE_TTL_MS = 5 * 60 * 1000;

export function ProductsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    items: products,
    categories,
    lastFetchedAt,
  } = useAppSelector((state) => state.products);

  useEffect(() => {
    const isStale = !lastFetchedAt || Date.now() - lastFetchedAt > CACHE_TTL_MS;
    if (isStale) dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch, lastFetchedAt]);

  useScrollReveal([products.length, categories.length]);

  const handlePay = (product: Product) => {
    dispatch(selectProduct(product.id));
    dispatch(openCheckoutForm({ productId: product.id, quantity: 1 }));
    navigate(ROUTES.CHECKOUT);
  };

 return (
    <PageWrapper>
      <div className="flex flex-col gap-10">
        {/* Hero Banner */}
        <div className="reveal">
          <HeroBanner />
        </div>

        {/* Explore Popular Categories */}
        <section
          className="reveal delay-100"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.07)',
            border: '1px solid #f0f0f0',
          }}
        >
          <SectionHeader title="Explore Popular Categories" actionLabel="View All" onAction={() => {}} />
          <CategoryList categories={categories} />
        </section>

        {/* Featured products row */}
        {products.length > 0 && (
          <div className="reveal">
            <FeaturedRow
              title="⚡ Más vendidos"
              products={products.slice(0, 8)}
              onPay={handlePay}
            />
          </div>
        )}

        {/* Promo Banners Row */}
        <div className="reveal">
          <PromoBannersRow />
        </div>

        {/* Category Showcase */}
        <div className="reveal">
          <CategoryShowcase />
        </div>

        {/* Gaming Showcase */}
        <div className="reveal">
          <GamingShowcase />
        </div>

        {/* Smartphone Showcase */}
        <div className="reveal">
          <SmartphoneShowcase />
        </div>

        {/* Second featured row */}
        {products.length > 0 && (
          <div className="reveal">
            <FeaturedRow
              title="🔥 Ofertas del día"
              products={products.slice(3, 11)}
              onPay={handlePay}
            />
          </div>
        )}

      </div>
    </PageWrapper>
  );
}
