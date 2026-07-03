import { authRouter } from "./auth-router";
import { createRouter, publicQuery } from "./middleware";
import { productRouter } from "./routers/productRouter";
import { cartRouter } from "./routers/cartRouter";
import { orderRouter } from "./routers/orderRouter";
import { blogRouter } from "./routers/blogRouter";
import { researchRouter } from "./routers/researchRouter";
import { courseRouter } from "./routers/courseRouter";
import { membershipRouter } from "./routers/membershipRouter";
import { assessmentRouter } from "./routers/assessmentRouter";
import { settingsRouter } from "./routers/settingsRouter";
import { dashboardRouter } from "./routers/dashboardRouter";
import { medicalCheckupRouter } from "./routers/medicalCheckupRouter";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  product: productRouter,
  cart: cartRouter,
  order: orderRouter,
  blog: blogRouter,
  research: researchRouter,
  course: courseRouter,
  membership: membershipRouter,
  assessment: assessmentRouter,
  settings: settingsRouter,
  dashboard: dashboardRouter,
  medicalCheckup: medicalCheckupRouter,
});

export type AppRouter = typeof appRouter;
