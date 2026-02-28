import type { FeeBreakdown } from '../../../types/checkout.types';
import { Backdrop } from '../../ui/Backdrop';
import { Button } from '../../ui/Button';
import { ErrorBanner } from '../../ui/ErrorBanner';

interface OrderSummaryBackdropProps {
  isOpen: boolean;
  fees: FeeBreakdown | null;
  isLoading: boolean;
  error: string | null;
  onPay: () => void;
}

export function OrderSummaryBackdrop({ isOpen, fees, isLoading, error, onPay }: OrderSummaryBackdropProps) {
  // TODO: implement fee breakdown display with Tailwind
  return (
    <Backdrop isOpen={isOpen}>
      <h2>Order Summary</h2>
      {fees && (
        <ul>
          <li>Product: {fees.productAmount}</li>
          <li>Base fee: {fees.baseFee}</li>
          <li>Delivery fee: {fees.deliveryFee}</li>
          <li>Total: {fees.totalAmount}</li>
        </ul>
      )}
      <ErrorBanner message={error} />
      <Button onClick={onPay} isLoading={isLoading}>
        Pay
      </Button>
    </Backdrop>
  );
}
