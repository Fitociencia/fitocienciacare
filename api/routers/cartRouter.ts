import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { carts, cartItems, products } from "@db/schema";

function generateSessionId() {
  return `sess_${Math.random().toString(36).substring(2)}_${Date.now()}`;
}

export const cartRouter = createRouter({
  get: publicQuery
    .input(z.object({ sessionId: z.string().optional() }).optional())
    .query(async ({ input, ctx }) => {
      const db = getDb();
      const userId = ctx.user?.id;

      let cart;
      if (userId) {
        const [userCart] = await db
          .select()
          .from(carts)
          .where(eq(carts.userId, userId))
          .limit(1);
        cart = userCart;
      } else if (input?.sessionId) {
        const [sessCart] = await db
          .select()
          .from(carts)
          .where(eq(carts.sessionId, input.sessionId))
          .limit(1);
        cart = sessCart;
      }

      if (!cart) {
        return { items: [], total: 0, sessionId: input?.sessionId || null };
      }

      const items = await db
        .select({
          id: cartItems.id,
          quantity: cartItems.quantity,
          priceAtTime: cartItems.priceAtTime,
          productId: cartItems.productId,
          productName: products.name,
          productSlug: products.slug,
          productPrice: products.price,
        })
        .from(cartItems)
        .leftJoin(products, eq(cartItems.productId, products.id))
        .where(eq(cartItems.cartId, cart.id));

      const total = items.reduce(
        (sum, item) => sum + Number(item.priceAtTime) * item.quantity,
        0
      );

      return { items, total: Number(total.toFixed(2)), sessionId: cart.sessionId };
    }),

  addItem: publicQuery
    .input(
      z.object({
        productId: z.number(),
        quantity: z.number().int().positive().default(1),
        sessionId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const userId = ctx.user?.id;

      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.id, input.productId))
        .limit(1);

      if (!product) throw new Error("Product not found");

      let cart;
      let sessionId = input.sessionId;

      if (userId) {
        const [existing] = await db
          .select()
          .from(carts)
          .where(eq(carts.userId, userId))
          .limit(1);
        if (existing) {
          cart = existing;
          sessionId = existing.sessionId || sessionId;
        } else {
          const sid = generateSessionId();
          const [newCart] = await db.insert(carts).values({
            userId,
            sessionId: sid,
          });
          cart = { id: newCart.insertId, userId, sessionId: sid };
          sessionId = sid;
        }
      } else {
        const sid = sessionId || generateSessionId();
        const [existing] = await db
          .select()
          .from(carts)
          .where(eq(carts.sessionId, sid))
          .limit(1);
        if (existing) {
          cart = existing;
        } else {
          const [newCart] = await db.insert(carts).values({ sessionId: sid });
          cart = { id: newCart.insertId, sessionId: sid };
        }
        sessionId = sid;
      }

      const cartId = Number(cart.id);
      const [existingItem] = await db
        .select()
        .from(cartItems)
        .where(and(eq(cartItems.cartId, cartId), eq(cartItems.productId, input.productId)))
        .limit(1);

      if (existingItem) {
        await db
          .update(cartItems)
          .set({ quantity: existingItem.quantity + input.quantity })
          .where(eq(cartItems.id, existingItem.id));
      } else {
        await db.insert(cartItems).values({
          cartId,
          productId: input.productId,
          quantity: input.quantity,
          priceAtTime: product.price,
        });
      }

      return { success: true, sessionId };
    }),

  removeItem: publicQuery
    .input(z.object({ itemId: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(cartItems).where(eq(cartItems.id, input.itemId));
      return { success: true };
    }),

  updateQuantity: publicQuery
    .input(z.object({ itemId: z.number(), quantity: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(cartItems)
        .set({ quantity: input.quantity })
        .where(eq(cartItems.id, input.itemId));
      return { success: true };
    }),

  clear: publicQuery
    .input(z.object({ sessionId: z.string().optional() }).optional())
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const userId = ctx.user?.id;

      if (userId) {
        const [cart] = await db
          .select()
          .from(carts)
          .where(eq(carts.userId, userId))
          .limit(1);
        if (cart) {
          await db.delete(cartItems).where(eq(cartItems.cartId, cart.id));
        }
      } else if (input?.sessionId) {
        const [cart] = await db
          .select()
          .from(carts)
          .where(eq(carts.sessionId, input.sessionId))
          .limit(1);
        if (cart) {
          await db.delete(cartItems).where(eq(cartItems.cartId, cart.id));
        }
      }

      return { success: true };
    }),
});
