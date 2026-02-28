import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
  children: React.ReactNode;
}

export function Button({ variant = 'primary', isLoading = false, children, className = '', ...props }: ButtonProps) {
  // TODO: implement styling with Tailwind classes
  return (
    <button
      className={`button button--${variant} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
}
