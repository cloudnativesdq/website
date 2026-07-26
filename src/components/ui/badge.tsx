"use client";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/* Matches components/core/Badge.jsx in the design system: always uppercase,
   heading font, tracking-wide. `accentSoft` is the most-used variant on event
   cards; `warning` carries the spots-remaining state. */
const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-heading text-micro font-bold uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "glass text-foreground",
        destructive: "border-destructive/30 bg-destructive/15 text-destructive",
        warning: "border-warning/30 bg-warning/15 text-warning",
        accentSoft: "border-primary/35 bg-primary/[0.12] text-primary",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
