import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { devProducts } from "../devData";
import { env } from "../lib/env";
import { products, productImages } from "@db/schema";

export const productRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        category: z.enum(["fitoterapia", "termoterapia", "topicos", "sachets", "bundle"]).optional(),
        featured: z.boolean().optional(),
        search: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      if (!env.hasDatabaseUrl) {
        return devProducts.filter((product) => {
          if (input?.category && product.category !== input.category) return false;
          if (input?.featured && !product.isFeatured) return false;
          if (input?.search) {
            const search = input.search.toLowerCase();
            return `${product.name} ${product.shortDescription}`.toLowerCase().includes(search);
          }
          return product.isActive;
        });
      }

      const db = getDb();
      const conditions = [];

      if (input?.category) {
        conditions.push(eq(products.category, input.category));
      }
      if (input?.featured) {
        conditions.push(eq(products.isFeatured, true));
      }
      conditions.push(eq(products.isActive, true));

      const results = await db
        .select()
        .from(products)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(products.createdAt));

      const productsWithImages = await Promise.all(
        results.map(async (p) => {
          const images = await db
            .select()
            .from(productImages)
            .where(eq(productImages.productId, p.id));
          return { ...p, images };
        })
      );

      return productsWithImages;
    }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      if (!env.hasDatabaseUrl) {
        return devProducts.find((product) => product.slug === input.slug) ?? null;
      }

      const db = getDb();
      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.slug, input.slug))
        .limit(1);

      if (!product) return null;

      const images = await db
        .select()
        .from(productImages)
        .where(eq(productImages.productId, product.id));

      return { ...product, images };
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      if (!env.hasDatabaseUrl) {
        return devProducts.find((product) => product.id === input.id) ?? null;
      }

      const db = getDb();
      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.id, input.id))
        .limit(1);

      if (!product) return null;

      const images = await db
        .select()
        .from(productImages)
        .where(eq(productImages.productId, product.id));

      return { ...product, images };
    }),

  create: adminQuery
    .input(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        category: z.enum(["fitoterapia", "termoterapia", "topicos", "sachets", "bundle"]),
        shortDescription: z.string().min(1),
        fullDescription: z.string().optional(),
        purpose: z.string().optional(),
        ingredients: z.array(z.string()).optional(),
        suggestedUse: z.string().optional(),
        safetyNote: z.string().optional(),
        contraindications: z.string().optional(),
        price: z.string().or(z.number()),
        currency: z.string().default("GTQ"),
        stock: z.number().int().default(0),
        isActive: z.boolean().default(true),
        isFeatured: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const priceStr = typeof input.price === "number" ? input.price.toFixed(2) : input.price;
      const [product] = await db.insert(products).values({
        ...input,
        price: priceStr,
        ingredients: input.ingredients || null,
      });
      return product;
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          name: z.string().optional(),
          slug: z.string().optional(),
          category: z.enum(["fitoterapia", "termoterapia", "topicos", "sachets", "bundle"]).optional(),
          shortDescription: z.string().optional(),
          fullDescription: z.string().optional(),
          purpose: z.string().optional(),
          ingredients: z.array(z.string()).optional(),
          suggestedUse: z.string().optional(),
          safetyNote: z.string().optional(),
          contraindications: z.string().optional(),
          price: z.string().or(z.number()).optional(),
          stock: z.number().int().optional(),
          isActive: z.boolean().optional(),
          isFeatured: z.boolean().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const updateData: any = {
        ...input.data,
        updatedAt: new Date(),
      };
      if (input.data.ingredients !== undefined) {
        updateData.ingredients = input.data.ingredients;
      }
      if (input.data.price !== undefined) {
        updateData.price = typeof input.data.price === "number" ? input.data.price.toFixed(2) : input.data.price;
      }

      await db.update(products).set(updateData).where(eq(products.id, input.id));

      const [updated] = await db.select().from(products).where(eq(products.id, input.id)).limit(1);
      return updated;
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(products).where(eq(products.id, input.id));
      return { success: true };
    }),
});
