/**
 * @fileoverview Componente Alert para mensajes
 */

import { cn } from '@/lib/utils';
import * as React from 'react';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'error' | 'warning';
}

const variantClasses = {
  default: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100',
  success:
    'bg-green-100 text-green-900 dark:bg-green-900/20 dark:text-green-100',
  error: 'bg-red-100 text-red-900 dark:bg-red-900/20 dark:text-red-100',
  warning:
    'bg-yellow-100 text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-100',
};

export function Alert({
  variant = 'default',
  className,
  children,
  ...props
}: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-lg border p-4',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
