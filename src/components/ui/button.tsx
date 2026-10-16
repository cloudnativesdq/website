"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/* Matches components/core/Button.jsx in the design system: heading font,
   uppercase, tracked out, ease-out-quart. The default variant additionally
   carries the brand's signature hover-lift + glow-md -> glow-lg treatment;
   `link` is the one variant that stays sentence case. */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-heading text-sm font-bold uppercase tracking-[0.02em] ring-offset-background transition-all duration-slow ease-out-quart focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground glow-md hover:-translate-y-0.5 hover:glow-lg",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-transparent hover:border-primary/50 hover:text-primary",
        secondary: "glass text-foreground hover:border-primary/50",
        ghost: "hover:bg-accent/10 hover:text-primary",
        link: "text-primary underline underline-offset-4 normal-case tracking-normal",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-3.5 text-[13px]",
        lg: "h-12 px-8 text-[15px]",
        icon: "h-10 w-10 px-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
