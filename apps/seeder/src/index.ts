import "dotenv/config";
import { seedSoundPresets } from "@work-holo/api/seed";
import { seedPermissions } from "@work-holo/permission/seed";
import { seed as seedSuperAdmin } from "../../server/src/db/seed";

const SEEDERS = [
  { name: "permissions", fn: seedPermissions },
  { name: "sound-presets", fn: seedSoundPresets },
  { name: "super-admin", fn: seedSuperAdmin },
] as const;

const only = process.argv.find((a) => a.startsWith("--only="))?.split("=")[1];

async function main(): Promise<void> {
  const seeders = only ? SEEDERS.filter((s) => s.name === only) : SEEDERS;

  if (only && seeders.length === 0) {
    console.error(
      `Unknown seeder: "${only}". Available: ${SEEDERS.map((s) => s.name).join(", ")}`
    );
    process.exit(1);
  }

  console.log(
    `🌱 Running ${seeders.length} seeder(s): ${seeders.map((s) => s.name).join(", ")}`
  );
  console.log("");

  for (const seeder of seeders) {
    console.log(`▶ [${seeder.name}]`);
    await seeder.fn();
    console.log(`✓ [${seeder.name}] done`);
    console.log("");
  }

  console.log("✨ All seeders complete.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Seeder failed:", error);
    process.exit(1);
  });
