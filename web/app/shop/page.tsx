import Link from "next/link";

import { ProductCard } from "@/src/components/product-card";
import { StorefrontHeader } from "@/src/components/storefront-header";
import { buttonVariants } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { getMediaAlt, getProductImageUrl, getProductPrimaryImage } from "@/src/lib/media";
import { getPayloadClient } from "@/src/lib/payload";
import { cn } from "@/src/lib/utils";

export const metadata = {
  title: "Shop | newstore",
};

export default async function ShopPage() {
  const payload = await getPayloadClient();

  const products = await payload.find({
    collection: "products",
    depth: 1,
    limit: 24,
    sort: "-createdAt",
    where: {
      status: {
        equals: "active",
      },
    },
  });

  return (
    <main className="min-h-screen bg-[var(--color-cream)] px-6 py-8 text-[var(--color-ink)] md:px-10 lg:px-12">
      <section className="mx-auto max-w-7xl">
        <StorefrontHeader />

        <header className="mt-6 grid gap-6 border-b border-[var(--color-border)] pb-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="text-[11px] uppercase tracking-[0.38em] text-[var(--color-muted)]">
              newstore
            </p>
            <h1 className="font-display mt-4 text-6xl leading-[0.9] tracking-[-0.05em] md:text-8xl">
              A softer grid,
              <br />
              a slower browse.
            </h1>
          </div>

          <Card className="rounded-[2rem]">
            <CardContent className="space-y-5 p-6">
              <p className="text-sm leading-8 text-[var(--color-soft-ink)]">
                Products should feel selected, not merely listed. This page leans
                into larger image planes, generous whitespace, and quiet product
                metadata.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Input
                  className="max-w-xs bg-white/60"
                  placeholder="Sort products"
                  readOnly
                />
                <Link
                  href="/admin/collections/products"
                  className={cn(buttonVariants({ variant: "outline" }))}
                >
                  Manage products
                </Link>
              </div>
            </CardContent>
          </Card>
        </header>

        {products.docs.length ? (
          <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {products.docs.map((product) => (
              <ProductCard
                key={product.id}
                category={
                  typeof product.category === "object"
                    ? product.category?.title
                    : null
                }
                href={`/shop/${product.slug}`}
                imageAlt={getMediaAlt(getProductPrimaryImage(product), product.title)}
                imageUrl={getProductImageUrl(product)}
                price={product.price}
                title={product.title}
              />
            ))}
          </section>
        ) : (
          <section className="mt-8 rounded-[2rem] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-paper)] p-8">
            <p className="text-sm uppercase tracking-[0.25em] text-[var(--color-muted)]">
              No active products yet
            </p>
            <p className="mt-4 max-w-xl text-base leading-8 text-[var(--color-soft-ink)]">
              Create a few products in Payload Admin, mark them as active, and
              this page will populate automatically.
            </p>
          </section>
        )}
      </section>
    </main>
  );
}
