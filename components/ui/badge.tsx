import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-border/60 bg-secondary/60 text-secondary-foreground hover:bg-secondary/80",
        outline:
          "border-border/60 bg-transparent text-muted-foreground hover:text-foreground",
        primary:
          "border-primary/30 bg-primary/10 text-primary hover:bg-primary/15",
        success:
          "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
        warning:
          "border-amber-400/30 bg-amber-400/10 text-amber-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
