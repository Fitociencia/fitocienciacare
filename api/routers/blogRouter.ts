import { z } from "zod";
import { eq, desc, and } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { devBlogPosts } from "../devData";
import { env } from "../lib/env";
import { blogPosts } from "@db/schema";

export const blogRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        category: z.string().optional(),
        tag: z.string().optional(),
        page: z.number().int().default(1),
        limit: z.number().int().default(12),
      }).optional()
    )
    .query(async ({ input }) => {
      if (!env.hasDatabaseUrl) {
        const page = input?.page || 1;
        const limit = input?.limit || 12;
        return devBlogPosts
          .filter((post) => post.isPublished)
          .filter((post) => !input?.category || post.category === input.category)
          .slice((page - 1) * limit, page * limit);
      }

      const db = getDb();
      const conditions = [eq(blogPosts.isPublished, true)];

      if (input?.category) {
        conditions.push(eq(blogPosts.category, input.category as any));
      }

      const results = await db
        .select()
        .from(blogPosts)
        .where(and(...conditions))
        .orderBy(desc(blogPosts.publishedAt))
        .limit(input?.limit || 12)
        .offset(((input?.page || 1) - 1) * (input?.limit || 12));

      return results;
    }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      if (!env.hasDatabaseUrl) {
        return devBlogPosts.find((post) => post.slug === input.slug) ?? null;
      }

      const db = getDb();
      const [post] = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.slug, input.slug))
        .limit(1);
      return post || null;
    }),

  create: adminQuery
    .input(
      z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        excerpt: z.string().optional(),
        content: z.string().optional(),
        featuredImageUrl: z.string().optional(),
        category: z.string().optional(),
        tags: z.array(z.string()).optional(),
        author: z.string().optional(),
        seoTitle: z.string().optional(),
        seoDescription: z.string().optional(),
        isPublished: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [post] = await db.insert(blogPosts).values({
        ...input,
        category: input.category as any,
        tags: input.tags || null,
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
          excerpt: z.string().optional(),
          content: z.string().optional(),
          featuredImageUrl: z.string().optional(),
          category: z.string().optional(),
          tags: z.array(z.string()).optional(),
          author: z.string().optional(),
          seoTitle: z.string().optional(),
          seoDescription: z.string().optional(),
          isPublished: z.boolean().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const updateData: any = { ...input.data, updatedAt: new Date() };
      if (input.data.category) updateData.category = input.data.category as any;
      if (input.data.tags !== undefined) updateData.tags = input.data.tags;
      if (input.data.isPublished) updateData.publishedAt = new Date();

      await db.update(blogPosts).set(updateData).where(eq(blogPosts.id, input.id));
      const [updated] = await db.select().from(blogPosts).where(eq(blogPosts.id, input.id)).limit(1);
      return updated;
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(blogPosts).where(eq(blogPosts.id, input.id));
      return { success: true };
    }),
});
