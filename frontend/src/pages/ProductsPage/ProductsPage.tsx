import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../shared/hooks/useAppDispatch';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import {
  fetchProducts,
  fetchCategories,
  selectProduct,
} from '../../features/products/store/productsSlice';
import { openCheckoutForm, resetCheckout } from '../../features/checkout/store/checkoutSlice';
import { productsApi } from '../../features/products/api';
import { Modal } from '../../shared/ui/Modal';
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
  const { step, selectedProductId, quantity } = useAppSelector((state) => state.checkout);

  // Show pending session modal after page loads — delay so the page renders first
  const hasPending = step !== 'IDLE' && step !== 'COMPLETE' && !!selectedProductId;
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [pendingProduct, setPendingProduct] = useState<{ name: string; imageUrl: string | null; priceInCents: number } | null>(null);

  useEffect(() => {
    if (!hasPending || !selectedProductId) return;
    // Load product data and then open modal with a short delay for page to settle
    productsApi.fetchProductById(selectedProductId).then((p) => {
      setPendingProduct({ name: p.name, imageUrl: p.imageUrl, priceInCents: p.priceInCents });
      const timer = setTimeout(() => setShowPendingModal(true), 600);
      return () => clearTimeout(timer);
    }).catch(() => {});
  }, []);

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

  const handleResumePending = () => {
    setShowPendingModal(false);
    navigate(ROUTES.CHECKOUT);
  };

  const handleDiscardPending = () => {
    dispatch(resetCheckout());
    setShowPendingModal(false);
  };

 return (
    <PageWrapper>
      <div className="flex flex-col gap-10">

        {/* Pending checkout modal */}
        <Modal isOpen={showPendingModal} onClose={handleDiscardPending} title="Compra pendiente">
          <div className="flex flex-col items-center text-center gap-5 py-2">
            {/* Product image */}
            <div className="w-full rounded-2xl bg-gray-50 overflow-hidden" style={{ height: '220px' }}>
              {pendingProduct?.imageUrl ? (
                <img src={pendingProduct.imageUrl} alt={pendingProduct.name} className="w-full h-full object-cover" />
              ) : (
                <svg className="w-20 h-20 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                </svg>
              )}
            </div>

            {/* Info */}
            <div>
              {pendingProduct ? (
                <>
                  <h3 className="text-lg font-bold text-gray-900">{pendingProduct.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {quantity} {quantity === 1 ? 'unidad' : 'unidades'} ·{' '}
                    <span className="font-semibold text-gray-700">
                      {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(pendingProduct.priceInCents * quantity / 100)}
                    </span>
                  </p>
                </>
              ) : (
                <p className="text-gray-500 text-sm">Cargando producto...</p>
              )}
              <p className="text-sm text-gray-500 mt-3">
                Dejaste un proceso de pago sin completar. ¿Quieres retomarlo donde lo dejaste?
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 w-full">
              <button
                onClick={handleDiscardPending}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Descartar
              </button>
              <button
                onClick={handleResumePending}
                className="flex-1 rounded-xl bg-[#222] px-4 py-3 text-sm font-semibold text-white hover:bg-[#333] transition-colors"
              >
                Continuar compra
              </button>
            </div>
          </div>
        </Modal>

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
