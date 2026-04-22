import type { Media, Product } from "@/src/payload-types";

const demoHeroImage =
  "https://fpvnqhp6jqce9ax6.public.blob.vercel-storage.com/hero-media/%40todo/live/OpenAI%20Playground%202026-01-14%20at%2013.17.42%20%283%29-0GE8PlePAPQO4dSyzJPJtq26Ih8YGB.png";

const demoProductImages: Record<string, string> = {
  "Aqua Stride Bottle":
    "https://fpvnqhp6jqce9ax6.public.blob.vercel-storage.com/images/0196b1e1-bdf7-72bb-b729-1135a2543d54/test/Default_product_image_of_a_bottle_for_ecommerce_website_minim_2-GOjCmiuwEPPLwzFxtjnHCNSJ7Zy5Ut.jpg",
  "Horizon Gaze Sunglasses":
    "https://yns.store/_next/image?q=75&url=https%3A%2F%2Ffpvnqhp6jqce9ax6.public.blob.vercel-storage.com%2Fimages%2F0196b1e1-bdf7-72bb-b729-1135a2543d54%2Ftest%2F68747470733a2f2f66696c65732e7374726970652e636f6d2f6c696e6b732f4d44423859574e6a644638785433426165473547536d4e57625668366255527366475a735833526c63335266546a597a636b645a61474a7a5a6c566c57466c6f62324578656d5177515568333030374f594653664848-eMKW-XSgVxDNQ4GApJh0MEx6tKOlhU5e79B.avif&w=3840",
  "Shadow Stride Shoes":
    "https://yns.store/_next/image?q=75&url=https%3A%2F%2Ffpvnqhp6jqce9ax6.public.blob.vercel-storage.com%2Fimages%2F0196b1e1-bdf7-72bb-b729-1135a2543d54%2Ftest%2FMDB8YWNjdF8xT3BaeG5GSmNWbVh6bURsfGZsX3Rlc3RfUnYydHRDRUNnb2dxSVhiOEtueEw4NGhk00gGycRyUx-oA5kIVgdS3KV66mv5BGQ9QcWFneSw2.avif&w=3840",
  "Sunbeam Tote":
    "https://yns.store/_next/image?q=75&url=https%3A%2F%2Ffpvnqhp6jqce9ax6.public.blob.vercel-storage.com%2Fimages%2F0196b1e1-bdf7-72bb-b729-1135a2543d54%2Ftest%2FMDB8YWNjdF8xT3BaeG5GSmNWbVh6bURsfGZsX3Rlc3RfVkxjN29KOEF1TG9NR0hLQlZwblRDWlJM00MJ1j137t-bnJi98uwa5mJ73gdBQ6jxyMZrERJks.avif&w=3840",
};

const isMedia = (value: unknown): value is Media =>
  typeof value === "object" && value !== null && "url" in value;

export const getMediaUrl = (media?: Media | null) => {
  if (!media?.url) {
    return null;
  }

  return media.url;
};

export const getMediaAlt = (media?: Media | null, fallback = "Product image") =>
  media?.alt || fallback;

export const getProductGallery = (product: Product) =>
  (product.gallery || [])
    .map((item) => (isMedia(item.image) ? item.image : null))
    .filter((item): item is Media => Boolean(item));

export const getProductPrimaryImage = (product: Product) =>
  getProductGallery(product)[0] || null;

export const getProductFallbackImage = (product: Pick<Product, "title">) =>
  demoProductImages[product.title] || null;

export const getProductImageUrl = (product: Product) =>
  getMediaUrl(getProductPrimaryImage(product)) || getProductFallbackImage(product);

export const getHeroFallbackImage = () => demoHeroImage;
