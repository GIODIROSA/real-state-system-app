import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva("flex items-center justify-center rounded-xs", {
  variants: {
    variant: {
      primary: "bg-accent-500 font-body text-white hover:bg-accent-600", // orange
      secondary: "bg-brand-500 font-body text-white hover:bg-brand-100 disabled:bg-brand-100 disabled:text-white disabled:cursor-not-allowed", // blue
      destructive: "bg-destructive text-destructive-foreground ",
      outlinePrimary: "border border-accent-500 bg-transparent hover:bg-accent-900",
      outlineSecondary: "border text-brand-500 whitespace-nowrap text-base font-bold  ma border-brand-500 font-body hover:bg-blue-100",
      ghost: "hover:bg-accent",
      link: "font-body underline-offset-4 hover:underline",
    },
    size: {
      general: "px-6 py-4",
      sm: "h-9 rounded-xs px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    },
    height:{
      sm: "h-[56px]",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "general",
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
