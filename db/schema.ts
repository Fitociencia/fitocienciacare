import {
  mysqlTable,
  mysqlEnum,
  serial,
  bigint,
  varchar,
  text,
  timestamp,
  int,
  decimal,
  boolean,
  json,
} from "drizzle-orm/mysql-core";

// ─── Users ───
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }).unique(),
  avatar: text("avatar"),
  passwordHash: text("passwordHash"),
  authProvider: mysqlEnum("authProvider", ["local", "kimi"]).default("kimi").notNull(),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Profiles (extended user info) ───
export const profiles = mysqlTable("profiles", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).references(() => users.id),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  role: mysqlEnum("role", ["customer", "member", "admin"]).default("customer").notNull(),
  avatarUrl: text("avatarUrl"),
  whatsapp: varchar("whatsapp", { length: 50 }),
  country: varchar("country", { length: 100 }),
  city: varchar("city", { length: 100 }),
  address: text("address"),
  wellnessGoal: text("wellnessGoal"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Profile = typeof profiles.$inferSelect;

// ─── Products ───
export const products = mysqlTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  category: mysqlEnum("category", ["fitoterapia", "termoterapia", "topicos", "sachets", "bundle"]).notNull(),
  shortDescription: text("shortDescription").notNull(),
  fullDescription: text("fullDescription"),
  purpose: text("purpose"),
  ingredients: json("ingredients"),
  suggestedUse: text("suggestedUse"),
  safetyNote: text("safetyNote"),
  contraindications: text("contraindications"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("GTQ").notNull(),
  stock: int("stock").default(0),
  isActive: boolean("isActive").default(true),
  isFeatured: boolean("isFeatured").default(false),
  featuredImageUrl: text("featuredImageUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Product = typeof products.$inferSelect;

// ─── Product Images ───
export const productImages = mysqlTable("product_images", {
  id: serial("id").primaryKey(),
  productId: bigint("productId", { mode: "number", unsigned: true }).references(() => products.id),
  imageUrl: text("imageUrl").notNull(),
  altText: varchar("altText", { length: 255 }),
  sortOrder: int("sortOrder").default(0),
});

// ─── Carts ───
export const carts = mysqlTable("carts", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).references(() => profiles.id),
  sessionId: varchar("sessionId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

// ─── Cart Items ───
export const cartItems = mysqlTable("cart_items", {
  id: serial("id").primaryKey(),
  cartId: bigint("cartId", { mode: "number", unsigned: true }).references(() => carts.id),
  productId: bigint("productId", { mode: "number", unsigned: true }).references(() => products.id),
  quantity: int("quantity").notNull().default(1),
  priceAtTime: decimal("priceAtTime", { precision: 10, scale: 2 }).notNull(),
});

// ─── Orders ───
export const orders = mysqlTable("orders", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).references(() => profiles.id),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("GTQ").notNull(),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "paid", "failed", "refunded", "canceled"]).default("pending").notNull(),
  orderStatus: mysqlEnum("orderStatus", ["pending", "processing", "shipped", "delivered", "canceled"]).default("pending").notNull(),
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 255 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 50 }).notNull(),
  shippingAddress: text("shippingAddress").notNull(),
  notes: text("notes"),
  whatsappNotified: boolean("whatsappNotified").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Order = typeof orders.$inferSelect;

// ─── Order Items ───
export const orderItems = mysqlTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: bigint("orderId", { mode: "number", unsigned: true }).references(() => orders.id),
  productId: bigint("productId", { mode: "number", unsigned: true }).references(() => products.id),
  productName: varchar("productName", { length: 255 }).notNull(),
  quantity: int("quantity").notNull(),
  unitPrice: decimal("unitPrice", { precision: 10, scale: 2 }).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
});

// ─── Payments ───
export const payments = mysqlTable("payments", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).references(() => profiles.id),
  orderId: bigint("orderId", { mode: "number", unsigned: true }).references(() => orders.id),
  subscriptionId: bigint("subscriptionId", { mode: "number", unsigned: true }).references(() => subscriptions.id),
  provider: mysqlEnum("provider", ["stripe", "paypal", "cash", "bank_transfer"]).notNull(),
  providerPaymentId: varchar("providerPaymentId", { length: 255 }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("GTQ").notNull(),
  status: mysqlEnum("status", ["pending", "completed", "failed", "refunded"]).default("pending").notNull(),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Membership Plans ───
export const membershipPlans = mysqlTable("membership_plans", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  monthlyPrice: decimal("monthlyPrice", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("GTQ").notNull(),
  benefits: json("benefits"),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Subscriptions ───
export const subscriptions = mysqlTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).references(() => profiles.id),
  planId: bigint("planId", { mode: "number", unsigned: true }).references(() => membershipPlans.id),
  provider: mysqlEnum("provider", ["stripe", "paypal", "cash"]).notNull(),
  providerSubscriptionId: varchar("providerSubscriptionId", { length: 255 }),
  status: mysqlEnum("status", ["trialing", "active", "past_due", "unpaid", "canceled", "inactive", "expired", "incomplete"]).default("incomplete").notNull(),
  currentPeriodStart: timestamp("currentPeriodStart"),
  currentPeriodEnd: timestamp("currentPeriodEnd"),
  cancelAtPeriodEnd: boolean("cancelAtPeriodEnd").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Subscription = typeof subscriptions.$inferSelect;

// ─── Courses ───
export const courses = mysqlTable("courses", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  level: mysqlEnum("level", ["beginner", "intermediate", "advanced"]).default("beginner"),
  duration: varchar("duration", { length: 100 }),
  instructor: varchar("instructor", { length: 255 }),
  featuredImageUrl: text("featuredImageUrl"),
  requiresSubscription: boolean("requiresSubscription").default(true),
  price: decimal("price", { precision: 10, scale: 2 }),
  isPublished: boolean("isPublished").default(false),
  category: mysqlEnum("category", ["fitoterapia", "nutricion_naturopatica", "sistema_nervioso", "aromaterapia", "termoterapia", "autocuidado", "investigacion_aplicada", "estilos_vida"]),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Course = typeof courses.$inferSelect;

// ─── Course Modules ───
export const courseModules = mysqlTable("course_modules", {
  id: serial("id").primaryKey(),
  courseId: bigint("courseId", { mode: "number", unsigned: true }).references(() => courses.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  sortOrder: int("sortOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Lessons ───
export const lessons = mysqlTable("lessons", {
  id: serial("id").primaryKey(),
  moduleId: bigint("moduleId", { mode: "number", unsigned: true }).references(() => courseModules.id),
  courseId: bigint("courseId", { mode: "number", unsigned: true }).references(() => courses.id),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  content: text("content"),
  videoUrl: text("videoUrl"),
  resourceUrl: text("resourceUrl"),
  duration: varchar("duration", { length: 50 }),
  sortOrder: int("sortOrder").default(0),
  isPreview: boolean("isPreview").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

// ─── Course Progress ───
export const courseProgress = mysqlTable("course_progress", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).references(() => profiles.id),
  courseId: bigint("courseId", { mode: "number", unsigned: true }).references(() => courses.id),
  lessonId: bigint("lessonId", { mode: "number", unsigned: true }).references(() => lessons.id),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Blog Posts ───
export const blogPosts = mysqlTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content"),
  featuredImageUrl: text("featuredImageUrl"),
  category: mysqlEnum("category", ["fitoterapia", "nutricion_naturopatica", "sistema_nervioso_autonomo", "eje_intestino_cerebro", "aromaterapia", "termoterapia", "bienestar_emocional", "sueno_descanso", "salud_digestiva", "autocuidado", "investigacion_aplicada"]),
  tags: json("tags"),
  author: varchar("author", { length: 255 }),
  seoTitle: varchar("seoTitle", { length: 255 }),
  seoDescription: text("seoDescription"),
  isPublished: boolean("isPublished").default(false),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type BlogPost = typeof blogPosts.$inferSelect;

// ─── Research Posts ───
export const researchPosts = mysqlTable("research_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  abstract: text("abstract"),
  content: text("content"),
  pdfUrl: text("pdfUrl"),
  featuredImageUrl: text("featuredImageUrl"),
  author: varchar("author", { length: 255 }),
  category: mysqlEnum("category", ["fitoterapia_clinica", "fitoquimica", "farmacognosia", "nutricion_naturopatica", "aromaterapia", "termoterapia", "sistema_nervioso_autonomo", "eje_intestino_cerebro", "educacion_salud"]),
  references: json("references"),
  visibility: mysqlEnum("visibility", ["public", "members_only"]).default("public").notNull(),
  relatedProducts: json("relatedProducts"),
  relatedCourses: json("relatedCourses"),
  isPublished: boolean("isPublished").default(false),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type ResearchPost = typeof researchPosts.$inferSelect;

// ─── Wellness Assessments ───
export const wellnessAssessments = mysqlTable("wellness_assessments", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  age: int("age"),
  email: varchar("email", { length: 255 }).notNull(),
  whatsapp: varchar("whatsapp", { length: 50 }),
  mainConcern: text("mainConcern"),
  stressLevel: int("stressLevel"),
  sleepQuality: int("sleepQuality"),
  digestiveDiscomfort: int("digestiveDiscomfort"),
  muscleTension: int("muscleTension"),
  energyLevel: int("energyLevel"),
  medications: text("medications"),
  pregnancyLactation: boolean("pregnancyLactation").default(false),
  allergies: text("allergies"),
  preferredSupport: json("preferredSupport"),
  consent: boolean("consent").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Site Settings ───
export type WellnessAssessment = typeof wellnessAssessments.$inferSelect;

// Personalized client checkups/results
export const medicalCheckups = mysqlTable("medical_checkups", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).references(() => users.id).notNull(),
  assessmentId: bigint("assessmentId", { mode: "number", unsigned: true }).references(() => wellnessAssessments.id),
  title: varchar("title", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft").notNull(),
  practitionerName: varchar("practitionerName", { length: 255 }),
  reportDate: timestamp("reportDate").defaultNow().notNull(),
  summary: text("summary").notNull(),
  observations: text("observations"),
  recommendations: json("recommendations"),
  productRecommendations: json("productRecommendations"),
  courseRecommendations: json("courseRecommendations"),
  followUpNotes: text("followUpNotes"),
  clientNotes: text("clientNotes"),
  disclaimer: text("disclaimer"),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type MedicalCheckup = typeof medicalCheckups.$inferSelect;

export const siteSettings = mysqlTable("site_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: json("value").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type SiteSetting = typeof siteSettings.$inferSelect;
