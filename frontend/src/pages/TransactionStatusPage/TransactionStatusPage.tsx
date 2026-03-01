import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../shared/hooks/useAppDispatch';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { resetCheckout } from '../../features/checkout/store/checkoutSlice';
import { resetTransaction } from '../../features/transaction/store/transactionSlice';
import { fetchProducts } from '../../features/products/store/productsSlice';
import { TransactionResult } from '../../features/transaction/components/TransactionResult';
import { PageWrapper } from '../../shared/layout/PageWrapper';
import { ROUTES } from '../../constants/routes';

export function TransactionStatusPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, reference, amountInCents } = useAppSelector((state) => state.transaction);

  const handleReturn = () => {
    dispatch(resetCheckout());
    dispatch(resetTransaction());
    dispatch(fetchProducts()); // refresh stock
    navigate(ROUTES.PRODUCTS);
  };

  return (
    <PageWrapper>
      <TransactionResult
        status={status}
        reference={reference}
        amountInCents={amountInCents}
        onReturn={handleReturn}
      />
    </PageWrapper>
  );
}
