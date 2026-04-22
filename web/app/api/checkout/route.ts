import { NextResponse } from "next/server";

import config from "@payload-config";
import { getPayload } from "payload";

import { getServerURL, getStripe } from "@/src/lib/stripe";

type CheckoutItemInput = {
  productId: string;
  quantity: number;
};

const isValidItem = (value: unknown): value is CheckoutItemInput => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Partial<CheckoutItemInput>;

  return (
    typeof item.productId === "string" &&
    typeof item.quantity === "number" &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0
  );
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { items?: unknown[] };
    const items = body.items?.filter(isValidItem) ?? [];

    if (!items.length) {
      return NextResponse.json(
        { error: "At least one checkout item is required." },
        { status: 400 },
      );
    }

    const payload = await getPayload({ config });
    const stripe = getStripe();

    const orderItems: {
      product: number;
      quantity: number;
      unitPrice: number;
    }[] = [];

    const lineItems: { price: string; quantity: number }[] = [];

    for (const item of items) {
      const product = await payload.findByID({
        id: item.productId,
        collection: "products",
        depth: 0,
      });

      if (!product?.stripePriceId) {
        return NextResponse.json(
          { error: `Product ${item.productId} is missing a Stripe price.` },
          { status: 400 },
        );
      }

      if (product.status !== "active") {
        return NextResponse.json(
          { error: `Product ${product.title} is not available for checkout.` },
          { status: 400 },
        );
      }

      lineItems.push({
        price: product.stripePriceId,
        quantity: item.quantity,
      });

      orderItems.push({
        product: Number(product.id),
        quantity: item.quantity,
        unitPrice: product.price,
      });
    }

    const amountSubtotal = orderItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${getServerURL()}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getServerURL()}/cart`,
      metadata: {
        source: "atelier-store",
      },
    });

    await payload.create({
      collection: "orders",
      data: {
        stripeCheckoutSessionId: session.id,
        status: "pending",
        items: orderItems,
        amountSubtotal,
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create checkout session.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
