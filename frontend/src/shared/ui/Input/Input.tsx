import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, id, className = '', ...props }: InputProps) {
  // TODO: implement styling with Tailwind classes
  return (
    <div className="input-wrapper">
      <label htmlFor={id}>{label}</label>
      <input id={id} className={`input ${className}`} {...props} />
      {error && <span className="input-error">{error}</span>}
    </div>
  );
}
