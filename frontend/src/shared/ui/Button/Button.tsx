import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<string, string> = {
  primary:
    'bg-linear-to-r from-gray-900 to-gray-800 text-white hover:from-black hover:to-gray-900 shadow-sm focus-visible:ring-gray-400 disabled:from-gray-400 disabled:to-gray-400',
  secondary:
    'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 focus-visible:ring-gray-400 disabled:opacity-50',
  danger:
    'bg-linear-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 shadow-sm focus-visible:ring-red-500 disabled:from-red-300 disabled:to-red-300',
};

export function Button({ variant = 'primary', isLoading = false, children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer disabled:cursor-not-allowed active:scale-[0.98] ${variantClasses[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
