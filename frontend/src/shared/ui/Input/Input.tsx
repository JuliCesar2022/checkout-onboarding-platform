import { forwardRef, useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  endIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, endIcon, id: propsId, className = '', ...props }, ref) => {
    const generatedId = useId();
    const id = propsId || generatedId;
    const errorId = `${id}-error`;

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="text-sm font-semibold text-gray-700 ml-0.5">
          {label}
        </label>
        <div className="relative group">
          <input
            id={id}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-offset-0 ${
              error
                ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                : 'border-gray-200 focus:border-gray-900 focus:ring-gray-100 group-hover:border-gray-300'
            } ${endIcon ? 'pr-12' : ''} ${className}`}
            {...props}
          />
          {endIcon && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 group-focus-within:text-gray-600 transition-colors">
              {endIcon}
            </div>
          )}
        </div>
        {error && (
          <span id={errorId} className="text-xs font-medium text-red-600 ml-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
