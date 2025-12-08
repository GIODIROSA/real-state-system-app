/**
 * @fileoverview Componente Input reutilizable
 */

import { cn } from '@/lib/utils';
import * as React from 'react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            'h-12 pl-10 border-gray-200 bg-white focus:bg-blue-500 focus:ring-blue-500 transition-all rounded-lg placeholder:text-gray-400 text-gray-600',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
