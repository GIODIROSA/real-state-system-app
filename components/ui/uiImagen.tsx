import * as React from "react";
import NextImage, { ImageProps as NextImageProps } from "next/image";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const imageVariants = cva("transition-all duration-300", {
  variants: {
    variant: {
      default: "object-cover",
      avatar: "round-full object-cover border border-gray-200",
      card: "rounded-xl object-cover",
      login: "object-cover opacity-90",
    },
    effect: {
      none: "",
      zoom: "hover:scale-105",
      grayscale: "grayscale hover:grayscale-0",
      dim: "hover:opacity-80",
    },
    aspect: {
      none: "",
      square: "aspect-square",
      video: "aspect-video",
      portrait: "aspect-[3/4]",
    },
  },
  defaultVariants: {
    variant: "default",
    effect: "none",
    aspect: "none",
  },
});

export interface ImageProps
  extends Omit<NextImageProps, "className">,
    VariantProps<typeof imageVariants> {
  className?: string;
}

const UiImage = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ className, variant, effect, aspect, ...props }, ref) => {
    return (
      <NextImage
        ref={ref}
        className={cn(imageVariants({ variant, effect, aspect, className }))}
        {...props}
      />
    );
  }
);

UiImage.displayName = "UiImage";
export { UiImage as Image, imageVariants };
