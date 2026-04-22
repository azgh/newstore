import * as React from "react";

import { cn } from "@/src/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-full border border-[var(--color-border-strong)] bg-white/70 px-4 py-2 text-sm text-[var(--color-ink)] outline-none transition-colors placeholder:text-[var(--color-muted)] focus-visible:ring-[3px] focus-visible:ring-[var(--color-accent-soft)]",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
