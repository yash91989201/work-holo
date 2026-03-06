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
  // System sounds (webm)
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
  // WebM presets
  {
    name: "Chime",
    filename: "chime.webm",
    category: "default",
    sortOrder: 10,
  },
  {
    name: "Bell",
    filename: "bell.webm",
    category: "default",
    sortOrder: 11,
  },
  {
    name: "Pop",
    filename: "pop.webm",
    category: "default",
    sortOrder: 12,
  },
  {
    name: "Ding",
    filename: "ding.webm",
    category: "default",
    sortOrder: 13,
  },
  {
    name: "Gentle",
    filename: "gentle.webm",
    category: "default",
    sortOrder: 14,
  },
  {
    name: "Alert",
    filename: "alert.webm",
    category: "default",
    sortOrder: 15,
  },
  {
    name: "Bubble",
    filename: "bubble.webm",
    category: "default",
    sortOrder: 16,
  },
  {
    name: "Wood",
    filename: "wood.webm",
    category: "default",
    sortOrder: 17,
  },
  // MP3 presets (in presets/ folder)
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
