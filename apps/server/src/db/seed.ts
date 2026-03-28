import "dotenv/config";
import { db } from "@work-holo/db";
import { account, user } from "@work-holo/db/schema/auth";
import { hashPassword } from "better-auth/crypto";
import { eq } from "drizzle-orm";

const SUPER_ADMIN_EMAIL = "superadmin@workholo.com";
const SUPER_ADMIN_NAME = "Super Admin";
const SUPER_ADMIN_PASSWORD = "SuperAdm1n@Holo2026!";
const EXIT_DELAY_MS = 300;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function seed(): Promise<void> {
  process.stdout.write("[seed] Starting seed script...\n");

  const existing = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, SUPER_ADMIN_EMAIL))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(user)
      .set({ role: "super_admin" })
      .where(eq(user.email, SUPER_ADMIN_EMAIL));
    process.stdout.write(
      "[seed] Super admin role updated for existing account.\n"
    );
    return;
  }

  const hashedPassword = await hashPassword(SUPER_ADMIN_PASSWORD);
  const userId = crypto.randomUUID();
  const now = new Date();

  await db.insert(user).values({
    id: userId,
    email: SUPER_ADMIN_EMAIL,
    name: SUPER_ADMIN_NAME,
    emailVerified: true,
    role: "super_admin",
    createdAt: now,
    updatedAt: now,
  });

  await db.insert(account).values({
    id: crypto.randomUUID(),
    userId,
    accountId: userId,
    providerId: "credential",
    password: hashedPassword,
    createdAt: now,
    updatedAt: now,
  });

  process.stdout.write("[seed] Super admin seeded successfully.\n");
  process.stdout.write(`[seed]   Email:    ${SUPER_ADMIN_EMAIL}\n`);
  process.stdout.write(
    `[seed]   Password: ${SUPER_ADMIN_PASSWORD}  <-- CHANGE THIS IMMEDIATELY\n`
  );
}

if (import.meta.main) {
  seed()
    .then(async () => {
      await sleep(EXIT_DELAY_MS);
      process.exit(0);
    })
    .catch(async (e) => {
      process.stderr.write(`[seed] Seed failed: ${e}\n`);
      await sleep(EXIT_DELAY_MS);
      process.exit(1);
    });
}
