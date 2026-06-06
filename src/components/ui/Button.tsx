'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-orange text-white hover:bg-orange-dark active:bg-orange-dark shadow-md hover:shadow-lg',
  secondary:
    'bg-transparent border-2 border-navy text-navy hover:bg-navy hover:text-white active:bg-navy-dark',
  ghost:
    'bg-transparent text-navy hover:bg-navy/5 active:bg-navy/10',
  danger:
    'bg-error text-white hover:bg-red-600 active:bg-red-700 shadow-md',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm min-h-[40px]',
  md: 'px-6 py-3 text-base min-h-[48px]',
  lg: 'px-8 py-4 text-lg min-h-[56px]',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-semibold
        rounded-xl transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
        cursor-pointer select-none
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `.trim()}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin mr-2 h-5 w-5" />
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
