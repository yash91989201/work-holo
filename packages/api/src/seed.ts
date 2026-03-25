import { db } from "@work-holo/db";
import { notificationSoundPresetTable } from "@work-holo/db/schema/notification";
import { eq } from "drizzle-orm";

interface SoundPreset {
  category: string;
  filename: string;
  name: string;
  sortOrder: number;
}

const DEFAULT_SOUND_PRESETS: SoundPreset[] = [
  {
    name: "Mention",
    filename: "mention.webm",
    category: "system",
    sortOrder: 1,
  },
  {
    name: "Notify",
    filename: "notify.webm",
    category: "system",
    sortOrder: 2,
  },
  {
    name: "Ascend",
    filename: "presets/ascend.mp3",
    category: "preset",
    sortOrder: 20,
  },
  {
    name: "Echo",
    filename: "presets/echo.mp3",
    category: "preset",
    sortOrder: 21,
  },
  {
    name: "Bamboo",
    filename: "presets/bamboo.mp3",
    category: "preset",
    sortOrder: 22,
  },
  {
    name: "Bubble Pop",
    filename: "presets/bubble.mp3",
    category: "preset",
    sortOrder: 23,
  },
  {
    name: "Stardust",
    filename: "presets/stardust.mp3",
    category: "preset",
    sortOrder: 24,
  },
  {
    name: "Radar",
    filename: "presets/radar.mp3",
    category: "preset",
    sortOrder: 25,
  },
  {
    name: "Doorbell",
    filename: "presets/doorbell.mp3",
    category: "preset",
    sortOrder: 26,
  },
  {
    name: "Sparkle",
    filename: "presets/sparkle.mp3",
    category: "preset",
    sortOrder: 27,
  },
  {
    name: "Rise",
    filename: "presets/rise.mp3",
    category: "preset",
    sortOrder: 28,
  },
  {
    name: "Crystal",
    filename: "presets/crystal.mp3",
    category: "preset",
    sortOrder: 29,
  },
  {
    name: "Vibe",
    filename: "presets/vibe.mp3",
    category: "preset",
    sortOrder: 30,
  },
  {
    name: "Inquiry",
    filename: "presets/inquiry.mp3",
    category: "preset",
    sortOrder: 31,
  },
  {
    name: "Success",
    filename: "presets/success.mp3",
    category: "preset",
    sortOrder: 32,
  },
  {
    name: "Sunset",
    filename: "presets/sunset.mp3",
    category: "preset",
    sortOrder: 33,
  },
  {
    name: "Curiosity",
    filename: "presets/curiosity.mp3",
    category: "preset",
    sortOrder: 34,
  },
  {
    name: "Swift",
    filename: "presets/swift.mp3",
    category: "preset",
    sortOrder: 35,
  },
  {
    name: "Celestial",
    filename: "presets/celestial.mp3",
    category: "preset",
    sortOrder: 36,
  },
  {
    name: "Clear",
    filename: "presets/clear.mp3",
    category: "preset",
    sortOrder: 37,
  },
];

export async function seedSoundPresets(): Promise<void> {
  console.log("🎵 Seeding notification sound presets...");

  for (const preset of DEFAULT_SOUND_PRESETS) {
    const existing = await db.query.notificationSoundPresetTable.findFirst({
      where: eq(notificationSoundPresetTable.filename, preset.filename),
      columns: { id: true },
    });

    if (existing) {
      await db
        .update(notificationSoundPresetTable)
        .set({
          name: preset.name,
          category: preset.category,
          sortOrder: preset.sortOrder,
        })
        .where(eq(notificationSoundPresetTable.id, existing.id));
      console.log(`  🔄 Updated: ${preset.name}`);
    } else {
      await db.insert(notificationSoundPresetTable).values({
        name: preset.name,
        filename: preset.filename,
        category: preset.category,
        sortOrder: preset.sortOrder,
      });
      console.log(`  ✅ Inserted: ${preset.name}`);
    }
  }

  console.log(`🎉 Seeded ${DEFAULT_SOUND_PRESETS.length} sound presets`);
}
