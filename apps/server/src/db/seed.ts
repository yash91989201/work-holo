import "dotenv/config";
import { scryptSync } from "node:crypto";
import { db } from "@work-holo/db";
import { account, user } from "@work-holo/db/schema/auth";
<<<<<<< HEAD
import { sleep } from "bun";
=======
>>>>>>> 9a25431 (fix: add missing newline at end of _journal.json file)
import { eq } from "drizzle-orm";

const SUPER_ADMIN_EMAIL = "superadmin@workholo.com";
const SUPER_ADMIN_NAME = "Super Admin";
const SUPER_ADMIN_PASSWORD = "SuperAdm1n@Holo2026!";

function hashPassword(password: string): string {
  const salt = Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString(
    "hex"
  );
  const key = scryptSync(password.normalize("NFKC"), salt, 64, {
    N: 16_384,
    r: 16,
    p: 1,
    maxmem: 128 * 16_384 * 16 * 2,
  });
  return `${salt}:${key.toString("hex")}`;
}

async function seed() {
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

  const hashedPassword = hashPassword(SUPER_ADMIN_PASSWORD);
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

seed()
  .then(async () => {
<<<<<<< HEAD
    await sleep(300);
=======
    await Bun.sleep(300);
>>>>>>> 9a25431 (fix: add missing newline at end of _journal.json file)
    process.exit(0);
  })
  .catch(async (e) => {
    process.stderr.write(`[seed] Seed failed: ${e}\n`);
<<<<<<< HEAD
    await sleep(300);
=======
    await Bun.sleep(300);
>>>>>>> 9a25431 (fix: add missing newline at end of _journal.json file)
    process.exit(1);
  });
