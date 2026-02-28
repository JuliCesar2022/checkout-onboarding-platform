import { useCardValidation } from '../../../hooks/useCardValidation';
import { Input } from '../../ui/Input';

interface CardNumberInputProps {
  onChange: (value: string, brand: 'VISA' | 'MASTERCARD' | null) => void;
  error?: string;
}

export function CardNumberInput({ onChange, error }: CardNumberInputProps) {
  const { formattedNumber, brand, handleCardNumberChange } = useCardValidation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleCardNumberChange(e.target.value);
    onChange(e.target.value, brand);
  };

  return (
    <div>
      {/* TODO: show Visa/Mastercard logo based on brand */}
      {brand === 'VISA' && <span aria-label="Visa card">VISA</span>}
      {brand === 'MASTERCARD' && <span aria-label="Mastercard card">MC</span>}
      <Input
        id="card-number"
        label="Card number"
        type="text"
        inputMode="numeric"
        maxLength={19}
        value={formattedNumber}
        onChange={handleChange}
        placeholder="1234 5678 9012 3456"
        error={error}
      />
    </div>
  );
}
