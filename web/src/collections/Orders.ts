import type { CollectionConfig } from "payload";

export const Orders: CollectionConfig = {
  slug: "orders",
  admin: {
    useAsTitle: "stripeCheckoutSessionId",
  },
  fields: [
    {
      name: "stripeCheckoutSessionId",
      type: "text",
      index: true,
      required: true,
      unique: true,
    },
    {
      name: "stripePaymentIntentId",
      type: "text",
    },
    {
      name: "customerEmail",
      type: "email",
    },
    {
      name: "status",
      type: "select",
      defaultValue: "pending",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Paid", value: "paid" },
        { label: "Fulfilled", value: "fulfilled" },
        { label: "Refunded", value: "refunded" },
        { label: "Canceled", value: "canceled" },
      ],
      required: true,
    },
    {
      name: "items",
      type: "array",
      fields: [
        {
          name: "product",
          type: "relationship",
          relationTo: "products",
          required: true,
        },
        {
          name: "quantity",
          type: "number",
          required: true,
          min: 1,
        },
        {
          name: "unitPrice",
          type: "number",
          required: true,
          min: 0,
        },
      ],
    },
    {
      name: "amountSubtotal",
      type: "number",
      min: 0,
    },
    {
      name: "amountTotal",
      type: "number",
      min: 0,
    },
  ],
};
