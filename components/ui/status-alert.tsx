import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertTriangle, Ban, CheckCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { size } from "zod";

const alertVariants = cva(
  "relative w-full border p-4 flex flex-start gap-3 text-sm shadow-sm transition-all animate-in fade-in slide-in-from-top-2",
  {
    variants: {
      variant: {
        warning: "bg-[#FFF7DB] border-[#FFCA0F] text-[#705800] font-body",
        error: "bg-[#FEEFEF] border-[#F59393] text-[#DA1414] font-body",
        success: "bg-green-50 border-green-200 text-green-700",
        info: "bg-blue-50 border-blue-200 text-blue-700",
      },
      size: {
        default: "p-4",
        sm: "p-2",
        lg: "p-6",
      },
      height: {
        auto: "h-auto",
        sm: "h-[104px]",
        md: "h-16 flex items-center",
      },
    },
    defaultVariants: {
      variant: "warning",
    },
  }
);

interface StatusAlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string;
}

export function StatusAlert({
  className,
  variant,
  title,
  size,
  height,
  children,
  ...props
}: StatusAlertProps) {
  const Icon = {
    warning: AlertTriangle,
    error: Ban,
    success: CheckCircle,
    info: Info,
  }[variant || "warning"];

  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant, size, height }), className)}
      {...props}
    >
      <Icon className="h-5 w-5 mt-0.5 shrink-0" />
      <div className="flex-1">
        {title && (
          <h5 className="font-semibold mb-1 leading-none tracking-tight">
            {title}
          </h5>
        )}
        <div className="text-sm opacity-90">{children}</div>
      </div>
    </div>
  );
}
