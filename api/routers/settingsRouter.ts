import { z } from "zod";
import { eq } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { siteSettings } from "@db/schema";

export const settingsRouter = createRouter({
  get: publicQuery
    .input(z.object({ key: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [setting] = await db
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.key, input.key))
        .limit(1);
      return setting?.value || null;
    }),

  getAll: publicQuery.query(async () => {
    const db = getDb();
    const all = await db.select().from(siteSettings);
    const result: Record<string, any> = {};
    for (const s of all) {
      result[s.key] = s.value;
    }
    return result;
  }),

  set: adminQuery
    .input(z.object({ key: z.string(), value: z.any() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .insert(siteSettings)
        .values({ key: input.key, value: input.value })
        .onDuplicateKeyUpdate({
          set: { value: input.value, updatedAt: new Date() },
        });
      return { success: true };
    }),
});
