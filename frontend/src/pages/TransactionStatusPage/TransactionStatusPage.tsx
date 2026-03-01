import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../shared/hooks/useAppDispatch';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { resetCheckout } from '../../features/checkout/store/checkoutSlice';
import { resetTransaction } from '../../features/transaction/store/transactionSlice';
import { fetchProducts } from '../../features/products/store/productsSlice';
import { TransactionResult } from '../../features/transaction/components/TransactionResult';
import { ROUTES } from '../../constants/routes';

export function TransactionStatusPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, reference, amountInCents } = useAppSelector((state) => state.transaction);

  const handleReturn = () => {
    dispatch(resetCheckout());
    dispatch(resetTransaction());
    dispatch(fetchProducts()); // refresh stock
    // Flag so ProductsPage skips the pending-checkout modal on this navigation
    // (avoids a redux-persist race condition where old persisted step is re-read)
    sessionStorage.setItem('checkout_just_reset', '1');
    navigate(ROUTES.PRODUCTS);
  };

  return (
    <TransactionResult
      status={status}
      reference={reference}
      amountInCents={amountInCents}
      onReturn={handleReturn}
    />
  );
}
