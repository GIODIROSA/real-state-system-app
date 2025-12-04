import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva("flex items-center justify-center rounded-xs", {
  variants: {
    variant: {
      default: "bg-primary font-body text-white hover:bg-brand-600",
      destructive: "bg-destructive text-destructive-foreground ",
      outlinePrimary: "border-brand-500 hover:bg-brand-900",
      outlineSecondary: "border border-accent-500 bg-transparent hover:bg-accent-900",
      secondary: "bg-secondary font-body text-white hover:bg-accent-600 disabled:bg-accent-300",
      ghost: "hover:bg-accent",
      link: "font-body underline-offset-4 hover:underline",
    },
    size: {
      default: "py-4 px-6 h-[56px]",
      sm: "h-9 rounded-xs px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface ButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
