import path from "node:path";
import { fileURLToPath } from "node:url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Categories } from "./src/collections/Categories.ts";
import { Media } from "./src/collections/Media.ts";
import { Orders } from "./src/collections/Orders.ts";
import { Pages } from "./src/collections/Pages.ts";
import { Products } from "./src/collections/Products.ts";
import { Users } from "./src/collections/Users.ts";
import { SiteSettings } from "./src/globals/SiteSettings.ts";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
  },
  collections: [Users, Media, Categories, Products, Orders, Pages],
  cors: [process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000"],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
  }),
  globals: [SiteSettings],
  secret: process.env.PAYLOAD_SECRET || "change-me",
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, "src/payload-types.ts"),
  },
});
