import type { GlobalConfig } from "payload";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  fields: [
    {
      name: "siteName",
      type: "text",
      required: true,
      defaultValue: "newstore",
    },
    {
      name: "announcement",
      type: "text",
    },
    {
      name: "supportEmail",
      type: "email",
    },
  ],
};
