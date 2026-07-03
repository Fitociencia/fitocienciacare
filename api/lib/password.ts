import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);
const KEY_LENGTH = 64;

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
  return `scrypt:${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password: string, passwordHash: string | null) {
  if (!passwordHash) return false;

  const [scheme, salt, storedKey] = passwordHash.split(":");
  if (scheme !== "scrypt" || !salt || !storedKey) return false;

  const stored = Buffer.from(storedKey, "hex");
  const derived = (await scryptAsync(password, salt, stored.length)) as Buffer;

  return stored.length === derived.length && timingSafeEqual(stored, derived);
}
