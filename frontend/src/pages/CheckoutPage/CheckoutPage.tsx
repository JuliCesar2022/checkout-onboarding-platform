import { useAppDispatch } from '../../shared/hooks/useAppDispatch';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { 
  proceedToSummary, 
  startProcessing,
  saveCardData,
  saveDeliveryAddress,
  completeCheckout,
  setCheckoutError,
} from '../../features/checkout/store/checkoutSlice';
import { CardForm } from '../../features/checkout/components/CardForm';
import { DeliveryForm } from '../../features/checkout/components/DeliveryForm';
import { OrderSummaryBackdrop } from '../../features/checkout/components/OrderSummaryBackdrop';
import { checkoutApi } from '../../features/checkout/api';
import { PageWrapper } from '../../shared/layout/PageWrapper';
import { Button } from '../../shared/ui/Button';
import { ErrorBanner } from '../../shared/ui/ErrorBanner';

export function CheckoutPage() {
  const dispatch = useAppDispatch();
  const { step, fees, error, deliveryAddress, cardData, selectedProductId: productId, quantity } = useAppSelector((state) => state.checkout);
  const { loadingState } = useAppSelector((state) => state.transaction);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handlePay = async () => {
    if (!cardData || !deliveryAddress) return;
    if (!cardData.token) {
      console.error('❌ No hay token de tarjeta. Tokeniza primero.');
      return;
    }
    if (!productId) {
      console.error('❌ No hay producto seleccionado.');
      return;
    }

    dispatch(startProcessing());

    try {
      // Step 1: Get Wompi acceptance tokens from our backend
      console.log('📜 Obteniendo acceptance tokens de Wompi...');
      const { acceptanceToken, personalAuthToken } = await checkoutApi.fetchAcceptanceToken();
      console.log('✅ Acceptance tokens obtenidos');

      // Step 2: Submit transaction to our backend
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

      console.log('🎉 Transacción procesada:', result);
      console.log(`   Status: ${result.status}`);
      console.log(`   ID: ${result.id}`);
      console.log(`   Referencia: ${result.reference}`);

      if (result.status === 'APPROVED') {
        dispatch(completeCheckout());
      } else {
        dispatch(setCheckoutError(`Pago ${result.status.toLowerCase()}: la transacción no fue aprobada.`));
      }

    } catch (err: any) {
      console.error('❌ Error al procesar el pago:', err.message);
      dispatch(setCheckoutError(err.message || 'Error inesperado al procesar el pago'));
    }
  };


  const isFormComplete = deliveryAddress && cardData;
  const isLoading = loadingState === 'submitting' || loadingState === 'polling';

  return (
    <PageWrapper>
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8 lg:pt-12">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Checkout</h1>

        <div className="mt-8 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          {/* Left Column: Forms */}
          <section aria-labelledby="forms-heading" className="lg:col-span-7">
            <h2 id="forms-heading" className="sr-only">Checkout details</h2>

            <div className="space-y-12">
              {/* Delivery Section */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">1. Delivery Information</h3>
                  {deliveryAddress && (
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      Completed
                    </span>
                  )}
                </div>
                {!deliveryAddress ? (
                  <DeliveryForm 
                    onSubmit={(data) => {
                      dispatch(saveDeliveryAddress(data));
                    }} 
                  />
                ) : (
                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="font-medium text-gray-900">{deliveryAddress.recipientName}</p>
                    <p>{deliveryAddress.addressLine1} {deliveryAddress.addressLine2}</p>
                    <p>{deliveryAddress.city}, {deliveryAddress.department}</p>
                    <p>{deliveryAddress.phoneNumber}</p>
                    <button 
                      onClick={() => dispatch(saveDeliveryAddress(null as any))}
                      className="mt-2 text-indigo-600 hover:text-indigo-500 font-medium"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>

              {/* Payment Section */}
              <div className={`rounded-2xl border bg-white p-6 shadow-sm sm:p-8 transition-opacity ${!deliveryAddress ? 'opacity-50 pointer-events-none border-gray-100' : 'border-gray-200'}`}>
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">2. Payment Information</h3>
                  {cardData && (
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      Completed
                    </span>
                  )}
                </div>
                {!cardData ? (
                  <CardForm 
                    onSubmit={async (data) => {
                      try {
                        // 1. Tokenize card directly with Wompi
                        const tokenResult = await checkoutApi.tokenizeCard({
                          number: data.cardNumber,
                          cvc: data.cvv,
                          expMonth: data.expiryMonth,
                          expYear: data.expiryYear,
                          cardHolder: data.holderName,
                        });

                        console.log('✅ Wompi Tokenization Success!');
                        console.log('Token generated:', tokenResult.token);
                        console.log('Brand detected:', tokenResult.brand);

                        // 2. Save safe data + token to Redux (never save CVV or full card number)
                        const { cvv, cardNumber, ...restData } = data;
                        dispatch(saveCardData({ 
                          ...restData, 
                          number: cardNumber, 
                          brand: tokenResult.brand, // Use Wompi's confirmed brand
                          token: tokenResult.token 
                        }));
                        
                        dispatch(proceedToSummary());
                      } catch (err: any) {
                        alert(err.message || 'Error tokenizing card');
                      }
                    }} 
                  />
                ) : (
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-900 mb-1">{cardData.brand || 'Card'} ending in {cardData.number?.slice(-4)}</p>
                    <p>Holder: {cardData.holderName}</p>
                    <p>Expires: {cardData.expiryMonth}/{cardData.expiryYear}</p>
                    <button 
                      onClick={() => dispatch(saveCardData(null as any))}
                      className="mt-2 text-indigo-600 hover:text-indigo-500 font-medium"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Right Column: Order Summary (Desktop) */}
          <section
            aria-labelledby="summary-heading"
            className="mt-16 rounded-2xl bg-gray-50 px-6 py-8 sm:p-8 lg:col-span-5 lg:mt-0 lg:sticky lg:top-8 hidden lg:block border border-gray-200 shadow-sm"
          >
            <h2 id="summary-heading" className="text-lg font-medium text-gray-900 mb-6">
              Order Summary
            </h2>

            {fees ? (
              <div>
                <dl className="space-y-4 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <dt>Product amount</dt>
                    <dd className="font-medium text-gray-900">{formatCurrency(fees.productAmount)}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt>Base fee (Wompi)</dt>
                    <dd className="font-medium text-gray-900">{formatCurrency(fees.baseFee)}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt>Delivery fee</dt>
                    <dd className="font-medium text-gray-900">{formatCurrency(fees.deliveryFee)}</dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <dt className="text-base font-semibold text-gray-900">Total</dt>
                    <dd className="text-xl font-bold text-indigo-600">{formatCurrency(fees.totalAmount)}</dd>
                  </div>
                </dl>

                {error && (
                  <div className="mt-6">
                    <ErrorBanner message={error} />
                  </div>
                )}

                <div className="mt-8">
                  <Button 
                    onClick={handlePay} 
                    isLoading={isLoading}
                    disabled={!isFormComplete || !fees || isLoading}
                    className="w-full"
                  >
                    {!isFormComplete ? 'Complete details to pay' : isLoading ? 'Processing...' : 'Pay now'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-12 text-sm text-gray-500">
                Calculating fees...
              </div>
            )}
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
