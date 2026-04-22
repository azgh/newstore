"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useCart } from "./cart-provider";
import { Button } from "@/src/components/ui/button";

type AddToCartButtonProps = {
  price: number;
  productId: number;
  slug: string;
  title: string;
};

export function AddToCartButton({
  price,
  productId,
  slug,
  title,
}: AddToCartButtonProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        type="button"
        onClick={() => {
          addItem({ price, productId, slug, title });
          setAdded(true);
          window.setTimeout(() => setAdded(false), 1800);
        }}
      >
        {added ? "Added to cart" : "Add to cart"}
      </Button>

      <Button
        type="button"
        onClick={() => {
          addItem({ price, productId, slug, title });
          router.push("/cart");
        }}
        variant="outline"
      >
        Buy with Stripe
      </Button>
    </div>
  );
}
