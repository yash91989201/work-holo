import type { db as Db } from "@work-holo/db";
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
    name: "Chime",
    filename: "chime.webm",
    category: "default",
    sortOrder: 1,
  },
  {
    name: "Bell",
    filename: "bell.webm",
    category: "default",
    sortOrder: 2,
  },
  {
    name: "Pop",
    filename: "pop.webm",
    category: "default",
    sortOrder: 3,
  },
  {
    name: "Ding",
    filename: "ding.webm",
    category: "default",
    sortOrder: 4,
  },
  {
    name: "Gentle",
    filename: "gentle.webm",
    category: "default",
    sortOrder: 5,
  },
  {
    name: "Alert",
    filename: "alert.webm",
    category: "default",
    sortOrder: 6,
  },
  {
    name: "Bubble",
    filename: "bubble.webm",
    category: "default",
    sortOrder: 7,
  },
  {
    name: "Wood",
    filename: "wood.webm",
    category: "default",
    sortOrder: 8,
  },
  {
    name: "Mention",
    filename: "mention.webm",
    category: "system",
    sortOrder: 9,
  },
  {
    name: "Notify",
    filename: "notify.webm",
    category: "system",
    sortOrder: 10,
  },
];

/**
 * Seeds the notification sound presets table with default sounds.
 * Uses upsert pattern — safe to call multiple times.
 */
export async function seedSoundPresets(database: typeof Db): Promise<void> {
  for (const preset of DEFAULT_SOUND_PRESETS) {
    const existing =
      await database.query.notificationSoundPresetTable.findFirst({
        where: eq(notificationSoundPresetTable.filename, preset.filename),
        columns: { id: true },
      });

    if (existing) {
      await database
        .update(notificationSoundPresetTable)
        .set({
          name: preset.name,
          category: preset.category,
          sortOrder: preset.sortOrder,
        })
        .where(eq(notificationSoundPresetTable.id, existing.id));
    } else {
      await database.insert(notificationSoundPresetTable).values({
        name: preset.name,
        filename: preset.filename,
        category: preset.category,
        sortOrder: preset.sortOrder,
      });
    }
  }
}

export { DEFAULT_SOUND_PRESETS };
