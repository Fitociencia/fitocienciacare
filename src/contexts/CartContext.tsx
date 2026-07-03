import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react";
import { trpc } from "@/providers/trpc";

interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productSlug: string;
  quantity: number;
  priceAtTime: string;
  productPrice: string;
}

interface CartContextType {
  items: CartItem[];
  total: number;
  itemCount: number;
  sessionId: string | null;
  isLoading: boolean;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  refreshCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

const LOCAL_CART_KEY = "fitociencia_local_cart";

const fallbackProducts: Record<number, { name: string; slug: string; price: string }> = {
  1: { name: "Te Neurovegetativo", slug: "te-neurovegetativo", price: "185.00" },
  2: { name: "Infusion Somnium", slug: "infusion-somnium", price: "195.00" },
  3: { name: "Sachets Sensoris", slug: "sachets-sensoris", price: "125.00" },
  4: { name: "Almohadillas Termicas", slug: "almohadillas-termicas", price: "285.00" },
  5: { name: "Aceite NeuroMuscular", slug: "aceite-neuromuscular", price: "220.00" },
  6: { name: "Kit NeuroIntegrativo Fitociencia Care", slug: "kit-neurointegrativo", price: "1450.00" },
  7: { name: "Infusion Digestum", slug: "infusion-digestum", price: "175.00" },
  8: { name: "Aceite de Ricino", slug: "aceite-ricino", price: "145.00" },
};

function readLocalCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(LOCAL_CART_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function calculateTotal(items: CartItem[]) {
  return Number(
    items
      .reduce((sum, item) => {
        const price = Number(item.priceAtTime || item.productPrice || 0);
        return sum + price * item.quantity;
      }, 0)
      .toFixed(2),
  );
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [sessionId, setSessionId] = useState<string | null>(() => {
    return localStorage.getItem("cart_session_id");
  });
  const [localItems, setLocalItems] = useState<CartItem[]>(readLocalCart);

  const utils = trpc.useUtils();
  const { data: cartData, isLoading } = trpc.cart.get.useQuery(
    sessionId ? { sessionId } : undefined,
    { enabled: true, retry: false }
  );

  const addItemMutation = trpc.cart.addItem.useMutation({
    onSuccess: (data) => {
      if (data.sessionId && !sessionId) {
        localStorage.setItem("cart_session_id", data.sessionId);
        setSessionId(data.sessionId);
      }
      utils.cart.get.invalidate();
    },
  });

  const removeItemMutation = trpc.cart.removeItem.useMutation({
    onSuccess: () => utils.cart.get.invalidate(),
  });

  const updateQuantityMutation = trpc.cart.updateQuantity.useMutation({
    onSuccess: () => utils.cart.get.invalidate(),
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(localItems));
  }, [localItems]);

  const addLocalItem = useCallback((productId: number, quantity = 1) => {
    const product = fallbackProducts[productId];
    if (!product || quantity < 1) return;

    setLocalItems((current) => {
      const existing = current.find((item) => item.productId === productId);
      if (existing) {
        return current.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item,
        );
      }

      return [
        ...current,
        {
          id: productId,
          productId,
          productName: product.name,
          productSlug: product.slug,
          quantity,
          priceAtTime: product.price,
          productPrice: product.price,
        },
      ];
    });
  }, []);

  const remoteItems = (cartData?.items as CartItem[] | undefined) || [];
  const items = useMemo(() => (remoteItems.length > 0 ? remoteItems : localItems), [remoteItems, localItems]);
  const total = cartData?.total && remoteItems.length > 0 ? cartData.total : calculateTotal(items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const addItem = useCallback(
    async (productId: number, quantity = 1) => {
      addLocalItem(productId, quantity);
      try {
        await addItemMutation.mutateAsync({ productId, quantity, sessionId: sessionId || undefined });
      } catch {
        // The local cart keeps the preview usable when the database is not connected.
      }
    },
    [addItemMutation, addLocalItem, sessionId]
  );

  const removeItem = useCallback(
    async (itemId: number) => {
      setLocalItems((current) => current.filter((item) => item.id !== itemId));
      try {
        await removeItemMutation.mutateAsync({ itemId });
      } catch {
        // Local state has already been updated.
      }
    },
    [removeItemMutation]
  );

  const updateQuantity = useCallback(
    async (itemId: number, quantity: number) => {
      setLocalItems((current) =>
        quantity <= 0
          ? current.filter((item) => item.id !== itemId)
          : current.map((item) => (item.id === itemId ? { ...item, quantity } : item)),
      );
      try {
        await updateQuantityMutation.mutateAsync({ itemId, quantity });
      } catch {
        // Local state has already been updated.
      }
    },
    [updateQuantityMutation]
  );

  const refreshCart = useCallback(() => {
    utils.cart.get.invalidate();
  }, [utils]);

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        itemCount,
        sessionId,
        isLoading,
        addItem,
        removeItem,
        updateQuantity,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
