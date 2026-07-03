import * as cookie from "cookie";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Session } from "@contracts/constants";
import { getSessionCookieOptions } from "./lib/cookies";
import { hashPassword, verifyPassword } from "./lib/password";
import { createRouter, authedQuery, publicQuery } from "./middleware";
import { createLocalUser, findUserByEmail } from "./queries/users";
import { signSessionToken } from "./kimi/session";
import { env } from "./lib/env";

const emailSchema = z.string().trim().email().transform((value) => value.toLowerCase());
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .regex(/[A-Za-z]/, "Password must include a letter.")
  .regex(/[0-9]/, "Password must include a number.");

function setSessionCookie(ctx: { req: Request; resHeaders: Headers }, token: string) {
  const opts = getSessionCookieOptions(ctx.req.headers);
  ctx.resHeaders.append(
    "set-cookie",
    cookie.serialize(Session.cookieName, token, {
      httpOnly: opts.httpOnly,
      path: opts.path,
      sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
      secure: opts.secure,
      maxAge: Session.maxAgeMs / 1000,
    }),
  );
}

export const authRouter = createRouter({
  register: publicQuery
    .input(
      z.object({
        name: z.string().trim().min(2),
        email: emailSchema,
        password: passwordSchema,
        whatsapp: z.string().trim().min(7).optional(),
        country: z.string().trim().min(2).optional(),
        city: z.string().trim().min(2).optional(),
        mainConcern: z.string().trim().min(5).optional(),
        consent: z.literal(true),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const existing = await findUserByEmail(input.email);
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "An account with this email already exists.",
        });
      }

      const passwordHash = await hashPassword(input.password);
      const user = await createLocalUser({
        name: input.name,
        email: input.email,
        passwordHash,
        whatsapp: input.whatsapp,
        country: input.country,
        city: input.city,
        mainConcern: input.mainConcern,
      });

      if (!user) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Could not create account." });
      }

      const token = await signSessionToken({ unionId: user.unionId, clientId: env.appId });
      setSessionCookie(ctx, token);
      return user;
    }),

  login: publicQuery
    .input(z.object({ email: emailSchema, password: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const user = await findUserByEmail(input.email);
      const isValid = await verifyPassword(input.password, user?.passwordHash ?? null);

      if (!user || !isValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password.",
        });
      }

      const token = await signSessionToken({ unionId: user.unionId, clientId: env.appId });
      setSessionCookie(ctx, token);
      return user;
    }),

  me: authedQuery.query((opts) => opts.ctx.user),
  logout: authedQuery.mutation(async ({ ctx }) => {
    const opts = getSessionCookieOptions(ctx.req.headers);
    ctx.resHeaders.append(
      "set-cookie",
      cookie.serialize(Session.cookieName, "", {
        httpOnly: opts.httpOnly,
        path: opts.path,
        sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
        secure: opts.secure,
        maxAge: 0,
      }),
    );
    return { success: true };
  }),
});
