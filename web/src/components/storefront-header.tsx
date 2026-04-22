import Link from "next/link";
import { Search } from "lucide-react";

import { CartLink } from "@/src/components/cart/cart-link";
import { Input } from "@/src/components/ui/input";

type StorefrontHeaderProps = {
  searchPlaceholder?: string;
};

export function StorefrontHeader({
  searchPlaceholder = "Search for products...",
}: StorefrontHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
      <Link href="/" className="text-[2rem] font-semibold tracking-tight">
        newstore
      </Link>

      <nav className="hidden items-center gap-8 text-sm md:flex">
        <Link href="/shop" className="transition-opacity hover:opacity-70">
          Accessories
        </Link>
        <Link href="/shop" className="transition-opacity hover:opacity-70">
          Apparel
        </Link>
        <Link href="/shop" className="transition-opacity hover:opacity-70">
          Shoes
        </Link>
      </nav>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Input
            className="w-64 pr-10"
            placeholder={searchPlaceholder}
            readOnly
          />
          <Search className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[var(--color-soft-ink)]" />
        </div>
        <CartLink />
      </div>
    </header>
  );
}
