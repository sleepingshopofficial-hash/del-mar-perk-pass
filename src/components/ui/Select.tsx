'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label: string;
  options: SelectOption[];
  error?: string;
  optional?: boolean;
  placeholder?: string;
}

export default function Select({
  label,
  options,
  error,
  optional = false,
  placeholder = 'Select an option',
  id,
  className = '',
  ...props
}: SelectProps) {
  const selectId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      <label
        htmlFor={selectId}
        className="block text-sm font-medium text-navy mb-1.5"
      >
        {label}
        {optional && (
          <span className="text-muted font-normal ml-1">(optional)</span>
        )}
      </label>
      <div className="relative">
        <select
          id={selectId}
          className={`
            w-full px-4 py-3 text-base rounded-xl border border-border
            bg-white text-navy appearance-none
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-1 focus:border-orange
            disabled:bg-gray-50 disabled:text-muted disabled:cursor-not-allowed
            ${error ? 'border-error ring-1 ring-error' : ''}
            ${className}
          `.trim()}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted pointer-events-none" />
      </div>
      {error && (
        <p className="mt-1 text-xs text-error font-medium">{error}</p>
      )}
    </div>
  );
}
