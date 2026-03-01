import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { DeliveryAddress } from '../../types';
import { Input } from '../../../../shared/ui/Input';

const deliverySchema = z.object({
  recipientName: z.string().min(2, 'Name is required'),
  addressLine1: z.string().min(5, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  department: z.string().min(2, 'Department/Region is required'),
  phoneNumber: z.string().min(7, 'Valid phone number is required').max(15, 'Phone number is too long'),
});

export type DeliveryFormData = z.infer<typeof deliverySchema>;

interface DeliveryFormProps {
  onSubmit: (data: DeliveryAddress) => void;
}

export function DeliveryForm({ onSubmit }: DeliveryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeliveryFormData>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      recipientName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      department: '',
      phoneNumber: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        id="recipientName"
        label="Recipient Name"
        type="text"
        placeholder="e.g. Jane Doe"
        {...register('recipientName')}
        error={errors.recipientName?.message}
      />

      <Input
        id="phoneNumber"
        label="Phone Number"
        type="tel"
        inputMode="tel"
        placeholder="e.g. 300 123 4567"
        {...register('phoneNumber')}
        error={errors.phoneNumber?.message}
      />

      <Input
        id="addressLine1"
        label="Address Line 1"
        type="text"
        placeholder="e.g. 123 Main St"
        {...register('addressLine1')}
        error={errors.addressLine1?.message}
      />

      <Input
        id="addressLine2"
        label="Address Line 2 (Optional)"
        type="text"
        placeholder="Apt, Suite, Bldg. (optional)"
        {...register('addressLine2')}
        error={errors.addressLine2?.message}
      />

      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            id="city"
            label="City"
            type="text"
            placeholder="e.g. Bogota"
            {...register('city')}
            error={errors.city?.message}
          />
        </div>
        <div className="flex-1">
          <Input
            id="department"
            label="Department"
            type="text"
            placeholder="e.g. Cundinamarca"
            {...register('department')}
            error={errors.department?.message}
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
      >
        Continue
      </button>
    </form>
  );
}
