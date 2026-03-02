import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../shared/hooks/useAppDispatch';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { resetCheckout } from '../../features/checkout/store/checkoutSlice';
import { pollTransactionStatus, resetTransaction } from '../../features/transaction/store/transactionSlice';
import { fetchProducts, updateProductStock } from '../../features/products/store/productsSlice';
import { productsApi } from '../../features/products/api';
import { TransactionResult } from '../../features/transaction/components/TransactionResult';
import { ROUTES } from '../../constants/routes';

export function TransactionStatusPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id, status, reference, amountInCents, loadingState } = useAppSelector(
    (state) => state.transaction,
  );
  const { selectedProductId, cartItems } = useAppSelector((state) => state.checkout);

  // Start polling as soon as we arrive with a pending transaction
  useEffect(() => {
    if (loadingState !== 'polling' || !id) return;

    dispatch(pollTransactionStatus(id))
      .unwrap()
      .then(async (finalResult) => {
        if (finalResult.status === 'APPROVED') {
          const productIdsToRefresh =
            cartItems.length > 1
              ? cartItems.map((item) => item.productId)
              : selectedProductId ? [selectedProductId] : [];

          await Promise.allSettled(
            productIdsToRefresh.map(async (pid) => {
              try {
                const fresh = await productsApi.fetchProductById(pid);
                dispatch(updateProductStock({ productId: pid, newStock: fresh.stock }));
              } catch { /* non-critical */ }
            }),
          );
        }
      })
      .catch(() => {});
  }, [id, loadingState]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleReturn = () => {
    dispatch(resetCheckout());
    dispatch(resetTransaction());
    dispatch(fetchProducts());
    sessionStorage.setItem('checkout_just_reset', '1');
    navigate(ROUTES.PRODUCTS);
  };

  // Wait until the store has real transaction data before animating
  if (!status || !id) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center gap-4 bg-white">
        <p className="text-lg font-semibold text-gray-700">¡Ya casi es tuyo!</p>
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    );
  }

  return (
    <TransactionResult
      key={status}
      status={status}
      reference={reference}
      amountInCents={amountInCents}
      isPolling={loadingState === 'polling'}
      onReturn={handleReturn}
    />
  );
}
