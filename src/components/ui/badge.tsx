import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "default"
  | "outline"
  | "success"
  | "warning"
  | "destructive"
  | "muted";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default:
    "border-border bg-primary text-primary-foreground",
  outline:
    "border-border text-foreground",
  success:
    "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  warning:
    "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  destructive:
    "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400",
  muted:
    "border-border bg-muted text-muted-foreground",
};

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-tight transition-colors",
          variantClasses[variant],
          className,
        )}
        {...props}
      />
    );
  },
);

Badge.displayName = "Badge";

export { Badge };
