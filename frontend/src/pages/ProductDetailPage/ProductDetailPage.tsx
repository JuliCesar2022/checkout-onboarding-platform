import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../shared/hooks/useAppDispatch';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { fetchProducts, selectProduct } from '../../features/products/store/productsSlice';
import { openCheckoutForm } from '../../features/checkout/store/checkoutSlice';
import { addToCart } from '../../features/cart/store/cartSlice';
import { PageWrapper } from '../../shared/layout/PageWrapper';
import { StockBadge } from '../../features/products/components/StockBadge';
import { Button } from '../../shared/ui/Button';
import { Spinner } from '../../shared/ui/Spinner';
import { formatCOP } from '../../shared/utils/currencyFormat';
import { ROUTES } from '../../constants/routes';
import { ImageWithSkeleton } from '../../shared/ui/ImageWithSkeleton';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const { items: products, status } = useAppSelector((state) => state.products);
  const product = products.find((p) => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (products.length === 0) dispatch(fetchProducts());
  }, [dispatch, products.length]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart({ productId: product.id, name: product.name, imageUrl: product.imageUrl, priceInCents: product.priceInCents }));
    }
  };

  const handlePay = () => {
    if (!product) return;
    dispatch(selectProduct(product.id));
    dispatch(openCheckoutForm({ productId: product.id, quantity }));
    navigate(ROUTES.CHECKOUT);
  };

  if (status === 'loading' && !product) {
    return (
      <PageWrapper>
        <Spinner />
      </PageWrapper>
    );
  }

  if (!product) {
    return (
      <PageWrapper>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="text-6xl mb-4">🔍</p>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Product not found</h2>
          <p className="text-gray-500 mb-6">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate(ROUTES.PRODUCTS)}>Back to store</Button>
        </div>
      </PageWrapper>
    );
  }

  const isOutOfStock = product.stock === 0;

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back link */}
        <button
          onClick={() => navigate(ROUTES.PRODUCTS)}
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to products
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Product Image */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {product.imageUrl ? (
              <ImageWithSkeleton
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-80 md:h-[28rem]"
              />
            ) : (
              <div className="w-full h-80 md:h-[28rem] bg-gray-50 flex items-center justify-center text-gray-300 text-8xl">
                📦
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>
              <StockBadge stock={product.stock} />
            </div>

            <p className="text-3xl font-extrabold text-gray-900">
              {formatCOP(product.priceInCents)}
            </p>

            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>🚚</span>
                <span>Free shipping on this product</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>🔒</span>
                <span>Secure payment with credit card</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>📦</span>
                <span>{product.stock} units available</span>
              </div>
            </div>

            {/* Quantity selector */}
            {!isOutOfStock && (
              <div className="flex items-center gap-3 pt-2">
                <span className="text-sm font-medium text-gray-700">Cantidad:</span>
                <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    aria-label="Disminuir cantidad"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    aria-label="Aumentar cantidad"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            <div className="mt-auto pt-4 flex flex-col gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Agregar al carrito
              </button>
              <Button
                onClick={handlePay}
                disabled={isOutOfStock}
                className="w-full py-3 text-base"
              >
                {isOutOfStock ? 'Out of stock' : 'Comprar ahora'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
