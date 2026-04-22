import type { CollectionAfterChangeHook } from "payload";

import type { Product } from "@/src/payload-types";

import { getStripe, isStripeConfigured } from "./stripe";

type SyncContext = {
  skipStripeSync?: boolean;
};

const STRIPE_SYNC_METADATA_KEY = "payloadProductId";

const getStripeProductActive = (status: Product["status"]) => status === "active";

const getCurrency = (product: Product) => product.currency || "usd";

const shouldRotatePrice = ({
  doc,
  previousDoc,
}: {
  doc: Product;
  previousDoc?: Product;
}) => {
  if (!doc.stripePriceId) {
    return true;
  }

  if (!previousDoc) {
    return false;
  }

  return doc.price !== previousDoc.price || getCurrency(doc) !== getCurrency(previousDoc);
};

export const syncProductToStripe: CollectionAfterChangeHook<Product> = async ({
  context,
  doc,
  previousDoc,
  req,
}) => {
  const syncContext = context as SyncContext;

  if (syncContext.skipStripeSync || !isStripeConfigured()) {
    return doc;
  }

  const stripe = getStripe();
  let stripeProductId = doc.stripeProductId || undefined;
  let stripePriceId = doc.stripePriceId || undefined;

  if (!stripeProductId) {
    const createdProduct = await stripe.products.create({
      active: getStripeProductActive(doc.status),
      description: doc.description || undefined,
      metadata: {
        [STRIPE_SYNC_METADATA_KEY]: String(doc.id),
        slug: doc.slug,
      },
      name: doc.title,
    });

    stripeProductId = createdProduct.id;
  } else {
    await stripe.products.update(stripeProductId, {
      active: getStripeProductActive(doc.status),
      description: doc.description || undefined,
      metadata: {
        [STRIPE_SYNC_METADATA_KEY]: String(doc.id),
        slug: doc.slug,
      },
      name: doc.title,
    });
  }

  if (shouldRotatePrice({ doc, previousDoc })) {
    if (previousDoc?.stripePriceId && previousDoc.stripePriceId !== stripePriceId) {
      await stripe.prices.update(previousDoc.stripePriceId, {
        active: false,
      });
    }

    if (stripePriceId) {
      await stripe.prices.update(stripePriceId, {
        active: false,
      });
    }

    const createdPrice = await stripe.prices.create({
      active: getStripeProductActive(doc.status),
      currency: getCurrency(doc),
      metadata: {
        [STRIPE_SYNC_METADATA_KEY]: String(doc.id),
      },
      product: stripeProductId,
      unit_amount: doc.price,
    });

    stripePriceId = createdPrice.id;
  } else if (stripePriceId && previousDoc && previousDoc.status !== doc.status) {
    await stripe.prices.update(stripePriceId, {
      active: getStripeProductActive(doc.status),
    });
  }

  const needsUpdate =
    stripeProductId !== doc.stripeProductId || stripePriceId !== doc.stripePriceId;

  if (!needsUpdate) {
    return doc;
  }

  return req.payload.update({
    id: doc.id,
    collection: "products",
    context: {
      ...syncContext,
      skipStripeSync: true,
    },
    data: {
      stripePriceId,
      stripeProductId,
    },
    depth: 0,
    overrideAccess: true,
  });
};
