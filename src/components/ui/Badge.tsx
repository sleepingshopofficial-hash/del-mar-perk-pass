'use client';

import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'info' | 'orange';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-navy/10 text-navy',
  success: 'bg-success/10 text-success',
  warning: 'bg-orange/10 text-orange-dark',
  info: 'bg-cooling-blue/10 text-cooling-blue-dark',
  orange: 'bg-orange/10 text-orange',
};

export default function Badge({
  children,
  variant = 'default',
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full
        text-xs font-semibold
        ${variantClasses[variant]}
        ${className}
      `.trim()}
    >
      {children}
    </span>
  );
}
