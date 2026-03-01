import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../../shared/hooks/useAppSelector';
import { ROUTES } from '../../../constants/routes';

/**
 * Orchestrates navigation based on Redux checkout step.
 * Recovers the user's progress when the page is refreshed.
 * Mount this hook in the App root.
 */
export function useCheckoutFlow() {
  const navigate = useNavigate();
  const location = useLocation();
  const step = useAppSelector((state) => state.checkout.step);
  const transactionId = useAppSelector((state) => state.transaction.id);

  useEffect(() => {
    // Recovery: ensure URL matches Redux step on mount
    if (step === 'IDLE' && location.pathname !== ROUTES.PRODUCTS) {
      navigate(ROUTES.PRODUCTS, { replace: true });
    }

    if ((step === 'FORM' || step === 'SUMMARY') && location.pathname !== ROUTES.CHECKOUT) {
      navigate(ROUTES.CHECKOUT, { replace: true });
    }

    if (step === 'COMPLETE' && location.pathname !== ROUTES.TRANSACTION_STATUS) {
      navigate(ROUTES.TRANSACTION_STATUS, { replace: true });
    }

    // If app crashed during PROCESSING and transactionId exists, resume polling
    // TODO: dispatch(pollTransactionStatus(transactionId)) when implemented
    if (step === 'PROCESSING' && transactionId) {
      // polling will be dispatched from the CheckoutPage
    }
  }, []); // runs once on mount for recovery
}
