import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full text-[0.71rem] tracking-wide font-medium transition-colors",
  {
    variants: {
      variant: {
        outline:
          "bg-washi border border-line text-ink-soft px-3 py-1.5",
        solid: "bg-ink text-washi px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.14em]",
        gold: "bg-[#8a6a1f] text-washi px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.14em]",
      },
    },
    defaultVariants: { variant: "outline" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };
