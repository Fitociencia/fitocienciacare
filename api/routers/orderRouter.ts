import { z } from "zod";
import { eq, desc, and } from "drizzle-orm";
import { createRouter, publicQuery, authedQuery, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { orders, orderItems } from "@db/schema";

export const orderRouter = createRouter({
  list: adminQuery
    .input(
      z.object({
        status: z.enum(["pending", "processing", "shipped", "delivered", "canceled"]).optional(),
        page: z.number().int().default(1),
        limit: z.number().int().default(20),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [];
      if (input?.status) conditions.push(eq(orders.orderStatus, input.status));

      const results = await db
        .select()
        .from(orders)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(orders.createdAt))
        .limit(input?.limit || 20)
        .offset(((input?.page || 1) - 1) * (input?.limit || 20));

      return results;
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.id, input.id))
        .limit(1);

      if (!order) return null;

      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, order.id));

      return { ...order, items };
    }),

  create: publicQuery
    .input(
      z.object({
        customerName: z.string().min(1),
        customerEmail: z.string().email(),
        customerPhone: z.string().min(1),
        shippingAddress: z.string().min(1),
        notes: z.string().optional(),
        items: z.array(
          z.object({
            productId: z.number(),
            productName: z.string(),
            quantity: z.number().int().positive(),
            unitPrice: z.number().positive(),
          })
        ),
        total: z.number().positive(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const [order] = await db.insert(orders).values({
        userId: ctx.user?.id || null,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        shippingAddress: input.shippingAddress,
        notes: input.notes,
        total: String(input.total),
        paymentStatus: "pending",
        orderStatus: "pending",
      });

      const orderId = Number(order.insertId);

      for (const item of input.items) {
        await db.insert(orderItems).values({
          orderId,
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: String(item.unitPrice),
          total: String(item.unitPrice * item.quantity),
        });
      }

      return { id: orderId, ...input };
    }),

  updateStatus: adminQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "processing", "shipped", "delivered", "canceled"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(orders)
        .set({ orderStatus: input.status, updatedAt: new Date() })
        .where(eq(orders.id, input.id));
      return { success: true };
    }),

  myOrders: authedQuery
    .input(z.object({ page: z.number().int().default(1), limit: z.number().int().default(20) }).optional())
    .query(async ({ input, ctx }) => {
      const db = getDb();
      const userId = ctx.user.id;

      const results = await db
        .select()
        .from(orders)
        .where(eq(orders.userId, userId))
        .orderBy(desc(orders.createdAt))
        .limit(input?.limit || 20)
        .offset(((input?.page || 1) - 1) * (input?.limit || 20));

      return results;
    }),
});
