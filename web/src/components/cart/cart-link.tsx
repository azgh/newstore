"use client";

import Link from "next/link";

import { useCart } from "./cart-provider";
import { buttonVariants } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";

export function CartLink() {
  const { cartCount } = useCart();

  return (
    <Link
      href="/cart"
      className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        "gap-3 bg-white/60 px-4",
      )}
    >
      <span>Cart</span>
      <span className="rounded-full bg-[var(--color-ink)] px-2 py-0.5 text-xs text-[var(--color-cream)]">
        {cartCount}
      </span>
    </Link>
  );
}
