import type { DeliveryAddress } from '../../types';

interface DeliveryFormProps {
  onSubmit: (data: DeliveryAddress) => void;
}

export function DeliveryForm({ onSubmit }: DeliveryFormProps) {
  // TODO: implement with react-hook-form + zod validation
  // Fields: recipientName, addressLine1, addressLine2, city, department, phoneNumber
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({} as DeliveryAddress); }}>
      {/* TODO: delivery fields */}
      <button type="submit">Continue</button>
    </form>
  );
}
