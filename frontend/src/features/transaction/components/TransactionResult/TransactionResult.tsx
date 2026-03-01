import type { TransactionStatus } from '../../types';
import { Button } from '../../../../shared/ui/Button';

interface TransactionResultProps {
  status: TransactionStatus | null;
  reference: string | null;
  amountInCents: number | null;
  onReturn: () => void;
}

export function TransactionResult({ status, reference, amountInCents, onReturn }: TransactionResultProps) {
  const isApproved = status === 'APPROVED';
  // TODO: implement with animated status icon and Tailwind styling
  return (
    <section aria-label="Transaction result">
      <div aria-label={isApproved ? 'Payment approved' : 'Payment declined'}>
        {isApproved ? '✓' : '✕'}
      </div>
      <h1>{isApproved ? 'Payment Approved' : 'Payment Declined'}</h1>
      {reference && <p>Reference: {reference}</p>}
      {amountInCents && <p>Amount: {amountInCents}</p>}
      <Button onClick={onReturn}>Return to Store</Button>
    </section>
  );
}
