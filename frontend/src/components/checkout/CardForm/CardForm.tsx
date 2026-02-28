import { CardNumberInput } from '../CardNumberInput';

interface CardFormProps {
  onSubmit: (data: unknown) => void;
}

export function CardForm({ onSubmit }: CardFormProps) {
  // TODO: implement with react-hook-form + zod validation
  // Fields: cardNumber, holderName, expiryMonth, expiryYear, cvv (local state only - never to Redux)
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({}); }}>
      <CardNumberInput onChange={() => {}} />
      {/* TODO: holderName, expiry, cvv fields */}
      <button type="submit">Continue to summary</button>
    </form>
  );
}
