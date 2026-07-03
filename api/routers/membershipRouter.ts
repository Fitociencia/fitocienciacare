import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { createRouter, publicQuery, authedQuery, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { devMembershipPlan } from "../devData";
import { env } from "../lib/env";
import { membershipPlans, subscriptions } from "@db/schema";

export const membershipRouter = createRouter({
  getPlan: publicQuery
    .input(z.object({ slug: z.string().optional() }).optional())
    .query(async ({ input }) => {
      if (!env.hasDatabaseUrl) {
        return !input?.slug || input.slug === devMembershipPlan.slug ? devMembershipPlan : null;
      }

      const db = getDb();
      if (input?.slug) {
        const [plan] = await db
          .select()
          .from(membershipPlans)
          .where(eq(membershipPlans.slug, input.slug))
          .limit(1);
        return plan || null;
      }
      const [defaultPlan] = await db
        .select()
        .from(membershipPlans)
        .where(eq(membershipPlans.isActive, true))
        .limit(1);
      return defaultPlan || null;
    }),

  getAllPlans: publicQuery.query(async () => {
    if (!env.hasDatabaseUrl) {
      return [devMembershipPlan];
    }

    const db = getDb();
    return db
      .select()
      .from(membershipPlans)
      .where(eq(membershipPlans.isActive, true));
  }),

  subscribe: authedQuery
    .input(
      z.object({
        planId: z.number(),
        provider: z.enum(["stripe", "paypal", "cash"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const now = new Date();
      const periodEnd = new Date(now);
      periodEnd.setMonth(periodEnd.getMonth() + 1);

      const [sub] = await db.insert(subscriptions).values({
        userId: ctx.user.id,
        planId: input.planId,
        provider: input.provider,
        status: "active",
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
      });

      return sub;
    }),

  getMySubscription: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const [sub] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, ctx.user.id))
      .orderBy(desc(subscriptions.createdAt))
      .limit(1);
    return sub || null;
  }),

  checkAccess: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const [sub] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, ctx.user.id))
      .orderBy(desc(subscriptions.createdAt))
      .limit(1);

    if (!sub) return { hasAccess: false, status: "none" };

    const hasAccess = sub.status === "active" || sub.status === "trialing";
    return { hasAccess, status: sub.status };
  }),

  cancel: authedQuery.mutation(async ({ ctx }) => {
    const db = getDb();
    const [sub] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, ctx.user.id))
      .orderBy(desc(subscriptions.createdAt))
      .limit(1);

    if (!sub) throw new Error("No active subscription found");

    await db
      .update(subscriptions)
      .set({ cancelAtPeriodEnd: true, updatedAt: new Date() })
      .where(eq(subscriptions.id, sub.id));

    return { success: true };
  }),

  // Admin
  listSubscriptions: adminQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(subscriptions)
      .orderBy(desc(subscriptions.createdAt));
  }),

  updateSubscriptionStatus: adminQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["trialing", "active", "past_due", "unpaid", "canceled", "inactive", "expired", "incomplete"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(subscriptions)
        .set({ status: input.status, updatedAt: new Date() })
        .where(eq(subscriptions.id, input.id));
      return { success: true };
    }),
});
