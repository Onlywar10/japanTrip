import * as React from "react";
import { cn } from "@/lib/utils";

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-3xl border border-line bg-card shadow-washi",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

export const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-wrap items-start justify-between gap-4", className)} {...props} />
);

export const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("", className)} {...props} />
);
