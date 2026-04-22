import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/src/components/ui/button";
import { ProductCard } from "@/src/components/product-card";
import { StorefrontHeader } from "@/src/components/storefront-header";
import {
  getHeroFallbackImage,
  getMediaAlt,
  getProductImageUrl,
  getProductPrimaryImage,
} from "@/src/lib/media";
import { getPayloadClient } from "@/src/lib/payload";
import { cn } from "@/src/lib/utils";

export default async function Home() {
  const payload = await getPayloadClient();

  const featuredProductsResult = await payload.find({
    collection: "products",
    depth: 1,
    limit: 4,
    sort: "-createdAt",
    where: {
      and: [
        {
          status: {
            equals: "active",
          },
        },
        {
          featured: {
            equals: true,
          },
        },
      ],
    },
  });

  const fallbackProductsResult =
    featuredProductsResult.docs.length < 4
      ? await payload.find({
          collection: "products",
          depth: 1,
          limit: 4,
          sort: "-createdAt",
          where: {
            status: {
              equals: "active",
            },
          },
        })
      : null;

  const products =
    featuredProductsResult.docs.length > 0
      ? featuredProductsResult.docs
      : fallbackProductsResult?.docs || [];

  const heroProduct = products[0] || null;
  const gridProducts = products.slice(0, 3);
  const heroImage = heroProduct ? getProductPrimaryImage(heroProduct) : null;
  const heroImageUrl = heroProduct ? getProductImageUrl(heroProduct) : getHeroFallbackImage();

  return (
    <main className="min-h-screen bg-[var(--color-cream)] text-[var(--color-ink)]">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 md:px-10 lg:px-12">
        <StorefrontHeader />

        <section className="py-6">
          <div className="relative overflow-hidden rounded-[1.4rem] border border-[var(--color-border)] bg-[var(--color-paper)] shadow-[var(--shadow-soft)]">
            <div className="grid min-h-[29rem] gap-0 lg:grid-cols-[0.92fr_1.08fr]">
              <div className="relative z-10 flex flex-col justify-center px-10 py-10 md:px-12">
                <h1 className="max-w-xl text-5xl font-semibold leading-[0.93] tracking-[-0.05em] text-[#1b2231] md:text-7xl">
                  Launch your store in minutes.
                </h1>
                <p className="mt-4 max-w-lg text-lg leading-8 text-[#556172]">
                  Stripe-native. Payload-powered. Built for a cleaner product
                  presentation and a more premium browse.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href={heroProduct ? `/shop/${heroProduct.slug}` : "/shop"}
                    className={cn(buttonVariants(), "rounded-full")}
                  >
                    Try it today
                  </Link>
                </div>
              </div>

              <div className="relative min-h-[21rem] bg-[linear-gradient(180deg,#f6f2ec,#fbf7f2)]">
                {heroImageUrl ? (
                  <Image
                    alt={getMediaAlt(heroImage, heroProduct?.title || "Hero product")}
                    className="object-cover"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 54vw"
                    src={heroImageUrl}
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,#ebe0d1,#f8f4ef_60%,#d6d3ce)]" />
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-[var(--color-border)] py-6">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--color-muted)]">
                New arrivals
              </p>
              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] md:text-5xl">
                Carefully arranged, immediately shoppable.
              </h2>
            </div>
            <Link
              href="/shop"
              className="inline-flex h-11 items-center rounded-full border border-[var(--color-border-strong)] bg-white/60 px-4 py-2 text-sm transition-transform hover:-translate-y-0.5"
            >
              Sort products
            </Link>
          </div>

          {gridProducts.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {gridProducts.map((product) => (
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
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-paper)] p-8">
              <p className="text-sm uppercase tracking-[0.25em] text-[var(--color-muted)]">
                No featured products yet
              </p>
              <p className="mt-4 max-w-xl text-base leading-8 text-[var(--color-soft-ink)]">
                Upload product images in Payload, mark them as featured, and the
                storefront will become much closer to the reference feel.
              </p>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
