import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CardNumberInput } from '../CardNumberInput';
import { Input } from '../../../../shared/ui/Input';

const cardSchema = z.object({
  cardNumber: z.string().min(16, 'Card number is too short').max(19, 'Card number is too long'),
  brand: z.enum(['VISA', 'MASTERCARD']).nullable(),
  holderName: z.string().min(2, 'Name is required').max(50, 'Name is too long'),
  expiryMonth: z.string().min(2, 'Required').max(2),
  expiryYear: z.string().min(2, 'Required').max(2),
  cvv: z.string().min(3, 'Required').max(4),
});

export type CardFormData = z.infer<typeof cardSchema>;

interface CardFormProps {
  onSubmit: (data: CardFormData) => void;
}

export function CardForm({ onSubmit }: CardFormProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      cardNumber: '',
      brand: null,
      holderName: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* Card Number */}
      <Controller
        name="cardNumber"
        control={control}
        render={({ field }) => (
          <CardNumberInput
            onChange={(value, brand) => {
              field.onChange(value);
              // Also update the brand field when card number changes
              control._formValues.brand = brand;
            }}
            error={errors.cardNumber?.message}
          />
        )}
      />

      {/* Holder Name */}
      <Input
        id="holderName"
        label="Cardholder Name"
        type="text"
        placeholder="e.g. John Doe"
        {...register('holderName')}
        error={errors.holderName?.message}
      />

      {/* Expiry and CVV Row */}
      <div className="flex gap-4">
        <div className="flex-1 flex gap-2">
          <div className="flex-1">
            <Input
              id="expiryMonth"
              label="Month (MM)"
              type="text"
              inputMode="numeric"
              maxLength={2}
              placeholder="MM"
              {...register('expiryMonth')}
              error={errors.expiryMonth?.message}
            />
          </div>
          <div className="flex-1">
            <Input
              id="expiryYear"
              label="Year (YY)"
              type="text"
              inputMode="numeric"
              maxLength={2}
              placeholder="YY"
              {...register('expiryYear')}
              error={errors.expiryYear?.message}
            />
          </div>
        </div>
        
        <div className="flex-[0.5]">
          <Input
            id="cvv"
            label="CVV"
            type="text"
            inputMode="numeric"
            maxLength={4}
            placeholder="123"
            {...register('cvv')}
            error={errors.cvv?.message}
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 w-full rounded-lg bg-[#222] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#333] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors"
      >
        Continue to summary
      </button>
    </form>
  );
}
