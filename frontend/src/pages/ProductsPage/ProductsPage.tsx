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
import { Button } from '../../shared/ui/Button';
import { ErrorBanner } from '../../shared/ui/ErrorBanner';
import { PageWrapper } from '../../shared/layout/PageWrapper';
import { HeroBanner } from '../../features/products/components/HeroBanner';
import { CategoryList } from '../../features/products/components/CategoryList';
import { SectionHeader } from '../../features/products/components/SectionHeader';
import type { Product, Category } from '../../shared/interfaces';
import { FeaturedRow } from '../../features/products/components/FeaturedRow';
import { CategoryShowcase } from '../../features/products/components/CategoryShowcase';
import { GamingShowcase } from '../../features/products/components/GamingShowcase';
import { SmartphoneShowcase } from '../../features/products/components/SmartphoneShowcase';
import { ProductGrid } from '../../features/products/components/ProductGrid';
import { ROUTES } from '../../constants/routes';

// Cache logic removed to ensure freshness on every navigation

export function ProductsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const observerTarget = useRef<HTMLDivElement>(null);
  const {
    items: products,
    categories,
    activeCategoryId,
    searchQuery,
    status,
    hasMore,
    nextCursor,
    error,
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
    // Fetch products on every mount/navigation to ensure real-time stock
    dispatch(fetchProducts());
    if (categories.length === 0) dispatch(fetchCategories());
  }, [dispatch, categories.length]);

  const handlePay = useCallback((product: Product) => {
    dispatch(selectProduct(product.id));
    dispatch(openCheckoutForm({ productId: product.id, quantity: 1 }));
    navigate(ROUTES.CHECKOUT);
  }, [dispatch, navigate]);

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

  const handleCategorySelect = useCallback((category: Category) => {
    if (activeCategoryId === category.id) {
      dispatch(setActiveCategory(null));
      dispatch(fetchProducts());
    } else {
      dispatch(setActiveCategory(category.id));
      dispatch(fetchProducts());
    }
    // Scroll to product grid
    setTimeout(() => {
      document.getElementById('product-grid-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [activeCategoryId, dispatch]);

  const handleCategoryBySlug = useCallback((slug: string) => {
    // Look in main categories and their children
    const category = categories.flatMap(c => [c, ...(c.children ?? [])]).find(c => c.slug === slug);
    if (category) {
      handleCategorySelect(category);
    }
  }, [categories, handleCategorySelect]);

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
              <Button
                variant="secondary"
                onClick={handleDiscardPending}
                className="flex-1"
              >
                Descartar
              </Button>
              <Button
                onClick={handleResumePending}
                className="flex-1"
              >
                Continuar compra
              </Button>
            </div>
          </div>
        </Modal>

        {!activeCategoryId && !searchQuery && (
          <div>
            <HeroBanner onSelectCategory={handleCategoryBySlug} />
          </div>
        )}

        {/* Categories Section */}
        <section className="sm:bg-white sm:rounded-2xl sm:p-6 sm:shadow-sm sm:border sm:border-gray-100">
          <SectionHeader 
            title="Explorar categorías populares" 
            actionLabel={activeCategoryId ? 'Ver todas' : 'Ver todas'} 
            onAction={() => { 
               if (activeCategoryId) {
                 dispatch(setActiveCategory(null));
                 dispatch(fetchProducts());
               }
            }} 
          />
          <CategoryList
            categories={categories.flatMap((c) => (c.children ?? []).length > 0 ? (c.children ?? []) : [c])}
            activeCategoryId={activeCategoryId}
            onSelect={handleCategorySelect}
          />
        </section>

        {/* Dynamic Content based on Selection */}
        {status === 'failed' && error && (
          <div className="mb-6">
            <ErrorBanner message={error} />
          </div>
        )}

        {searchQuery ? (
          /* ── Search results view ── */
          <div>
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
                <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
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
          <div>
             <div className="mb-6">
               <h2 className="text-2xl font-bold text-gray-900">
                 {categories.flatMap((c) => [c, ...(c.children ?? [])]).find((c) => c.id === activeCategoryId)?.name || 'Productos'}
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
              <div>
                <FeaturedRow
                  title="⚡ Más vendidos"
                  products={products.slice(0, 8)}
                  onPay={handlePay}
                />
              </div>
            )}

            {/* Category Showcase */}
            <div>
              <CategoryShowcase categories={categories} onSelect={handleCategorySelect} />
            </div>

            {/* Gaming Showcase */}
            <div>
              <GamingShowcase categories={categories} onSelect={handleCategorySelect} />
            </div>

            {/* Smartphone Showcase */}
            <div>
              <SmartphoneShowcase categories={categories} onSelect={handleCategorySelect} />
            </div>

            {/* Second featured row */}
            {products.length > 0 && (
              <div>
                <FeaturedRow
                  title="🔥 Ofertas del día"
                  products={products.slice(3, 11)}
                  onPay={handlePay}
                />
              </div>
            )}

            {/* All Products Grid at the bottom */}
            <div id="product-grid-section" className="mt-8">
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
