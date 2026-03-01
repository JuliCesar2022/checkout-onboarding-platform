import type { FeeBreakdown } from '../../types';
import { Backdrop } from '../../../../shared/ui/Backdrop';
import { Button } from '../../../../shared/ui/Button';
import { ErrorBanner } from '../../../../shared/ui/ErrorBanner';

interface OrderSummaryBackdropProps {
  isOpen: boolean;
  fees: FeeBreakdown | null;
  isLoading: boolean;
  error: string | null;
  onPay: () => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export function OrderSummaryBackdrop({ isOpen, fees, isLoading, error, onPay }: OrderSummaryBackdropProps) {
  return (
    <Backdrop isOpen={isOpen}>
      <div className="flex flex-col h-full">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
        
        {fees ? (
          <div className="flex-1">
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Product amount</span>
                <span className="font-medium text-gray-900">{formatCurrency(fees.productAmount)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Base fee (Wompi)</span>
                <span className="font-medium text-gray-900">{formatCurrency(fees.baseFee)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Delivery fee</span>
                <span className="font-medium text-gray-900">{formatCurrency(fees.deliveryFee)}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-base font-semibold text-gray-900">Total</span>
                <span className="text-xl font-bold text-indigo-600">{formatCurrency(fees.totalAmount)}</span>
              </div>
            </div>
            
            {error && (
              <div className="mb-4">
                <ErrorBanner message={error} />
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 py-8">
            Calculating fees...
          </div>
        )}

        <div className="mt-auto">
          <Button 
            onClick={onPay} 
            isLoading={isLoading}
            disabled={!fees || isLoading}
            className="w-full"
          >
            {isLoading ? 'Processing...' : 'Pay now'}
          </Button>
        </div>
      </div>
    </Backdrop>
  );
}
