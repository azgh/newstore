"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { useCart } from "./cart-provider";
import { StorefrontHeader } from "@/src/components/storefront-header";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price / 100);

export function CartPageClient() {
  const { clearCart, items, removeItem, updateQuantity } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const handleCheckout = async () => {
    setError(null);
    setIsCheckingOut(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: String(item.productId),
            quantity: item.quantity,
          })),
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        url?: string;
      };

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Failed to create checkout session.");
      }

      window.location.href = data.url;
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Checkout failed.",
      );
      setIsCheckingOut(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--color-cream)] px-6 py-6 text-[var(--color-ink)] md:px-10 lg:px-12">
      <section className="mx-auto max-w-7xl">
        <StorefrontHeader />

        <section className="py-6">
          <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr]">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--color-muted)]">
                Cart
              </p>
              <h1 className="mt-4 max-w-xl text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-[#1c2230] md:text-7xl">
                Everything ready for checkout.
              </h1>
              <p className="mt-4 max-w-lg text-lg leading-8 text-[#556172]">
                Review your selection, adjust quantities, and continue into
                Stripe Checkout when you are ready.
              </p>
            </div>

            <Card className="rounded-[1.4rem]">
              <CardHeader>
                <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--color-muted)]">
                  Order summary
                </p>
                <CardTitle className="text-base font-medium tracking-normal">
                  {formatPrice(subtotal)}
                </CardTitle>
                <CardDescription className="leading-7">
                  Shipping, tax, and payment method selection are handled by
                  Stripe Checkout.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error ? (
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                ) : null}

                <Button
                  type="button"
                  onClick={handleCheckout}
                  disabled={isCheckingOut || !items.length}
                  className="mt-6 w-full"
                >
                  {isCheckingOut ? "Redirecting to Stripe..." : "Checkout"}
                </Button>

                <Button
                  type="button"
                  onClick={clearCart}
                  className="mt-3 w-full"
                  variant="outline"
                >
                  Clear cart
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {!items.length ? (
          <section className="rounded-[1.6rem] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-paper)] p-8">
            <p className="text-sm uppercase tracking-[0.25em] text-[var(--color-muted)]">
              Your cart is empty
            </p>
            <p className="mt-4 max-w-xl text-base leading-8 text-[var(--color-soft-ink)]">
              Add a few active products from the shop and they will appear here.
            </p>
          </section>
        ) : (
          <section className="grid gap-4">
            {items.map((item) => (
              <article
                key={item.productId}
                className="rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-paper)] p-5 shadow-[var(--shadow-soft)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/shop/${item.slug}`}
                      className="text-2xl font-semibold tracking-[-0.03em] transition-opacity hover:opacity-75"
                    >
                      {item.title}
                    </Link>
                    <p className="mt-2 text-sm text-[var(--color-soft-ink)]">
                      {formatPrice(item.price)} each
                    </p>
                  </div>

                  <Button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    variant="outline"
                  >
                    Remove
                  </Button>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <label className="text-[11px] uppercase tracking-[0.3em] text-[var(--color-muted)]">
                    Quantity
                  </label>
                  <Input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(event) =>
                      updateQuantity(item.productId, Number(event.target.value))
                    }
                    className="w-20 bg-white/60 text-center"
                  />
                </div>
              </article>
            ))}
          </section>
        )}
      </section>
    </main>
  );
}
