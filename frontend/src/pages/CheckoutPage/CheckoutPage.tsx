import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { proceedToSummary, resetCheckout, startProcessing } from '../../store/slices/checkoutSlice';
import { CheckoutModal } from '../../components/checkout/CheckoutModal';
import { OrderSummaryBackdrop } from '../../components/checkout/OrderSummaryBackdrop';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { ROUTES } from '../../constants/routes';

export function CheckoutPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { step, fees, error } = useAppSelector((state) => state.checkout);
  const { loadingState } = useAppSelector((state) => state.transaction);

  const handleClose = () => {
    dispatch(resetCheckout());
    navigate(ROUTES.PRODUCTS);
  };

  const handlePay = () => {
    dispatch(startProcessing());
    // TODO: dispatch(submitTransaction(...)) with card token + fees
    // TODO: navigate to /status on COMPLETE
  };

  return (
    <PageWrapper>
      <CheckoutModal
        isOpen={step === 'FORM' || step === 'SUMMARY' || step === 'PROCESSING'}
        onClose={handleClose}
        onProceedToSummary={() => dispatch(proceedToSummary())}
      />
      <OrderSummaryBackdrop
        isOpen={step === 'SUMMARY' || step === 'PROCESSING'}
        fees={fees}
        isLoading={loadingState === 'submitting' || loadingState === 'polling'}
        error={error}
        onPay={handlePay}
      />
    </PageWrapper>
  );
}
