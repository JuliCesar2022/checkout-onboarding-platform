import { useAppDispatch } from '../../shared/hooks/useAppDispatch';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { useEffect } from 'react';
import {
  proceedToSummary,
  startProcessing,
  saveCardData,
  saveDeliveryAddress,
  completeCheckout,
  setCheckoutError,
  setFees,
} from '../../features/checkout/store/checkoutSlice';
import { CardForm } from '../../features/checkout/components/CardForm';
import { DeliveryForm } from '../../features/checkout/components/DeliveryForm';
import { OrderSummaryBackdrop } from '../../features/checkout/components/OrderSummaryBackdrop';
import { checkoutApi } from '../../features/checkout/api';
import { productsApi } from '../../features/products/api';
import { PageWrapper } from '../../shared/layout/PageWrapper';
import { Button } from '../../shared/ui/Button';
import { ErrorBanner } from '../../shared/ui/ErrorBanner';

const BASE_FEE_IN_CENTS = 150_000;
const DELIVERY_FEE_IN_CENTS = 1_000_000;

const STEPS = [
  { number: 1, label: 'Delivery' },
  { number: 2, label: 'Payment' },
];

export function CheckoutPage() {
  const dispatch = useAppDispatch();
  const { step, fees, error, deliveryAddress, cardData, selectedProductId: productId, quantity } =
    useAppSelector((state) => state.checkout);
  const { loadingState } = useAppSelector((state) => state.transaction);

  // Which UI step are we on: 1 = delivery, 2 = payment
  const currentStep = !deliveryAddress ? 1 : 2;

  useEffect(() => {
    if (!productId) return;
    productsApi.fetchProductById(productId).then((product) => {
      const productAmountInCents = product.priceInCents * quantity;
      dispatch(
        setFees({
          productAmount: productAmountInCents / 100,
          baseFee: BASE_FEE_IN_CENTS / 100,
          deliveryFee: DELIVERY_FEE_IN_CENTS / 100,
          totalAmount: (productAmountInCents + BASE_FEE_IN_CENTS + DELIVERY_FEE_IN_CENTS) / 100,
        })
      );
    }).catch(console.error);
  }, [productId, quantity, dispatch]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);

  const handlePay = async () => {
    if (!cardData || !deliveryAddress || !productId) return;
    if (!cardData.token) return;

    dispatch(startProcessing());

    try {
      const { acceptanceToken, personalAuthToken } = await checkoutApi.fetchAcceptanceToken();

      const result = await checkoutApi.submitTransaction({
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
          city: deliveryAddress.city,
          state: deliveryAddress.department,
        },
        customerData: {
          email: deliveryAddress.email,
          name: deliveryAddress.recipientName,
          phone: deliveryAddress.phoneNumber,
        },
        acceptanceToken,
        acceptPersonalAuth: personalAuthToken,
      });

      let finalResult = result;
      if (finalResult.status === 'PENDING') {
        while (finalResult.status === 'PENDING') {
          await new Promise((resolve) => setTimeout(resolve, 3000));
          try {
            finalResult = await checkoutApi.syncTransactionStatus(finalResult.id);
          } catch {
            // retry
          }
        }
      }

      if (finalResult.status === 'APPROVED') {
        dispatch(completeCheckout());
      } else {
        dispatch(setCheckoutError(`Pago ${finalResult.status.toLowerCase()}: la transacción no fue aprobada.`));
      }
    } catch (err: any) {
      dispatch(setCheckoutError(err.message || 'Error inesperado al procesar el pago'));
    }
  };

  const isFormComplete = deliveryAddress && cardData;
  const isLoading = loadingState === 'submitting' || loadingState === 'polling';

  return (
    <PageWrapper>
      <div className="mx-auto max-w-5xl px-4 pb-24 pt-8 sm:px-6">

        {/* ── Stepper ── */}
        <div className="mb-10">
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

        <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-8">

          {/* ── Left column: forms ── */}
          <section className="lg:col-span-7 space-y-4">

            {/* Step 1 — Delivery */}
            {currentStep === 1 ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Delivery information</h2>
                <DeliveryForm onSubmit={(data) => dispatch(saveDeliveryAddress(data))} />
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
                  className="text-sm font-medium text-gray-900 hover:text-gray-600 shrink-0 underline underline-offset-2"
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
                    className="text-sm font-medium text-gray-900 hover:text-gray-600 shrink-0 underline underline-offset-2"
                  >
                    Edit
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Payment information</h2>
                  <CardForm
                    onSubmit={async (data) => {
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
                      } catch (err: any) {
                        alert(err.message || 'Error tokenizing card');
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

                  <div className="mt-6">
                    <Button
                      onClick={handlePay}
                      isLoading={isLoading}
                      disabled={!isFormComplete || isLoading}
                      className="w-full"
                    >
                      {!isFormComplete ? 'Complete details to pay' : isLoading ? 'Processing...' : 'Pay now'}
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
