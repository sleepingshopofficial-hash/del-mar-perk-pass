'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  disabled?: boolean;
  className?: string;
}

export default function Checkbox({
  label,
  checked,
  onChange,
  id,
  disabled = false,
  className = '',
}: CheckboxProps) {
  const checkboxId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <label
      htmlFor={checkboxId}
      className={`
        flex items-center gap-3 cursor-pointer select-none
        py-2 px-1 rounded-lg transition-colors
        hover:bg-navy/3
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `.trim()}
    >
      <div className="relative flex-shrink-0">
        <input
          type="checkbox"
          id={checkboxId}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
        />
        <div
          className={`
            w-6 h-6 rounded-lg border-2 transition-all duration-200
            flex items-center justify-center
            ${
              checked
                ? 'bg-orange border-orange'
                : 'bg-white border-border hover:border-navy/40'
            }
          `.trim()}
        >
          {checked && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
        </div>
      </div>
      <span className="text-sm font-medium text-navy">{label}</span>
    </label>
  );
}
