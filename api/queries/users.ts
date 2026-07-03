import { eq } from "drizzle-orm";
import * as schema from "@db/schema";
import type { InsertUser } from "@db/schema";
import { getDb } from "./connection";
import { env } from "../lib/env";

export async function findUserByUnionId(unionId: string) {
  const rows = await getDb()
    .select()
    .from(schema.users)
    .where(eq(schema.users.unionId, unionId))
    .limit(1);
  return rows.at(0);
}

export async function findUserByEmail(email: string) {
  const rows = await getDb()
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email.toLowerCase()))
    .limit(1);
  return rows.at(0);
}

export async function createLocalUser(data: {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  whatsapp?: string;
  country?: string;
  city?: string;
  mainConcern?: string;
}) {
  const email = data.email.toLowerCase();
  const unionId = `local:${email}`;

  const inserted = await getDb()
    .insert(schema.users)
    .values({
      unionId,
      name: data.name,
      email,
      passwordHash: data.passwordHash,
      authProvider: "local",
      role: unionId === env.ownerUnionId ? "admin" : "user",
      lastSignInAt: new Date(),
    })
    .$returningId();

  const userId = inserted[0]?.id;
  if (!userId) {
    throw new Error("Failed to create user.");
  }

  await getDb().insert(schema.profiles).values({
    userId,
    fullName: data.name,
    email,
    phone: data.phone,
    whatsapp: data.whatsapp,
    country: data.country,
    city: data.city,
    role: unionId === env.ownerUnionId ? "admin" : "customer",
    wellnessGoal: data.mainConcern,
  });

  return findUserByUnionId(unionId);
}

export async function upsertUser(data: InsertUser) {
  const values = { ...data };
  const updateSet: Partial<InsertUser> = {
    lastSignInAt: new Date(),
    ...data,
  };

  if (
    values.role === undefined &&
    values.unionId &&
    values.unionId === env.ownerUnionId
  ) {
    values.role = "admin";
    updateSet.role = "admin";
  }

  await getDb()
    .insert(schema.users)
    .values(values)
    .onDuplicateKeyUpdate({ set: updateSet });
}
