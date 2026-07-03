import { z } from "zod";
import { eq, desc, and } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { devResearchPosts } from "../devData";
import { env } from "../lib/env";
import { researchPosts } from "@db/schema";

export const researchRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        category: z.string().optional(),
        visibility: z.enum(["public", "members_only"]).optional(),
        page: z.number().int().default(1),
        limit: z.number().int().default(12),
      }).optional()
    )
    .query(async ({ input }) => {
      if (!env.hasDatabaseUrl) {
        const page = input?.page || 1;
        const limit = input?.limit || 12;
        return devResearchPosts
          .filter((post) => post.isPublished)
          .filter((post) => !input?.category || post.category === input.category)
          .filter((post) => !input?.visibility || post.visibility === input.visibility)
          .slice((page - 1) * limit, page * limit);
      }

      const db = getDb();
      const conditions = [eq(researchPosts.isPublished, true)];

      if (input?.category) {
        conditions.push(eq(researchPosts.category, input.category as any));
      }
      if (input?.visibility) {
        conditions.push(eq(researchPosts.visibility, input.visibility));
      }

      const results = await db
        .select()
        .from(researchPosts)
        .where(and(...conditions))
        .orderBy(desc(researchPosts.publishedAt))
        .limit(input?.limit || 12)
        .offset(((input?.page || 1) - 1) * (input?.limit || 12));

      return results;
    }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      if (!env.hasDatabaseUrl) {
        return devResearchPosts.find((post) => post.slug === input.slug) ?? null;
      }

      const db = getDb();
      const [post] = await db
        .select()
        .from(researchPosts)
        .where(eq(researchPosts.slug, input.slug))
        .limit(1);
      return post || null;
    }),

  create: adminQuery
    .input(
      z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        abstract: z.string().optional(),
        content: z.string().optional(),
        pdfUrl: z.string().optional(),
        featuredImageUrl: z.string().optional(),
        author: z.string().optional(),
        category: z.string().optional(),
        references: z.array(z.string()).optional(),
        visibility: z.enum(["public", "members_only"]).default("public"),
        relatedProducts: z.array(z.number()).optional(),
        relatedCourses: z.array(z.number()).optional(),
        isPublished: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [post] = await db.insert(researchPosts).values({
        ...input,
        category: input.category as any,
        references: input.references ? JSON.stringify(input.references) : null,
        relatedProducts: input.relatedProducts ? JSON.stringify(input.relatedProducts) : null,
        relatedCourses: input.relatedCourses ? JSON.stringify(input.relatedCourses) : null,
        publishedAt: input.isPublished ? new Date() : null,
      });
      return post;
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          title: z.string().optional(),
          slug: z.string().optional(),
          abstract: z.string().optional(),
          content: z.string().optional(),
          pdfUrl: z.string().optional(),
          featuredImageUrl: z.string().optional(),
          author: z.string().optional(),
          category: z.string().optional(),
          references: z.array(z.string()).optional(),
          visibility: z.enum(["public", "members_only"]).optional(),
          isPublished: z.boolean().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const updateData: any = { ...input.data, updatedAt: new Date() };
      if (input.data.category) updateData.category = input.data.category as any;
      if (input.data.references) updateData.references = JSON.stringify(input.data.references);
      if (input.data.isPublished) updateData.publishedAt = new Date();

      await db.update(researchPosts).set(updateData).where(eq(researchPosts.id, input.id));
      const [updated] = await db.select().from(researchPosts).where(eq(researchPosts.id, input.id)).limit(1);
      return updated;
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(researchPosts).where(eq(researchPosts.id, input.id));
      return { success: true };
    }),
});
