'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  optional?: boolean;
  helperText?: string;
}

export default function Input({
  label,
  error,
  optional = false,
  helperText,
  id,
  className = '',
  ...props
}: InputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-navy mb-1.5"
      >
        {label}
        {optional && (
          <span className="text-muted font-normal ml-1">(optional)</span>
        )}
      </label>
      <input
        id={inputId}
        className={`
          w-full px-4 py-3 text-base rounded-xl border border-border
          bg-white text-navy placeholder:text-muted/60
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-1 focus:border-orange
          disabled:bg-gray-50 disabled:text-muted disabled:cursor-not-allowed
          ${error ? 'border-error ring-1 ring-error' : ''}
          ${className}
        `.trim()}
        {...props}
      />
      {helperText && !error && (
        <p className="mt-1 text-xs text-muted">{helperText}</p>
      )}
      {error && (
        <p className="mt-1 text-xs text-error font-medium">{error}</p>
      )}
    </div>
  );
}
