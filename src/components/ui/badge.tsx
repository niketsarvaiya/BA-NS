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
    "border-zinc-700 bg-zinc-900 text-zinc-100",
  outline:
    "border-zinc-600/80 text-zinc-100",
  success:
    "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  warning:
    "border-amber-500/40 bg-amber-500/10 text-amber-300",
  destructive:
    "border-red-500/40 bg-red-500/10 text-red-300",
  muted:
    "border-zinc-700/60 bg-zinc-900/70 text-zinc-300",
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
