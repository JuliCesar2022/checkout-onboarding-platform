import { useAppDispatch } from '../../shared/hooks/useAppDispatch';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  proceedToSummary,
  startProcessing,
  saveCardData,
  saveDeliveryAddress,
  completeCheckout,
  setCheckoutError,
  setFees,
  setQuantity,
  updateCartItemQuantity,
  resetCheckout,
} from '../../features/checkout/store/checkoutSlice';
import { submitTransaction, pollTransactionStatus } from '../../features/transaction/store/transactionSlice';
import { updateProductStock } from '../../features/products/store/productsSlice';
import { ROUTES } from '../../constants/routes';
import { CardForm } from '../../features/checkout/components/CardForm';
import { DeliveryForm } from '../../features/checkout/components/DeliveryForm';
import { OrderSummaryBackdrop } from '../../features/checkout/components/OrderSummaryBackdrop';
import { checkoutApi } from '../../features/checkout/api';
import { productsApi } from '../../features/products/api';
import { PageWrapper } from '../../shared/layout/PageWrapper';
import { Button } from '../../shared/ui/Button';
import { ErrorBanner } from '../../shared/ui/ErrorBanner';
import { CartItem } from '../../features/cart/components/CartItem/CartItem';

const BASE_FEE_IN_CENTS = 150_000;
const DELIVERY_FEE_IN_CENTS = 1_000_000;

const SAVED_DELIVERY_KEY = 'saved_delivery_info';

function loadSavedDelivery() {
  try {
    const raw = localStorage.getItem(SAVED_DELIVERY_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveDeliveryLocally(data: object) {
  try {
    localStorage.setItem(SAVED_DELIVERY_KEY, JSON.stringify(data));
  } catch {}
}

const STEPS = [
  { number: 1, label: 'Delivery' },
  { number: 2, label: 'Payment' },
];

export function CheckoutPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { step, fees, error, deliveryAddress, cardData, selectedProductId: productId, quantity, cartItems } =
    useAppSelector((state) => state.checkout);
  const { loadingState } = useAppSelector((state) => state.transaction);

  // Redirect to products if no product is selected or if checkout is complete
  if (!productId && cartItems.length === 0) {
    return <Navigate to={ROUTES.PRODUCTS} replace />;
  }

  // Which UI step are we on: 1 = delivery, 2 = payment
  const currentStep = !deliveryAddress ? 1 : 2;

  // Keep last known data so forms re-populate when user clicks "Edit",
  // and also seed from localStorage so returning users don't re-type their info.
  const lastDeliveryRef = useRef(deliveryAddress ?? loadSavedDelivery());
  if (deliveryAddress) lastDeliveryRef.current = deliveryAddress;

  // Auto-confirm delivery from localStorage when starting a new checkout.
  // openCheckoutForm resets deliveryAddress to null, so if localStorage has
  // data and Redux has none, pre-confirm it so the user lands on step 2 directly.
  useEffect(() => {
    if (!productId) return;
    if (deliveryAddress) return; // already set, nothing to do
    const saved = loadSavedDelivery();
    if (saved) {
      dispatch(saveDeliveryAddress(saved));
    }
  }, [productId]); // eslint-disable-line react-hooks/exhaustive-deps

  const lastCardRef = useRef(cardData);
  if (cardData) lastCardRef.current = cardData;

  const payingRef = useRef(false);
  const [isTokenizing, setIsTokenizing] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const [product, setProduct] = useState<{ name: string; imageUrl: string | null } | null>(null);

  useEffect(() => {
    if (!productId) return;

    if (cartItems.length > 1) {
      // Multi-item from cart: sum all selected items, no need for API call
      const productAmountInCents = cartItems.reduce(
        (sum, i) => sum + i.priceInCents * i.quantity,
        0
      );
      dispatch(
        setFees({
          productAmount: productAmountInCents / 100,
          baseFee: BASE_FEE_IN_CENTS / 100,
          deliveryFee: DELIVERY_FEE_IN_CENTS / 100,
          totalAmount: (productAmountInCents + BASE_FEE_IN_CENTS + DELIVERY_FEE_IN_CENTS) / 100,
        })
      );
      // Use first item as the "representative" product for display fallback
      setProduct({ name: cartItems[0].name, imageUrl: cartItems[0].imageUrl });
    } else {
      productsApi.fetchProductById(productId).then((p) => {
        const productAmountInCents = p.priceInCents * quantity;
        dispatch(
          setFees({
            productAmount: productAmountInCents / 100,
            baseFee: BASE_FEE_IN_CENTS / 100,
            deliveryFee: DELIVERY_FEE_IN_CENTS / 100,
            totalAmount: (productAmountInCents + BASE_FEE_IN_CENTS + DELIVERY_FEE_IN_CENTS) / 100,
          })
        );
        setProduct({ name: p.name, imageUrl: p.imageUrl });
      }).catch(console.error);
    }
  }, [productId, quantity, cartItems, dispatch]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);

  const handlePay = async () => {
    if (payingRef.current) return;
    if (!cardData || !deliveryAddress || !productId) return;
    if (!cardData.token) {
      dispatch(setCheckoutError('La tarjeta no ha sido tokenizada. Por favor edita y vuelve a guardar tu tarjeta.'));
      return;
    }

    payingRef.current = true;
    setIsPaying(true);
    dispatch(startProcessing());

    try {
      // 1. Submit the transaction (this handles acceptance tokens internally)
      const result = await dispatch(submitTransaction({
        productId,
        quantity,
        cardData: {
          token: cardData.token,
          brand: cardData.brand ?? 'VISA',
          lastFour: cardData.number?.slice(-4) ?? '0000',
          installments: 1,
        },
        deliveryData: {
          address: `${deliveryAddress.addressLine1} ${deliveryAddress.addressLine2 ?? ''}`.trim(),
          addressDetail: deliveryAddress.addressDetail,
          city: deliveryAddress.city,
          state: deliveryAddress.department,
        },
        customerData: {
          email: deliveryAddress.email,
          name: deliveryAddress.recipientName,
          phone: deliveryAddress.phoneNumber,
        },
      })).unwrap();

      // 2. Poll for the final status
      const finalResult = await dispatch(pollTransactionStatus(result.id)).unwrap();

      // 3. Optional: refresh stock locally if approved
      if (finalResult.status === 'APPROVED') {
        const productIdsToRefresh = cartItems.length > 1
          ? cartItems.map((item) => item.productId)
          : productId ? [productId] : [];

        await Promise.allSettled(
          productIdsToRefresh.map(async (pid) => {
            try {
              const fresh = await productsApi.fetchProductById(pid);
              dispatch(updateProductStock({ productId: pid, newStock: fresh.stock }));
            } catch {
              // non-critical
            }
          })
        );
      }

      dispatch(completeCheckout());
      navigate(ROUTES.TRANSACTION_STATUS);
    } catch (err: any) {
      payingRef.current = false;
      setIsPaying(false);
      dispatch(setCheckoutError(err.message || 'Error inesperado al procesar el pago'));
    }
  };

  const isFormComplete = deliveryAddress && cardData;
  const isLoading = isPaying || loadingState === 'submitting' || loadingState === 'polling';

  return (
    <PageWrapper>
      <div className="mx-auto max-w-5xl px-4 pb-24 pt-8 sm:px-6">

        {/* ── Top bar: stepper ── */}
        <div className="flex items-center gap-4 mb-10">

        {/* ── Stepper ── */}
        <div className="flex-1">
          <div className="flex items-center">
            {STEPS.map((s, idx) => {
              const isDone = s.number < currentStep;
              const isActive = s.number === currentStep;
              return (
                <div key={s.number} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                        isDone
                          ? 'bg-[#222] text-white'
                          : isActive
                          ? 'bg-[#222] text-white ring-4 ring-gray-200'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {isDone ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        s.number
                      )}
                    </div>
                    <span className={`text-xs font-medium whitespace-nowrap ${isActive ? 'text-gray-900' : isDone ? 'text-gray-500' : 'text-gray-400'}`}>
                      {s.label}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className="flex-1 mx-3 mb-5">
                      <div className={`h-0.5 w-full transition-all ${isDone ? 'bg-[#222]' : 'bg-gray-200'}`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        </div>{/* end top bar */}

        <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-8">

          {/* ── Left column: forms ── */}
          <section className="lg:col-span-7 space-y-4">

            {/* Step 1 — Delivery */}
            {currentStep === 1 ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Delivery information</h2>
                <DeliveryForm
                  onSubmit={(data) => {
                    saveDeliveryLocally(data);
                    dispatch(saveDeliveryAddress(data));
                  }}
                  defaultValues={lastDeliveryRef.current ?? undefined}
                  autoFocus
                />
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-8 h-8 rounded-full bg-[#222] flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{deliveryAddress!.recipientName}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {deliveryAddress!.addressLine1}{deliveryAddress!.addressLine2 ? `, ${deliveryAddress!.addressLine2}` : ''} — {deliveryAddress!.city}, {deliveryAddress!.department}
                    </p>
                    <p className="text-sm text-gray-500">{deliveryAddress!.phoneNumber}</p>
                  </div>
                </div>
                <button
                  onClick={() => dispatch(saveDeliveryAddress(null as any))}
                  className="text-sm font-medium text-gray-900 hover:text-gray-600 shrink-0 underline underline-offset-2 cursor-pointer"
                >
                  Edit
                </button>
              </div>
            )}

            {/* Step 2 — Payment */}
            {deliveryAddress && (
              cardData ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-8 h-8 rounded-full bg-[#222] flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {cardData.brand || 'Card'} •••• {cardData.number?.slice(-4)}
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {cardData.holderName} · Expires {cardData.expiryMonth}/{cardData.expiryYear}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => dispatch(saveCardData(null as any))}
                    className="text-sm font-medium text-gray-900 hover:text-gray-600 shrink-0 underline underline-offset-2 cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Payment information</h2>
                  <CardForm
                    autoFocus
                    isTokenizing={isTokenizing}
                    defaultValues={lastCardRef.current ? {
                      cardNumber: lastCardRef.current.number,
                      holderName: lastCardRef.current.holderName,
                      expiryMonth: lastCardRef.current.expiryMonth,
                      expiryYear: lastCardRef.current.expiryYear,
                    } : undefined}
                    onSubmit={async (data) => {
                      setIsTokenizing(true);
                      try {
                        const tokenResult = await checkoutApi.tokenizeCard({
                          number: data.cardNumber,
                          cvc: data.cvv,
                          expMonth: data.expiryMonth,
                          expYear: data.expiryYear,
                          cardHolder: data.holderName,
                        });
                        const { cvv: _cvv, cardNumber, ...restData } = data;
                        dispatch(saveCardData({ ...restData, number: cardNumber, brand: tokenResult.brand, token: tokenResult.token }));
                        dispatch(proceedToSummary());
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } catch (err: any) {
                        dispatch(setCheckoutError(err.message || 'Error al tokenizar la tarjeta.'));
                      } finally {
                        setIsTokenizing(false);
                      }
                    }}
                  />
                </div>
              )
            )}
          </section>

          {/* ── Right column: Order Summary (always visible) ── */}
          <section className="mt-8 lg:col-span-5 lg:mt-0 lg:sticky lg:top-8">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-5">Order Summary</h2>

              {cartItems.length > 0 ? (
                <div className="mb-5 pb-5 border-b border-gray-200 space-y-4">
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.productId}
                      item={item}
                      compact
                      onUpdateQuantity={(newQty: number) => 
                        dispatch(updateCartItemQuantity({ productId: item.productId, quantity: newQty }))
                      }
                    />
                  ))}
                </div>
              ) : (product && (
                <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-200">
                  <div className="w-16 h-16 rounded-xl bg-white border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain p-1" />
                    ) : (
                      <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
                    {fees && (
                      <p className="text-xs font-medium text-gray-500 mt-0.5">
                        {formatCurrency(fees.productAmount / quantity)} × {quantity} = <span className="text-gray-900">{formatCurrency(fees.productAmount)}</span>
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => dispatch(setQuantity(quantity - 1))}
                        disabled={quantity <= 1}
                        className="w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                      </button>
                      <span className="w-6 text-center text-sm font-semibold text-gray-900">{quantity}</span>
                      <button
                        onClick={() => dispatch(setQuantity(quantity + 1))}
                        className="w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors"
                        aria-label="Increase quantity"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {fees ? (
                <>
                  <dl className="space-y-3 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <dt>Product amount</dt>
                      <dd className="font-medium text-gray-900">{formatCurrency(fees.productAmount)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Base fee (Wompi)</dt>
                      <dd className="font-medium text-gray-900">{formatCurrency(fees.baseFee)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Delivery fee</dt>
                      <dd className="font-medium text-gray-900">{formatCurrency(fees.deliveryFee)}</dd>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-3">
                      <dt className="text-base font-semibold text-gray-900">Total</dt>
                      <dd className="text-xl font-bold text-gray-900">{formatCurrency(fees.totalAmount)}</dd>
                    </div>
                  </dl>

                  {error && <div className="mt-4"><ErrorBanner message={error} /></div>}

                  <div className="mt-6 space-y-3">
                    <Button
                      onClick={handlePay}
                      isLoading={isLoading}
                      disabled={!isFormComplete || isLoading}
                      className="w-full"
                    >
                      {!isFormComplete ? 'Complete details to pay' : 'Pay now'}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        dispatch(resetCheckout());
                        navigate(ROUTES.PRODUCTS);
                      }}
                      disabled={isLoading}
                      className="w-full"
                    >
                      Cancelar
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center py-10 text-sm text-gray-400">
                  Calculating fees...
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Mobile Order Summary Backdrop */}
      <OrderSummaryBackdrop
        isOpen={(step === 'SUMMARY' || step === 'PROCESSING') && !!isFormComplete}
        fees={fees}
        isLoading={isLoading}
        error={error}
        onPay={handlePay}
      />
    </PageWrapper>
  );
}
