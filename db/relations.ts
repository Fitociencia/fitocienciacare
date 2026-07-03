import { relations } from "drizzle-orm";
import {
  users,
  profiles,
  products,
  productImages,
  carts,
  cartItems,
  orders,
  orderItems,
  membershipPlans,
  subscriptions,
  courses,
  courseModules,
  lessons,
  courseProgress,
  wellnessAssessments,
  medicalCheckups,
} from "./schema";

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles),
  medicalCheckups: many(medicalCheckups),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, { fields: [profiles.userId], references: [users.id] }),
}));

export const productsRelations = relations(products, ({ many }) => ({
  images: many(productImages),
  cartItems: many(cartItems),
  orderItems: many(orderItems),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, { fields: [productImages.productId], references: [products.id] }),
}));

export const cartsRelations = relations(carts, ({ many }) => ({
  items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, { fields: [cartItems.cartId], references: [carts.id] }),
  product: one(products, { fields: [cartItems.productId], references: [products.id] }),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, { fields: [orderItems.productId], references: [products.id] }),
}));

export const membershipPlansRelations = relations(membershipPlans, ({ many }) => ({
  subscriptions: many(subscriptions),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  plan: one(membershipPlans, { fields: [subscriptions.planId], references: [membershipPlans.id] }),
}));

export const coursesRelations = relations(courses, ({ many }) => ({
  modules: many(courseModules),
}));

export const courseModulesRelations = relations(courseModules, ({ one, many }) => ({
  course: one(courses, { fields: [courseModules.courseId], references: [courses.id] }),
  lessons: many(lessons),
}));

export const lessonsRelations = relations(lessons, ({ one }) => ({
  module: one(courseModules, { fields: [lessons.moduleId], references: [courseModules.id] }),
  course: one(courses, { fields: [lessons.courseId], references: [courses.id] }),
}));

export const courseProgressRelations = relations(courseProgress, ({ one }) => ({
  user: one(profiles, { fields: [courseProgress.userId], references: [profiles.id] }),
  course: one(courses, { fields: [courseProgress.courseId], references: [courses.id] }),
  lesson: one(lessons, { fields: [courseProgress.lessonId], references: [lessons.id] }),
}));

export const wellnessAssessmentsRelations = relations(wellnessAssessments, ({ one, many }) => ({
  user: one(users, { fields: [wellnessAssessments.userId], references: [users.id] }),
  medicalCheckups: many(medicalCheckups),
}));

export const medicalCheckupsRelations = relations(medicalCheckups, ({ one }) => ({
  user: one(users, { fields: [medicalCheckups.userId], references: [users.id] }),
  assessment: one(wellnessAssessments, {
    fields: [medicalCheckups.assessmentId],
    references: [wellnessAssessments.id],
  }),
}));
