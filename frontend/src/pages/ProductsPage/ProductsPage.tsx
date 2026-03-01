import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../shared/hooks/useAppDispatch';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import {
  fetchProducts,
  fetchCategories,
  selectProduct,
  setActiveCategory,
  setSearchQuery,
  fetchMoreProducts,
} from '../../features/products/store/productsSlice';
import { openCheckoutForm, resetCheckout } from '../../features/checkout/store/checkoutSlice';
import { productsApi } from '../../features/products/api';
import { Modal } from '../../shared/ui/Modal';
import { PageWrapper } from '../../shared/layout/PageWrapper';
import { HeroBanner } from '../../features/products/components/HeroBanner';
import { CategoryList } from '../../features/products/components/CategoryList';
import { SectionHeader } from '../../features/products/components/SectionHeader';
import type { Product, Category } from '../../features/products/types';
import { FeaturedRow } from '../../features/products/components/FeaturedRow';
import { PromoBannersRow } from '../../features/products/components/PromoBannersRow';
import { CategoryShowcase } from '../../features/products/components/CategoryShowcase';
import { GamingShowcase } from '../../features/products/components/GamingShowcase';
import { SmartphoneShowcase } from '../../features/products/components/SmartphoneShowcase';
import { ProductGrid } from '../../features/products/components/ProductGrid';
import { ROUTES } from '../../constants/routes';
import { useScrollReveal } from '../../shared/hooks/useScrollReveal';

const CACHE_TTL_MS = 5 * 60 * 1000;

export function ProductsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const observerTarget = useRef<HTMLDivElement>(null);
  const {
    items: products,
    categories,
    activeCategoryId,
    searchQuery,
    lastFetchedAt,
    status,
    hasMore,
    nextCursor,
  } = useAppSelector((state) => state.products);
  const { step, selectedProductId, quantity } = useAppSelector((state) => state.checkout);

  // Show pending session modal after page loads
  const hasPending = (step === 'FORM' || step === 'SUMMARY') && !!selectedProductId;
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [pendingProduct, setPendingProduct] = useState<{ name: string; imageUrl: string | null; priceInCents: number } | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem('checkout_just_reset') === '1') {
      sessionStorage.removeItem('checkout_just_reset');
      return;
    }
    if (!hasPending || !selectedProductId) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    productsApi.fetchProductById(selectedProductId).then((p) => {
      if (cancelled) return;
      setPendingProduct({ name: p.name, imageUrl: p.imageUrl, priceInCents: p.priceInCents });
      timer = setTimeout(() => { if (!cancelled) setShowPendingModal(true); }, 600);
    }).catch(() => {});
    return () => { cancelled = true; clearTimeout(timer); };
  }, []);

  useEffect(() => {
    const isStale = !lastFetchedAt || Date.now() - lastFetchedAt > CACHE_TTL_MS;
    if (isStale) dispatch(fetchProducts());
    if (categories.length === 0) dispatch(fetchCategories());
  }, [dispatch, lastFetchedAt, categories.length]);

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

  const handleLoadMore = useCallback(() => {
    if (status !== 'loading' && nextCursor) {
      dispatch(fetchMoreProducts(nextCursor));
    }
  }, [status, nextCursor, dispatch]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          handleLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    const target = observerTarget.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [handleLoadMore, hasMore]);

  const handleDiscardPending = () => {
    dispatch(resetCheckout());
    sessionStorage.setItem('checkout_just_reset', '1');
    setShowPendingModal(false);
  };

  const handleCategorySelect = (category: Category) => {
    if (activeCategoryId === category.id) {
      // Toggle off
      dispatch(setActiveCategory(null));
      dispatch(fetchProducts());
    } else {
      // Toggle on
      dispatch(setActiveCategory(category.id));
      dispatch(fetchProducts());
    }
  };

 return (
    <PageWrapper>
      <div className="flex flex-col gap-10 pb-16">

        {/* Pending checkout modal omitted for brevity as it's the same, copying original... */}
        <Modal isOpen={showPendingModal} onClose={handleDiscardPending} title="Compra pendiente">
          <div className="flex flex-col items-center text-center gap-5 py-2">
            <div className="w-full rounded-2xl bg-gray-50 overflow-hidden" style={{ height: '220px' }}>
              {pendingProduct?.imageUrl ? (
                <img src={pendingProduct.imageUrl} alt={pendingProduct.name} className="w-full h-full object-cover" />
              ) : (
                <svg className="w-20 h-20 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                </svg>
              )}
            </div>
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

        {!activeCategoryId && !searchQuery && (
          <div className="reveal">
            <HeroBanner />
          </div>
        )}

        {/* Categories Section */}
        <section
          className={`reveal ${activeCategoryId || searchQuery ? '' : 'delay-100'}`}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.07)',
            border: '1px solid #f0f0f0',
          }}
        >
          <SectionHeader 
            title="Explore Popular Categories" 
            actionLabel={activeCategoryId ? 'Ver todas' : 'View All'} 
            onAction={() => { 
               if (activeCategoryId) {
                 dispatch(setActiveCategory(null));
                 dispatch(fetchProducts());
               }
            }} 
          />
          <CategoryList 
            categories={categories} 
            activeCategoryId={activeCategoryId} 
            onSelect={handleCategorySelect} 
          />
        </section>

        {/* Dynamic Content based on Selection */}
        {searchQuery ? (
          /* ── Search results view ── */
          <div className="reveal">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Resultados para <span className="text-[#222]">"{searchQuery}"</span>
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {status === 'loading'
                    ? 'Buscando...'
                    : `${products.length} ${products.length === 1 ? 'producto encontrado' : 'productos encontrados'}`}
                </p>
              </div>
              <button
                onClick={() => { dispatch(setSearchQuery('')); dispatch(fetchProducts()); }}
                className="shrink-0 text-sm text-gray-500 hover:text-gray-900 underline underline-offset-2 cursor-pointer transition-colors"
              >
                Limpiar búsqueda
              </button>
            </div>
            {status === 'loading' && products.length === 0 ? (
              <ProductGrid isLoading={true} products={[]} onPay={handlePay} />
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                <span className="text-6xl">🔍</span>
                <h3 className="text-lg font-semibold text-gray-900">No encontramos resultados</h3>
                <p className="text-gray-500 text-sm max-w-xs">
                  Intenta con otras palabras o explora nuestras categorías.
                </p>
                <button
                  onClick={() => { dispatch(setSearchQuery('')); dispatch(fetchProducts()); }}
                  className="mt-2 rounded-xl bg-[#222] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#333] cursor-pointer transition-colors"
                >
                  Ver todos los productos
                </button>
              </div>
            ) : (
              <>
                <ProductGrid products={products} onPay={handlePay} />
                {hasMore && (
                  <div ref={observerTarget} className="mt-10 flex justify-center py-4">
                    {status === 'loading' && (
                      <div className="flex gap-2 items-center justify-center">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300" />
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        ) : activeCategoryId ? (
          <div className="reveal">
             <div className="mb-6">
               <h2 className="text-2xl font-bold text-gray-900">
                 {categories.find(c => c.id === activeCategoryId)?.name || 'Productos'}
               </h2>
               <p className="text-gray-500 text-sm mt-1">
                 Mostrando {products.length} {products.length === 1 ? 'producto' : 'productos'} encontrados
               </p>
             </div>
             {status === 'loading' && products.length === 0 ? (
                <ProductGrid isLoading={true} products={[]} onPay={handlePay} />
             ) : (
                <>
                  <ProductGrid products={products} onPay={handlePay} />
                  {hasMore && (
                    <div ref={observerTarget} className="mt-10 flex justify-center py-4">
                      {status === 'loading' && (
                        <div className="flex gap-2 items-center justify-center">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300" />
                        </div>
                      )}
                    </div>
                  )}
                </>
             )}
          </div>
        ) : (
          <>
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

            {/* All Products Grid at the bottom */}
            <div className="reveal mt-8">
              <SectionHeader title="Todos los Productos" />
              {status === 'loading' && products.length === 0 ? (
                <ProductGrid isLoading={true} products={[]} onPay={handlePay} />
              ) : (
                <ProductGrid products={products} onPay={handlePay} />
              )}
              
              {hasMore && (
                <div ref={observerTarget} className="mt-10 flex justify-center py-4">
                  {status === 'loading' && (
                    <div className="flex gap-2 items-center justify-center">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </PageWrapper>
  );
}
