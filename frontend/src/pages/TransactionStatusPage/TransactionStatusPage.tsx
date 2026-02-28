import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { resetCheckout } from '../../store/slices/checkoutSlice';
import { resetTransaction } from '../../store/slices/transactionSlice';
import { fetchProducts } from '../../store/slices/productsSlice';
import { TransactionResult } from '../../components/transaction/TransactionResult';
import { PageWrapper } from '../../components/layout/PageWrapper';
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
