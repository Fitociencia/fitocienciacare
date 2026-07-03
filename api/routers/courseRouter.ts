import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { devCourses } from "../devData";
import { env } from "../lib/env";
import { courses, courseModules, lessons } from "@db/schema";

export const courseRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        category: z.string().optional(),
        level: z.string().optional(),
        search: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      if (!env.hasDatabaseUrl) {
        return devCourses
          .filter((course) => course.isPublished)
          .filter((course) => !input?.category || course.category === input.category)
          .filter((course) => !input?.level || course.level === input.level)
          .filter((course) => {
            if (!input?.search) return true;
            const search = input.search.toLowerCase();
            return `${course.title} ${course.description}`.toLowerCase().includes(search);
          });
      }

      const db = getDb();
      const results = await db
        .select()
        .from(courses)
        .orderBy(desc(courses.createdAt));

      return results.filter((c) => c.isPublished);
    }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      if (!env.hasDatabaseUrl) {
        return devCourses.find((course) => course.slug === input.slug) ?? null;
      }

      const db = getDb();
      const [course] = await db
        .select()
        .from(courses)
        .where(eq(courses.slug, input.slug))
        .limit(1);

      if (!course) return null;

      const modules = await db
        .select()
        .from(courseModules)
        .where(eq(courseModules.courseId, course.id))
        .orderBy(courseModules.sortOrder);

      const modulesWithLessons = await Promise.all(
        modules.map(async (mod) => {
          const modLessons = await db
            .select({
              id: lessons.id,
              title: lessons.title,
              slug: lessons.slug,
              duration: lessons.duration,
              sortOrder: lessons.sortOrder,
              isPreview: lessons.isPreview,
            })
            .from(lessons)
            .where(eq(lessons.moduleId, mod.id))
            .orderBy(lessons.sortOrder);
          return { ...mod, lessons: modLessons };
        })
      );

      return { ...course, modules: modulesWithLessons };
    }),

  create: adminQuery
    .input(
      z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().optional(),
        level: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
        duration: z.string().optional(),
        instructor: z.string().optional(),
        featuredImageUrl: z.string().optional(),
        requiresSubscription: z.boolean().default(true),
        price: z.string().or(z.number()).optional(),
        category: z.string().optional(),
        isPublished: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [course] = await db.insert(courses).values({
        ...input,
        category: input.category as any,
        price: input.price !== undefined ? (typeof input.price === "number" ? input.price.toFixed(2) : input.price) : null,
      });
      return course;
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          title: z.string().optional(),
          slug: z.string().optional(),
          description: z.string().optional(),
          level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
          duration: z.string().optional(),
          instructor: z.string().optional(),
          featuredImageUrl: z.string().optional(),
          requiresSubscription: z.boolean().optional(),
          price: z.string().or(z.number()).optional(),
          category: z.string().optional(),
          isPublished: z.boolean().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const updateData: any = { ...input.data, updatedAt: new Date() };
      if (input.data.category) updateData.category = input.data.category as any;
      if (input.data.price !== undefined) {
        updateData.price = typeof input.data.price === "number" ? input.data.price.toFixed(2) : input.data.price;
      }

      await db.update(courses).set(updateData).where(eq(courses.id, input.id));
      const [updated] = await db.select().from(courses).where(eq(courses.id, input.id)).limit(1);
      return updated;
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(courses).where(eq(courses.id, input.id));
      return { success: true };
    }),
});
