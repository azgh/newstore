import Link from "next/link";

type SuccessPageProps = {
  searchParams: Promise<{
    session_id?: string;
  }>;
};

export default async function CheckoutSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const { session_id: sessionId } = await searchParams;

  return (
    <main className="min-h-screen bg-[var(--color-cream)] px-6 py-12 text-[var(--color-ink)] md:px-10">
      <section className="mx-auto max-w-3xl rounded-[2rem] border border-[var(--color-border)] bg-white/70 p-8 backdrop-blur md:p-12">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-muted)]">
          Payment received
        </p>
        <h1 className="mt-6 text-4xl font-semibold tracking-[-0.04em] md:text-5xl">
          Thank you for your order.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-8 text-[var(--color-soft-ink)]">
          Stripe Checkout completed successfully. Your order record can now be
          matched in Payload by the checkout session ID below.
        </p>

        <div className="mt-8 rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-cream)] p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-muted)]">
            Checkout session
          </p>
          <p className="mt-3 break-all font-mono text-sm">
            {sessionId || "Missing session ID"}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm text-[var(--color-cream)] transition-opacity hover:opacity-85"
          >
            Back to storefront
          </Link>
          <Link
            href="/admin/collections/orders"
            className="inline-flex rounded-full border border-[var(--color-border-strong)] px-5 py-3 text-sm transition-transform hover:-translate-y-0.5"
          >
            View orders in admin
          </Link>
        </div>
      </section>
    </main>
  );
}
