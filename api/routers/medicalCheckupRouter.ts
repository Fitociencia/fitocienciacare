import { z } from "zod";
import { and, desc, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { authedQuery, createRouter, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { medicalCheckups, users } from "@db/schema";

const statusSchema = z.enum(["draft", "published", "archived"]);

const stringListSchema = z.array(z.string().min(1)).default([]);

const checkupInputSchema = z.object({
  userId: z.number().int().positive(),
  assessmentId: z.number().int().positive().nullable().optional(),
  title: z.string().min(1),
  status: statusSchema.default("draft"),
  practitionerName: z.string().optional(),
  reportDate: z.coerce.date().optional(),
  summary: z.string().min(1),
  observations: z.string().optional(),
  recommendations: stringListSchema.optional(),
  productRecommendations: stringListSchema.optional(),
  courseRecommendations: stringListSchema.optional(),
  followUpNotes: z.string().optional(),
  clientNotes: z.string().optional(),
  disclaimer: z.string().optional(),
});

const checkupUpdateSchema = checkupInputSchema.partial().extend({
  id: z.number().int().positive(),
});

function publicationDateForStatus(status?: "draft" | "published" | "archived") {
  return status === "published" ? new Date() : null;
}

export const medicalCheckupRouter = createRouter({
  myReports: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    return db
      .select()
      .from(medicalCheckups)
      .where(
        and(
          eq(medicalCheckups.userId, ctx.user.id),
          eq(medicalCheckups.status, "published"),
        ),
      )
      .orderBy(desc(medicalCheckups.reportDate));
  }),

  getMyReport: authedQuery
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const [report] = await db
        .select()
        .from(medicalCheckups)
        .where(
          and(
            eq(medicalCheckups.id, input.id),
            eq(medicalCheckups.userId, ctx.user.id),
            eq(medicalCheckups.status, "published"),
          ),
        )
        .limit(1);

      if (!report) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Checkup report not found." });
      }

      return report;
    }),

  listUsers: adminQuery.query(async () => {
    const db = getDb();
    return db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        lastSignInAt: users.lastSignInAt,
      })
      .from(users)
      .orderBy(desc(users.lastSignInAt));
  }),

  list: adminQuery
    .input(
      z
        .object({
          userId: z.number().int().positive().optional(),
          status: statusSchema.optional(),
          limit: z.number().int().positive().max(100).default(25),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [];

      if (input?.userId) {
        conditions.push(eq(medicalCheckups.userId, input.userId));
      }

      if (input?.status) {
        conditions.push(eq(medicalCheckups.status, input.status));
      }

      return db
        .select()
        .from(medicalCheckups)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(medicalCheckups.updatedAt))
        .limit(input?.limit ?? 25);
    }),

  create: adminQuery.input(checkupInputSchema).mutation(async ({ input }) => {
    const db = getDb();
    const publishedAt = publicationDateForStatus(input.status);

    await db.insert(medicalCheckups).values({
      ...input,
      reportDate: input.reportDate ?? new Date(),
      recommendations: input.recommendations ?? null,
      productRecommendations: input.productRecommendations ?? null,
      courseRecommendations: input.courseRecommendations ?? null,
      publishedAt,
    });

    return { success: true };
  }),

  update: adminQuery.input(checkupUpdateSchema).mutation(async ({ input }) => {
    const db = getDb();
    const { id, ...data } = input;
    const updateData: Record<string, unknown> = {
      ...data,
      updatedAt: new Date(),
    };

    if (data.status !== undefined) {
      updateData.publishedAt = publicationDateForStatus(data.status);
    }

    if (data.reportDate === undefined) {
      delete updateData.reportDate;
    }

    await db.update(medicalCheckups).set(updateData).where(eq(medicalCheckups.id, id));
    return { success: true };
  }),

  delete: adminQuery
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(medicalCheckups).where(eq(medicalCheckups.id, input.id));
      return { success: true };
    }),
});
