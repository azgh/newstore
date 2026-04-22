import { NextResponse } from "next/server";

import config from "@payload-config";
import { getPayload } from "payload";

import { getStripe } from "@/src/lib/stripe";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing Stripe webhook configuration." },
      { status: 400 },
    );
  }

  try {
    const stripe = getStripe();
    const payload = await getPayload({ config });
    const body = await request.text();

    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const existingOrder = await payload.find({
        collection: "orders",
        limit: 1,
        where: {
          stripeCheckoutSessionId: {
            equals: session.id,
          },
        },
      });

      const order = existingOrder.docs[0];

      if (order) {
        await payload.update({
          id: order.id,
          collection: "orders",
          data: {
            amountSubtotal: session.amount_subtotal ?? order.amountSubtotal,
            amountTotal: session.amount_total ?? order.amountTotal,
            customerEmail: session.customer_details?.email || order.customerEmail,
            status: "paid",
            stripePaymentIntentId:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : order.stripePaymentIntentId,
          },
        });
      }
    }

    if (
      event.type === "checkout.session.expired" ||
      event.type === "checkout.session.async_payment_failed"
    ) {
      const session = event.data.object;

      const existingOrder = await payload.find({
        collection: "orders",
        limit: 1,
        where: {
          stripeCheckoutSessionId: {
            equals: session.id,
          },
        },
      });

      const order = existingOrder.docs[0];

      if (order) {
        await payload.update({
          id: order.id,
          collection: "orders",
          data: {
            status: "canceled",
          },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Stripe webhook handling failed.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
