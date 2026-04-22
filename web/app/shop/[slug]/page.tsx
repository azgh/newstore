import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AddToCartButton } from "@/src/components/cart/add-to-cart-button";
import { StorefrontHeader } from "@/src/components/storefront-header";
import { buttonVariants } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  getMediaAlt,
  getProductFallbackImage,
  getProductGallery,
  getProductPrimaryImage,
} from "@/src/lib/media";
import { getPayloadClient } from "@/src/lib/payload";
import { cn } from "@/src/lib/utils";

type ProductDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price / 100);

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const payload = await getPayloadClient();

  const products = await payload.find({
    collection: "products",
    depth: 1,
    limit: 1,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        {
          status: {
            equals: "active",
          },
        },
      ],
    },
  });

  const product = products.docs[0];

  if (!product) {
    notFound();
  }

  const gallery = getProductGallery(product);
  const primaryImage = getProductPrimaryImage(product);
  const primaryImageUrl =
    (primaryImage && primaryImage.url) || getProductFallbackImage(product);

  return (
    <main className="min-h-screen bg-[var(--color-cream)] px-6 py-8 text-[var(--color-ink)] md:px-10 lg:px-12">
      <section className="mx-auto max-w-7xl">
        <StorefrontHeader />

        <div className="mt-6 flex items-center justify-between gap-4">
          <Link
            href="/shop"
            className="text-[11px] uppercase tracking-[0.35em] text-[var(--color-muted)]"
          >
            Back to shop
          </Link>
          <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--color-muted)]">
            Product detail
          </p>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="grid gap-4">
            <div className="relative overflow-hidden rounded-[2.25rem] border border-[var(--color-border)] bg-[var(--color-paper)] p-4 shadow-[var(--shadow-soft)]">
              <div className="relative h-[35rem] overflow-hidden rounded-[1.7rem] bg-[linear-gradient(160deg,#e3d3c5,#f8f1e6_58%,#d2ccc3)]">
                {primaryImageUrl ? (
                  <Image
                    alt={getMediaAlt(primaryImage, product.title)}
                    className="object-cover"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 52vw"
                    src={primaryImageUrl}
                    unoptimized
                  />
                ) : null}
                <div className="absolute inset-x-6 top-6 flex items-start justify-between text-[11px] uppercase tracking-[0.3em] text-white/80 mix-blend-multiply">
                  <span>Product portrait</span>
                  <span>{product.slug}</span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {gallery.slice(1, 3).map((media) => (
                <div
                  key={media.id}
                  className="relative h-44 overflow-hidden rounded-[1.7rem] border border-[var(--color-border)] bg-[var(--color-paper)]"
                >
                  <Image
                    alt={getMediaAlt(media, product.title)}
                    className="object-cover"
                    fill
                    sizes="(max-width: 640px) 100vw, 25vw"
                    src={media.url || ""}
                    unoptimized
                  />
                </div>
              ))}
              {gallery.length < 3 ? (
                <>
                  {Array.from({ length: Math.max(0, 2 - Math.max(0, gallery.length - 1)) }).map(
                    (_, index) => (
                      <div
                        key={`placeholder-${index}`}
                        className="h-44 rounded-[1.7rem] border border-[var(--color-border)] bg-[linear-gradient(160deg,#e6d9ce,#cec7bf)]"
                      />
                    ),
                  )}
                </>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-[2.25rem] border border-[var(--color-border)] bg-[var(--color-paper)] p-8 shadow-[var(--shadow-soft)]">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--color-muted)]">
                {typeof product.category === "object"
                  ? product.category?.title
                  : "Product"}
              </p>
              <h1 className="mt-4 text-5xl font-semibold leading-[0.92] tracking-[-0.05em] md:text-7xl">
                {product.title}
              </h1>
              {product.subtitle ? (
                <p className="mt-5 max-w-xl text-lg leading-8 text-[var(--color-soft-ink)]">
                  {product.subtitle}
                </p>
              ) : null}

              <p className="mt-8 inline-flex rounded-full border border-[var(--color-border)] bg-white/55 px-4 py-2 text-sm uppercase tracking-[0.25em] text-[var(--color-soft-ink)]">
                {formatPrice(product.price)}
              </p>

              {product.description ? (
                <p className="mt-8 max-w-xl whitespace-pre-wrap text-base leading-9 text-[var(--color-soft-ink)]">
                  {product.description}
                </p>
              ) : (
                <p className="mt-8 max-w-xl text-base leading-9 text-[var(--color-soft-ink)]">
                  Add a product description in Payload Admin to make this page
                  feel more editorial.
                </p>
              )}
            </div>

            <Card className="mt-10 rounded-[1.8rem] bg-[var(--color-paper-strong)]">
              <CardContent className="p-6">
                <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--color-muted)]">
                  Purchase actions
                </p>
                <p className="mt-3 text-sm leading-8 text-[var(--color-soft-ink)]">
                  Add this product to your cart, then continue into Stripe
                  Checkout from the cart page.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <AddToCartButton
                    price={product.price}
                    productId={product.id}
                    slug={product.slug}
                    title={product.title}
                  />
                  <Link
                    href="/admin/collections/products"
                    className={cn(buttonVariants({ variant: "outline" }))}
                  >
                    Edit in Payload
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
