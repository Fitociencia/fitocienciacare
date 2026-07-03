import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { wellnessAssessments } from "@db/schema";

export const assessmentRouter = createRouter({
  submit: publicQuery
    .input(
      z.object({
        name: z.string().min(1),
        age: z.number().int().optional(),
        email: z.string().email(),
        whatsapp: z.string().optional(),
        mainConcern: z.string().optional(),
        stressLevel: z.number().int().min(1).max(10).optional(),
        sleepQuality: z.number().int().min(1).max(10).optional(),
        digestiveDiscomfort: z.number().int().min(1).max(10).optional(),
        muscleTension: z.number().int().min(1).max(10).optional(),
        energyLevel: z.number().int().min(1).max(10).optional(),
        medications: z.string().optional(),
        pregnancyLactation: z.boolean().default(false),
        allergies: z.string().optional(),
        preferredSupport: z.array(z.string()).optional(),
        consent: z.boolean().default(false),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      await db.insert(wellnessAssessments).values({
        userId: ctx.user?.id || null,
        ...input,
        preferredSupport: input.preferredSupport ? JSON.stringify(input.preferredSupport) : null,
      });
      return { success: true };
    }),

  list: adminQuery
    .input(
      z.object({
        page: z.number().int().default(1),
        limit: z.number().int().default(20),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(wellnessAssessments)
        .orderBy(desc(wellnessAssessments.createdAt))
        .limit(input?.limit || 20)
        .offset(((input?.page || 1) - 1) * (input?.limit || 20));
    }),

  getById: adminQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [assessment] = await db
        .select()
        .from(wellnessAssessments)
        .where(eq(wellnessAssessments.id, input.id))
        .limit(1);
      return assessment || null;
    }),
});
