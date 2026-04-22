import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/src/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--color-accent-soft)]",
  {
    variants: {
      size: {
        default: "h-11 px-5 py-2.5",
        icon: "size-10",
        lg: "h-12 px-6 py-3",
        sm: "h-9 px-4 py-2",
      },
      variant: {
        default:
          "bg-[#1f2127] text-white hover:opacity-85 shadow-[var(--shadow-soft)]",
        ghost: "hover:bg-black/5",
        outline:
          "border border-[var(--color-border-strong)] bg-white/60 text-[var(--color-ink)] hover:-translate-y-0.5",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  },
);

function Button({
  className,
  size,
  variant,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>) {
  return (
    <button
      className={cn(buttonVariants({ className, size, variant }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
