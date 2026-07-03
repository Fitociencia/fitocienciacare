import { desc, sql } from "drizzle-orm";
import { createRouter, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { users, orders, courses, subscriptions, wellnessAssessments, blogPosts, researchPosts, medicalCheckups } from "@db/schema";

export const dashboardRouter = createRouter({
  stats: adminQuery.query(async () => {
    const db = getDb();

    const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
    const [orderCount] = await db.select({ count: sql<number>`count(*)` }).from(orders);
    const [revenue] = await db
      .select({ total: sql<number>`coalesce(sum(total), 0)` })
      .from(orders)
      .where(sql`paymentStatus = 'paid'`);
    const [courseCount] = await db.select({ count: sql<number>`count(*)` }).from(courses);
    const [subCount] = await db.select({ count: sql<number>`count(*)` }).from(subscriptions);
    const [assessmentCount] = await db.select({ count: sql<number>`count(*)` }).from(wellnessAssessments);
    const [blogCount] = await db.select({ count: sql<number>`count(*)` }).from(blogPosts);
    const [researchCount] = await db.select({ count: sql<number>`count(*)` }).from(researchPosts);
    const [checkupCount] = await db.select({ count: sql<number>`count(*)` }).from(medicalCheckups);

    return {
      users: userCount.count,
      orders: orderCount.count,
      revenue: Number(revenue.total),
      courses: courseCount.count,
      subscriptions: subCount.count,
      assessments: assessmentCount.count,
      blogPosts: blogCount.count,
      researchPosts: researchCount.count,
      medicalCheckups: checkupCount.count,
    };
  }),

  recentOrders: adminQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(10);
  }),

  salesByMonth: adminQuery.query(async () => {
    const db = getDb();
    const results = await db
      .select({
        month: sql<string>`date_format(createdAt, '%Y-%m')`,
        revenue: sql<number>`coalesce(sum(total), 0)`,
        orders: sql<number>`count(*)`,
      })
      .from(orders)
      .groupBy(sql`date_format(createdAt, '%Y-%m')`)
      .orderBy(desc(sql`date_format(createdAt, '%Y-%m')`))
      .limit(12);

    return results;
  }),

  memberActivity: adminQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(subscriptions)
      .orderBy(desc(subscriptions.updatedAt))
      .limit(20);
  }),
});
