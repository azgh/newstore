import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export const isStripeConfigured = () => Boolean(process.env.STRIPE_SECRET_KEY);

export const getStripe = () => {
  if (!isStripeConfigured()) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }

  const secretKey = process.env.STRIPE_SECRET_KEY as string;

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey, {
      apiVersion: "2026-03-25.dahlia",
    });
  }

  return stripeClient;
};

export const getServerURL = () =>
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
