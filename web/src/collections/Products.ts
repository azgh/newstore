import type { CollectionConfig } from "payload";

import { syncProductToStripe } from "@/src/lib/stripe-product-sync";

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    defaultColumns: ["title", "status", "price", "stripePriceId"],
    useAsTitle: "title",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "subtitle",
      type: "text",
    },
    {
      name: "status",
      type: "select",
      defaultValue: "draft",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Active", value: "active" },
        { label: "Archived", value: "archived" },
      ],
      required: true,
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      type: "row",
      fields: [
        {
          name: "price",
          type: "number",
          admin: {
            description: "Stored in cents so it can map directly to Stripe prices.",
          },
          min: 0,
          required: true,
        },
        {
          name: "currency",
          type: "text",
          admin: {
            description: "Stripe currency code. Keep this as usd for the first version.",
          },
          defaultValue: "usd",
          required: true,
        },
        {
          name: "compareAtPrice",
          type: "number",
          min: 0,
        },
        {
          name: "inventory",
          type: "number",
          min: 0,
          defaultValue: 0,
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "stripeProductId",
          type: "text",
          admin: {
            description:
              "Auto-managed when STRIPE_SECRET_KEY is configured. Safe to leave blank.",
            readOnly: true,
          },
        },
        {
          name: "stripePriceId",
          type: "text",
          admin: {
            description:
              "Auto-managed when STRIPE_SECRET_KEY is configured. This value is used during checkout.",
          },
        },
      ],
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
    },
    {
      name: "gallery",
      type: "array",
      minRows: 1,
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },
  ],
  hooks: {
    afterChange: [syncProductToStripe],
  },
};
