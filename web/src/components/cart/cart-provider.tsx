"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type CartItem = {
  price: number;
  productId: number;
  quantity: number;
  slug: string;
  title: string;
};

type CartContextValue = {
  addItem: (item: Omit<CartItem, "quantity">) => void;
  cartCount: number;
  clearCart: () => void;
  items: CartItem[];
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
};

const STORAGE_KEY = "atelier-store-cart";

const defaultCartContext: CartContextValue = {
  addItem: () => undefined,
  cartCount: 0,
  clearCart: () => undefined,
  items: [],
  removeItem: () => undefined,
  updateQuantity: () => undefined,
};

const CartContext = createContext<CartContextValue>(defaultCartContext);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw) as CartItem[];
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    return {
      addItem: (item) => {
        setItems((currentItems) => {
          const existing = currentItems.find(
            (currentItem) => currentItem.productId === item.productId,
          );

          if (!existing) {
            return [...currentItems, { ...item, quantity: 1 }];
          }

          return currentItems.map((currentItem) =>
            currentItem.productId === item.productId
              ? { ...currentItem, quantity: currentItem.quantity + 1 }
              : currentItem,
          );
        });
      },
      cartCount: items.reduce((sum, item) => sum + item.quantity, 0),
      clearCart: () => setItems([]),
      items,
      removeItem: (productId) =>
        setItems((currentItems) =>
          currentItems.filter((item) => item.productId !== productId),
        ),
      updateQuantity: (productId, quantity) =>
        setItems((currentItems) =>
          currentItems
            .map((item) =>
              item.productId === productId
                ? { ...item, quantity: Math.max(1, quantity) }
                : item,
            )
            .filter((item) => item.quantity > 0),
        ),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  return useContext(CartContext);
};

export type { CartItem };
