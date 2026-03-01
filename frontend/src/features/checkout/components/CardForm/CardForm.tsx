import { useState, useRef, useEffect } from 'react';
import { useForm, Controller, useController } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ReactCreditCards, { type Focused } from 'react-credit-cards-2';
import { useCardValidation } from '../../hooks/useCardValidation';
import { Input } from '../../../../shared/ui/Input';
import { detectCardBrand, isValidLuhn } from '../../../../shared/utils/cardValidation';

const currentYear = new Date().getFullYear() % 100; // e.g. 25
const currentMonth = new Date().getMonth() + 1;     // 1-12

const cardSchema = z.object({
  cardNumber: z
    .string()
    .min(1, 'Card number is required')
    .refine((v) => {
      const digits = v.replace(/\s/g, '');
      return digits.length >= 16 && digits.length <= 19;
    }, 'Card number must be 16–19 digits')
    .refine((v) => isValidLuhn(v.replace(/\s/g, '')), 'Invalid card number'),
  brand: z.enum(['VISA', 'MASTERCARD']).nullable(),
  holderName: z
    .string()
    .min(2, 'Name is required')
    .max(50, 'Name is too long')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Only letters and spaces allowed'),
  expiryMonth: z
    .string()
    .length(2, 'Enter MM')
    .refine((v) => {
      const m = parseInt(v, 10);
      return m >= 1 && m <= 12;
    }, 'Invalid month (01–12)'),
  expiryYear: z
    .string()
    .length(2, 'Enter YY')
    .refine((v) => /^\d{2}$/.test(v), 'Must be 2 digits')
    .refine((v) => parseInt(v, 10) >= currentYear, `Year must be ${currentYear} or later`),
  cvv: z
    .string()
    .min(3, 'CVV is required')
    .max(4, 'CVV too long')
    .regex(/^\d{3,4}$/, 'CVV must be 3–4 digits'),
}).refine(
  (data) => {
    const month = parseInt(data.expiryMonth, 10);
    const year = parseInt(data.expiryYear, 10);
    if (isNaN(month) || isNaN(year)) return true; // let field errors handle it
    if (year > currentYear) return true;
    if (year === currentYear && month >= currentMonth) return true;
    return false;
  },
  { message: 'Card is expired', path: ['expiryYear'] }
);

export type CardFormData = z.infer<typeof cardSchema>;

interface CardDefaultValues {
  cardNumber?: string;
  holderName?: string;
  expiryMonth?: string;
  expiryYear?: string;
}

interface CardFormProps {
  onSubmit: (data: CardFormData) => void;
  autoFocus?: boolean;
  defaultValues?: CardDefaultValues;
}

export function CardForm({ onSubmit, autoFocus, defaultValues }: CardFormProps) {
  const [focused, setFocused] = useState<Focused>('');
  const [cvvValue, setCvvValue] = useState('');
  const { formattedNumber, brand: detectedBrand, handleCardNumberChange } = useCardValidation(defaultValues?.cardNumber ?? '');

  const holderRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);
  const cvvRef = useRef<HTMLInputElement>(null);

  // Only allow numeric keystrokes in digit-only fields
  const onlyDigits = (e: React.KeyboardEvent) => {
    if (!/^\d$/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
      e.preventDefault();
    }
  };

  // Merge RHF ref with our imperative ref
  const mergeRef = <T,>(rhfRef: React.Ref<T>, localRef: React.RefObject<T | null>) =>
    (node: T | null) => {
      localRef.current = node;
      if (typeof rhfRef === 'function') rhfRef(node);
      else if (rhfRef && typeof rhfRef === 'object') (rhfRef as React.MutableRefObject<T | null>).current = node;
    };

  const {
    control,
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    mode: 'onBlur',
    defaultValues: {
      cardNumber: defaultValues?.cardNumber ?? '',
      brand: null,
      holderName: defaultValues?.holderName ?? '',
      expiryMonth: defaultValues?.expiryMonth ?? '',
      expiryYear: defaultValues?.expiryYear ?? '',
      cvv: '',
    },
  });

  // When editing (pre-filled data), validate immediately so the button is enabled
  useEffect(() => {
    if (defaultValues?.cardNumber) {
      trigger();
    }
  }, []);

  const holderName = watch('holderName');
  const expiryMonth = watch('expiryMonth');
  const expiryYear = watch('expiryYear');

  const expiryDisplay = expiryMonth || expiryYear
    ? `${expiryMonth.padEnd(2, ' ')}/${expiryYear}`
    : '';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {/* Animated Card Preview */}
      <div className="flex justify-center py-2">
        <ReactCreditCards
          number={formattedNumber}
          name={holderName || 'FULL NAME'}
          expiry={expiryDisplay}
          cvc={cvvValue}
          focused={focused}
        />
      </div>

      {/* Card Number */}
      <Controller
        name="cardNumber"
        control={control}
        render={({ field }) => {
          const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            handleCardNumberChange(e.target.value);
            const raw = e.target.value.replace(/\s/g, '');
            field.onChange(raw);
            control._formValues.brand = detectCardBrand(raw);
            // Auto-advance to holder name when 16 digits entered
            if (raw.length >= 16) holderRef.current?.focus();
          };

          return (
            <Input
              id="card-number"
              label="Card Number"
              type="text"
              inputMode="numeric"
              maxLength={19}
              autoFocus={autoFocus}
              value={formattedNumber}
              onChange={handleChange}
              onKeyDown={onlyDigits}
              onFocus={() => setFocused('number')}
              placeholder="1234 5678 9012 3456"
              error={errors.cardNumber?.message}
              endIcon={
                detectedBrand === 'VISA' ? <VisaIcon /> :
                detectedBrand === 'MASTERCARD' ? <MastercardIcon /> :
                <GenericCardIcon />
              }
            />
          );
        }}
      />

      {/* Holder Name */}
      {(() => {
        const { ref: rhfRef, onChange, onBlur, name } = register('holderName');
        return (
          <Input
            id="holderName"
            label="Cardholder Name"
            type="text"
            placeholder="e.g. John Doe"
            name={name}
            onChange={onChange}
            onBlur={onBlur}
            ref={mergeRef(rhfRef, holderRef)}
            onFocus={() => setFocused('name')}
            error={errors.holderName?.message}
          />
        );
      })()}

      {/* Expiry + CVV row */}
      <div className="grid grid-cols-3 gap-3">
        {(() => {
          const { ref: rhfRef, onChange, onBlur, name } = register('expiryMonth');
          return (
            <Input
              id="expiryMonth"
              label="Month"
              type="text"
              inputMode="numeric"
              maxLength={2}
              placeholder="MM"
              name={name}
              onChange={(e) => {
                let val = e.target.value.replace(/\D/g, '');
                // If first digit is 2-9, auto-pad immediately: "3" → "03"
                if (val.length === 1 && parseInt(val, 10) > 1) {
                  val = val.padStart(2, '0');
                  e.target.value = val;
                }
                onChange(e);
                if (val.length === 2) {
                  setValue('expiryMonth', val, { shouldValidate: true });
                  yearRef.current?.focus();
                }
              }}
              onBlur={(e) => {
                // Pad on blur: "1" → "01"
                if (e.target.value.length === 1) {
                  const padded = e.target.value.padStart(2, '0');
                  setValue('expiryMonth', padded, { shouldValidate: true });
                  e.target.value = padded;
                }
                onBlur(e);
              }}
              ref={mergeRef(rhfRef, monthRef)}
              onKeyDown={onlyDigits}
              onFocus={() => setFocused('expiry')}
              error={errors.expiryMonth?.message}
            />
          );
        })()}
        {(() => {
          const { ref: rhfRef, onChange, onBlur, name } = register('expiryYear');
          return (
            <Input
              id="expiryYear"
              label="Year"
              type="text"
              inputMode="numeric"
              maxLength={2}
              placeholder="YY"
              name={name}
              onChange={(e) => { onChange(e); if (e.target.value.length === 2) cvvRef.current?.focus(); }}
              onBlur={onBlur}
              ref={mergeRef(rhfRef, yearRef)}
              onKeyDown={onlyDigits}
              onFocus={() => setFocused('expiry')}
              error={errors.expiryYear?.message}
            />
          );
        })()}
        {(() => {
          const { ref: rhfRef, onChange, onBlur, name } = register('cvv');
          return (
            <Input
              id="cvv"
              label="CVV"
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="•••"
              name={name}
              onChange={(e) => { onChange(e); setCvvValue(e.target.value); }}
              onBlur={(e) => { onBlur(e); setFocused(''); }}
              ref={mergeRef(rhfRef, cvvRef)}
              onKeyDown={onlyDigits}
              onFocus={() => setFocused('cvc')}
              error={errors.cvv?.message}
            />
          );
        })()}
      </div>

      <button
        type="submit"
        disabled={!isValid}
        className="mt-2 w-full rounded-xl bg-[#222] px-4 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-[#333] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Continue to summary
      </button>
    </form>
  );
}

/* ─── Brand Icons ─── */

function VisaIcon() {
  return (
    <svg viewBox="0 0 50 16" className="h-4 w-auto drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21.928 0.449951L19.508 15.54H23.518L25.928 0.449951H21.928ZM36.918 0.449951C35.888 0.129951 34.508 -0.0100488 32.968 -0.0100488C28.848 -0.0100488 25.908 2.21995 25.888 5.43995C25.858 7.78995 27.978 9.09995 29.548 9.87995C31.158 10.66 31.708 11.16 31.708 11.88C31.698 12.97 30.408 13.43 29.118 13.43C27.148 13.43 25.928 12.89 24.978 12.44L24.418 12.16L23.858 15.65C24.838 16.1 26.838 16.48 28.918 16.49C33.298 16.49 36.198 14.32 36.238 11.02C36.268 8.98995 34.908 7.50995 30.048 5.14995C29.748 4.99995 29.628 4.93995 29.508 4.87995C28.438 4.34995 27.878 4.00995 27.888 3.25995C27.898 2.55995 28.668 1.83995 30.408 1.83995C31.838 1.81995 33.008 2.14995 33.918 2.55995L34.258 2.71995L34.928 2.85995L35.498 0.999951H36.918V0.449951ZM47.668 15.54H51.138L48.868 0.449951H45.628C44.598 0.449951 43.838 0.819951 43.348 1.76995L37.128 15.54H41.308L42.138 13.18H47.218L47.668 15.54ZM43.268 9.94995L45.328 4.14995L46.528 9.94995H43.268ZM15.828 0.449951L11.418 10.99L10.948 8.65995L10.928 8.54995C10.598 6.94995 9.078 4.97995 7.038 3.86995L7.008 3.84995L7.028 3.96995C7.268 5.41995 10.278 15.53 10.278 15.53H14.478L20.068 0.449951H15.828ZM0.128006 0.449951L0 1.05995C1.84 1.43995 4.16 2.37995 5.4 3.39995L5.43 3.37995L6.44 8.78995C6.44 8.78995 6.09 6.89995 5.86 5.66995L5.83 5.51995L5.78 5.38995C4.34 1.45995 1.00801 0.659951 0.128006 0.449951Z" fill="#1434CB"/>
    </svg>
  );
}

function MastercardIcon() {
  return (
    <svg viewBox="0 0 24 16" className="h-5 w-auto drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="16" rx="2" fill="#222222" fillOpacity="0.05" />
      <circle cx="8" cy="8" r="5" fill="#EB001B"/>
      <circle cx="16" cy="8" r="5" fill="#F79E1B"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M12 12.3323C13.2045 11.396 14 9.79976 14 8C14 6.20024 13.2045 4.604 12 3.66774C10.7955 4.604 10 6.20024 10 8C10 9.79976 10.7955 11.396 12 12.3323Z" fill="#FF5F00"/>
    </svg>
  );
}

function GenericCardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-400">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}
