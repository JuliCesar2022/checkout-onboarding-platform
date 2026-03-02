import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { DeliveryAddress } from '../../types';
import { Input } from '../../../../shared/ui/Input';

const deliverySchema = z.object({
  recipientName: z.string().min(2, 'Nombre requerido'),
  email: z.string().email('Correo electrónico inválido'),
  addressLine1: z.string().min(5, 'Dirección requerida'),
  addressLine2: z.string().optional(),
  addressDetail: z.string().optional(),
  city: z.string().min(2, 'Ciudad requerida'),
  department: z.string().min(2, 'Departamento requerido'),
  phoneNumber: z.string().min(7, 'Teléfono inválido').max(15, 'Teléfono muy largo'),
});

export type DeliveryFormData = z.infer<typeof deliverySchema>;

interface DeliveryFormProps {
  onSubmit: (data: DeliveryAddress) => void;
  defaultValues?: Partial<DeliveryFormData>;
  autoFocus?: boolean;
}

export function DeliveryForm({ onSubmit, defaultValues, autoFocus }: DeliveryFormProps) {
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isValid },
  } = useForm<DeliveryFormData>({
    resolver: zodResolver(deliverySchema),
    mode: 'onChange',
    defaultValues: {
      recipientName: '',
      email: '',
      addressLine1: '',
      addressLine2: '',
      addressDetail: '',
      city: '',
      department: '',
      phoneNumber: '',
      ...defaultValues,
    },
  });

  // When editing (pre-filled data), validate immediately so the button is enabled
  useEffect(() => {
    if (defaultValues?.recipientName) {
      trigger();
    }
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        id="recipientName"
        label="Nombre del destinatario"
        type="text"
        placeholder="ej. Jane Doe"
        autoFocus={autoFocus}
        {...register('recipientName')}
        error={errors.recipientName?.message}
      />

      <Input
        id="email"
        label="Correo electrónico"
        type="email"
        inputMode="email"
        placeholder="ej. juan@email.com"
        {...register('email')}
        error={errors.email?.message}
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

      <Input
        id="addressDetail"
        label="Detalles adicionales (Torre, Apto, etc.)"
        type="text"
        placeholder="ej. Torre 2, Apto 402"
        {...register('addressDetail')}
        error={errors.addressDetail?.message}
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
        disabled={!isValid}
        className="mt-4 w-full rounded-xl bg-[#222] px-4 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-[#333] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </form>
  );
}
