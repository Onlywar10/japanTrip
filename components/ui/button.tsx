import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 rounded-full text-[0.74rem] tracking-wide font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermillion/40 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-ink text-washi hover:bg-vermillion px-3.5 py-2",
        outline:
          "bg-washi text-ink border border-line hover:border-ink px-3.5 py-2",
        ghost: "bg-transparent hover:bg-washi-2 px-3 py-1.5",
        pill: "bg-card border border-line text-ink hover:border-ink-faint px-4 py-2.5 min-w-[7.25rem] flex-col items-start text-left rounded-[0.8rem]",
        pillActive:
          "bg-ink border border-ink text-washi px-4 py-2.5 min-w-[7.25rem] flex-col items-start text-left rounded-[0.8rem]",
      },
      size: {
        default: "",
        sm: "text-xs px-3 py-1.5",
        lg: "text-sm px-5 py-3",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { buttonVariants };
