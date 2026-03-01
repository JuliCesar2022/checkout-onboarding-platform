import { useCardValidation } from '../../hooks/useCardValidation';
import { Input } from '../../../../shared/ui/Input';

const VisaIcon = () => (
  <svg viewBox="0 0 50 16" className="h-4 w-auto drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.928 0.449951L19.508 15.54H23.518L25.928 0.449951H21.928ZM36.918 0.449951C35.888 0.129951 34.508 -0.0100488 32.968 -0.0100488C28.848 -0.0100488 25.908 2.21995 25.888 5.43995C25.858 7.78995 27.978 9.09995 29.548 9.87995C31.158 10.66 31.708 11.16 31.708 11.88C31.698 12.97 30.408 13.43 29.118 13.43C27.148 13.43 25.928 12.89 24.978 12.44L24.418 12.16L23.858 15.65C24.838 16.1 26.838 16.48 28.918 16.49C33.298 16.49 36.198 14.32 36.238 11.02C36.268 8.98995 34.908 7.50995 30.048 5.14995C29.748 4.99995 29.628 4.93995 29.508 4.87995C28.438 4.34995 27.878 4.00995 27.888 3.25995C27.898 2.55995 28.668 1.83995 30.408 1.83995C31.838 1.81995 33.008 2.14995 33.918 2.55995L34.258 2.71995L34.928 2.85995L35.498 0.999951H36.918V0.449951ZM47.668 15.54H51.138L48.868 0.449951H45.628C44.598 0.449951 43.838 0.819951 43.348 1.76995L37.128 15.54H41.308L42.138 13.18H47.218L47.668 15.54ZM43.268 9.94995L45.328 4.14995L46.528 9.94995H43.268ZM15.828 0.449951L11.418 10.99L10.948 8.65995L10.928 8.54995C10.598 6.94995 9.078 4.97995 7.038 3.86995L7.008 3.84995L7.028 3.96995C7.268 5.41995 10.278 15.53 10.278 15.53H14.478L20.068 0.449951H15.828ZM0.128006 0.449951L0 1.05995C1.84 1.43995 4.16 2.37995 5.4 3.39995L5.43 3.37995L6.44 8.78995C6.44 8.78995 6.09 6.89995 5.86 5.66995L5.83 5.51995L5.78 5.38995C4.34 1.45995 1.00801 0.659951 0.128006 0.449951Z" fill="#1434CB"/>
  </svg>
);

const MastercardIcon = () => (
  <svg viewBox="0 0 24 16" className="h-5 w-auto drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="16" rx="2" fill="#222222" fillOpacity="0.05" />
    <circle cx="8" cy="8" r="5" fill="#EB001B"/>
    <circle cx="16" cy="8" r="5" fill="#F79E1B"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 12.3323C13.2045 11.396 14 9.79976 14 8C14 6.20024 13.2045 4.604 12 3.66774C10.7955 4.604 10 6.20024 10 8C10 9.79976 10.7955 11.396 12 12.3323Z" fill="#FF5F00"/>
  </svg>
);

const GenericCardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-400">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
);

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

  const Icon = brand === 'VISA' ? <VisaIcon /> : brand === 'MASTERCARD' ? <MastercardIcon /> : <GenericCardIcon />;

  return (
    <div>
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
        endIcon={Icon}
      />
    </div>
  );
}
