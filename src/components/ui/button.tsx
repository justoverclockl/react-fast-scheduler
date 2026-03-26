import { cn } from "@lib/cn";
import * as React from "react";

type ButtonVariant = "default" | "outline" | "ghost";
type ButtonSize = "default" | "sm" | "icon";

const variantClasses: Record<ButtonVariant, string> = {
  default: "rfs:bg-primary rfs:text-primary-foreground rfs:hover:bg-primary/90",
  outline: "rfs:border rfs:border-border rfs:bg-card rfs:text-foreground rfs:hover:bg-muted",
  ghost: "rfs:text-foreground rfs:hover:bg-muted",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "rfs:h-9 rfs:px-4 rfs:py-2",
  sm: "rfs:h-8 rfs:px-3 rfs:text-xs",
  icon: "rfs:h-8 rfs:w-8",
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "default", size = "default", type = "button", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "rfs:inline-flex rfs:items-center rfs:justify-center rfs:gap-2 rfs:rounded-md rfs:text-sm rfs:font-medium rfs:whitespace-nowrap rfs:transition-colors rfs:focus-visible:outline-none rfs:focus-visible:ring-2 rfs:focus-visible:ring-ring rfs:focus-visible:ring-offset-2 rfs:disabled:pointer-events-none rfs:disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
});
