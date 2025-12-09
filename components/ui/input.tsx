/**
 * @fileoverview Componente Input reutilizable con variantes
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// 1. Definimos las variantes usando CVA
const inputVariants = cva(
  // Estilos base (siempre aplicados)
  "flex w-full border transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        login: "border-[var(--color-neutral-100)] bg-white text-gray-600",
        default: "border-[var(--color-neutral-100)] bg-white text-gray-600",
        error:
          "border-red-500 bg-red-50 text-red-900 placeholder:text-red-300 focus-visible:ring-red-500",
        filled:
          "border-transparent bg-gray-100 text-gray-900 focus:bg-white focus:border-gray-300",
      },
      inputSize: {
        default: "h-12 px-2 py-3 rounded",
        sm: "h-9 px-3 rounded text-xs",
        lg: "h-14 px-4 rounded-md text-lg",
      },
      iconPadding: {
        none: "", 
        left: "pl-[38px]", 
        right: "pr-10", 
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
      iconPadding: "none",
    },
  }
);

// 2. Extendemos la interfaz para aceptar las variantes
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, variant, inputSize, iconPadding, error, ...props },
    ref
  ) => {
    // Si hay error, forzamos la variante visual de error,
    // pero permitimos que se sobrescriba si se pasa explícitamente otra cosa.
    const finalVariant = error ? "error" : variant;

    return (
      <div className="w-full space-y-1">
        <input
          type={type}
          className={cn(
            inputVariants({ variant: finalVariant, inputSize, iconPadding, className })
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500 text-right font-body">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
