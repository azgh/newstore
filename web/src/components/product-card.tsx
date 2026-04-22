import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  category?: string | null;
  href: string;
  imageAlt?: string | null;
  imageUrl?: string | null;
  price: number;
  title: string;
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price / 100);

export function ProductCard({
  category,
  href,
  imageAlt,
  imageUrl,
  price,
  title,
}: ProductCardProps) {
  return (
    <Link
      href={href}
      className="group overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-paper)] p-3 shadow-[var(--shadow-soft)] transition-transform duration-300 hover:-translate-y-1.5"
    >
      <div className="relative h-80 overflow-hidden rounded-[1.55rem] bg-[linear-gradient(160deg,#dbc6b4,#f7efe3_55%,#d7d5d1)]">
        {imageUrl ? (
          <Image
            alt={imageAlt || title}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            src={imageUrl}
            unoptimized
          />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(18,15,12,0.08))]" />
        <div className="absolute inset-x-6 top-6 flex items-start justify-between text-[11px] uppercase tracking-[0.32em] text-[var(--color-soft-ink)]">
          <span>{category || "Featured"}</span>
          <span>Edition</span>
        </div>
        <div className="absolute inset-x-8 bottom-8 rounded-[1.3rem] border border-white/50 bg-white/35 px-5 py-4 backdrop-blur-sm">
          <p className="font-display text-3xl leading-none text-[var(--color-ink)]">
            {title}
          </p>
        </div>
      </div>
      <p className="mt-5 text-[11px] uppercase tracking-[0.32em] text-[var(--color-muted)]">
        {category || "Featured"}
      </p>
      <div className="mt-2 flex items-end justify-between gap-4">
        <h3 className="font-display text-[2rem] leading-none transition-opacity group-hover:opacity-80">
          {title}
        </h3>
        <span className="rounded-full border border-[var(--color-border)] bg-white/55 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--color-soft-ink)]">
          {formatPrice(price)}
        </span>
      </div>
    </Link>
  );
}
