import type { VocabularyEntry } from "../lib/types";
import type { PermissionKeyFromDSL } from "./dsl/keys";

/**
 * Canonical permission vocabulary with stable bit-index assignment.
 */

const VOCABULARY: VocabularyEntry[] = [
  {
    key: "attendance.record.create",
    resource: "attendance",
    subResources: ["record"],
    action: "create",
    bitIndex: 0,
  },
  {
    key: "attendance.record.read",
    resource: "attendance",
    subResources: ["record"],
    action: "read",
    bitIndex: 1,
  },
  {
    key: "attendance.record.update",
    resource: "attendance",
    subResources: ["record"],
    action: "update",
    bitIndex: 2,
  },
  {
    key: "attendance.record.delete",
    resource: "attendance",
    subResources: ["record"],
    action: "delete",
    bitIndex: 3,
  },
  {
    key: "attendance.record.list",
    resource: "attendance",
    subResources: ["record"],
    action: "list",
    bitIndex: 4,
  },

  {
    key: "channel.create",
    resource: "channel",
    subResources: [],
    action: "create",
    bitIndex: 5,
  },
  {
    key: "channel.read",
    resource: "channel",
    subResources: [],
    action: "read",
    bitIndex: 6,
  },
  {
    key: "channel.update",
    resource: "channel",
    subResources: [],
    action: "update",
    bitIndex: 7,
  },
  {
    key: "channel.delete",
    resource: "channel",
    subResources: [],
    action: "delete",
    bitIndex: 8,
  },
  {
    key: "channel.list",
    resource: "channel",
    subResources: [],
    action: "list",
    bitIndex: 9,
  },
  {
    key: "channel.member.add",
    resource: "channel",
    subResources: ["member"],
    action: "add",
    bitIndex: 10,
  },
  {
    key: "channel.member.remove",
    resource: "channel",
    subResources: ["member"],
    action: "remove",
    bitIndex: 11,
  },
  {
    key: "channel.member.read",
    resource: "channel",
    subResources: ["member"],
    action: "read",
    bitIndex: 12,
  },
  {
    key: "channel.member.list",
    resource: "channel",
    subResources: ["member"],
    action: "list",
    bitIndex: 13,
  },
  {
    key: "channel.message.create",
    resource: "channel",
    subResources: ["message"],
    action: "create",
    bitIndex: 14,
  },
  {
    key: "channel.message.read",
    resource: "channel",
    subResources: ["message"],
    action: "read",
    bitIndex: 15,
  },
  {
    key: "channel.message.update",
    resource: "channel",
    subResources: ["message"],
    action: "update",
    bitIndex: 16,
  },
  {
    key: "channel.message.delete",
    resource: "channel",
    subResources: ["message"],
    action: "delete",
    bitIndex: 17,
  },
  {
    key: "channel.message.list",
    resource: "channel",
    subResources: ["message"],
    action: "list",
    bitIndex: 18,
  },
  {
    key: "channel.message.react",
    resource: "channel",
    subResources: ["message"],
    action: "react",
    bitIndex: 19,
  },
  {
    key: "channel.message.pin",
    resource: "channel",
    subResources: ["message"],
    action: "pin",
    bitIndex: 20,
  },
  {
    key: "channel.message.reply",
    resource: "channel",
    subResources: ["message"],
    action: "reply",
    bitIndex: 21,
  },
  {
    key: "channel.message.mention.user",
    resource: "channel",
    subResources: ["message", "mention"],
    action: "mention.user",
    bitIndex: 22,
  },
  {
    key: "channel.message.mention.channel",
    resource: "channel",
    subResources: ["message", "mention"],
    action: "mention.channel",
    bitIndex: 23,
  },
  {
    key: "channel.message.reader.list",
    resource: "channel",
    subResources: ["message", "reader"],
    action: "list",
    bitIndex: 24,
  },

  {
    key: "org.create",
    resource: "org",
    subResources: [],
    action: "create",
    bitIndex: 25,
  },
  {
    key: "org.read",
    resource: "org",
    subResources: [],
    action: "read",
    bitIndex: 26,
  },
  {
    key: "org.update",
    resource: "org",
    subResources: [],
    action: "update",
    bitIndex: 27,
  },
  {
    key: "org.delete",
    resource: "org",
    subResources: [],
    action: "delete",
    bitIndex: 28,
  },
  {
    key: "org.list",
    resource: "org",
    subResources: [],
    action: "list",
    bitIndex: 29,
  },
  {
    key: "org.active.read",
    resource: "org",
    subResources: ["active"],
    action: "read",
    bitIndex: 30,
  },
  {
    key: "org.active.switch",
    resource: "org",
    subResources: ["active"],
    action: "switch",
    bitIndex: 31,
  },
  {
    key: "org.invite.create",
    resource: "org",
    subResources: ["invite"],
    action: "create",
    bitIndex: 32,
  },
  {
    key: "org.invite.read",
    resource: "org",
    subResources: ["invite"],
    action: "read",
    bitIndex: 33,
  },
  {
    key: "org.invite.update",
    resource: "org",
    subResources: ["invite"],
    action: "update",
    bitIndex: 34,
  },
  {
    key: "org.invite.delete",
    resource: "org",
    subResources: ["invite"],
    action: "delete",
    bitIndex: 35,
  },
  {
    key: "org.invite.list",
    resource: "org",
    subResources: ["invite"],
    action: "list",
    bitIndex: 36,
  },
  {
    key: "org.invite.resend",
    resource: "org",
    subResources: ["invite"],
    action: "resend",
    bitIndex: 37,
  },
  {
    key: "org.role.create",
    resource: "org",
    subResources: ["role"],
    action: "create",
    bitIndex: 38,
  },
  {
    key: "org.role.read",
    resource: "org",
    subResources: ["role"],
    action: "read",
    bitIndex: 39,
  },
  {
    key: "org.role.update",
    resource: "org",
    subResources: ["role"],
    action: "update",
    bitIndex: 40,
  },
  {
    key: "org.role.delete",
    resource: "org",
    subResources: ["role"],
    action: "delete",
    bitIndex: 41,
  },
  {
    key: "org.role.list",
    resource: "org",
    subResources: ["role"],
    action: "list",
    bitIndex: 42,
  },
  {
    key: "org.role.assign",
    resource: "org",
    subResources: ["role"],
    action: "assign",
    bitIndex: 43,
  },
  {
    key: "org.role.remove",
    resource: "org",
    subResources: ["role"],
    action: "remove",
    bitIndex: 44,
  },

  {
    key: "team.create",
    resource: "team",
    subResources: [],
    action: "create",
    bitIndex: 45,
  },
  {
    key: "team.read",
    resource: "team",
    subResources: [],
    action: "read",
    bitIndex: 46,
  },
  {
    key: "team.update",
    resource: "team",
    subResources: [],
    action: "update",
    bitIndex: 47,
  },
  {
    key: "team.delete",
    resource: "team",
    subResources: [],
    action: "delete",
    bitIndex: 48,
  },
  {
    key: "team.list",
    resource: "team",
    subResources: [],
    action: "list",
    bitIndex: 49,
  },
  {
    key: "team.member.add",
    resource: "team",
    subResources: ["member"],
    action: "add",
    bitIndex: 50,
  },
  {
    key: "team.member.remove",
    resource: "team",
    subResources: ["member"],
    action: "remove",
    bitIndex: 51,
  },
  {
    key: "team.member.read",
    resource: "team",
    subResources: ["member"],
    action: "read",
    bitIndex: 52,
  },
  {
    key: "team.member.list",
    resource: "team",
    subResources: ["member"],
    action: "list",
    bitIndex: 53,
  },
  {
    key: "team.role.create",
    resource: "team",
    subResources: ["role"],
    action: "create",
    bitIndex: 54,
  },
  {
    key: "team.role.read",
    resource: "team",
    subResources: ["role"],
    action: "read",
    bitIndex: 55,
  },
  {
    key: "team.role.update",
    resource: "team",
    subResources: ["role"],
    action: "update",
    bitIndex: 56,
  },
  {
    key: "team.role.delete",
    resource: "team",
    subResources: ["role"],
    action: "delete",
    bitIndex: 57,
  },
  {
    key: "team.role.list",
    resource: "team",
    subResources: ["role"],
    action: "list",
    bitIndex: 58,
  },
  {
    key: "team.role.assign",
    resource: "team",
    subResources: ["role"],
    action: "assign",
    bitIndex: 59,
  },
  {
    key: "team.role.remove",
    resource: "team",
    subResources: ["role"],
    action: "remove",
    bitIndex: 60,
  },
  {
    key: "team.module.enable",
    resource: "team",
    subResources: ["module"],
    action: "enable",
    bitIndex: 61,
  },
  {
    key: "team.module.disable",
    resource: "team",
    subResources: ["module"],
    action: "disable",
    bitIndex: 62,
  },
  {
    key: "team.module.access",
    resource: "team",
    subResources: ["module"],
    action: "access",
    bitIndex: 63,
  },
];

/**
 * Sorted list of all permission vocabulary entries by key.
 */
export const PERMISSIONS: VocabularyEntry[] = VOCABULARY.sort((a, b) =>
  a.key.localeCompare(b.key)
);

/**
 * Map of permission keys to their vocabulary entries for O(1) lookup.
 */
export const PERMISSION_BY_KEY = new Map<string, VocabularyEntry>(
  PERMISSIONS.map((p) => [p.key, p])
);

/**
 * Map of bit indices to their vocabulary entries for O(1) lookup.
 */
export const PERMISSION_BY_BIT_INDEX = new Map<number, VocabularyEntry>(
  PERMISSIONS.map((p) => [p.bitIndex, p])
);

/**
 * Total count of permissions in the vocabulary.
 */
export const TOTAL_PERMISSIONS = PERMISSIONS.length;

/**
 * Returns a permission vocabulary entry by key.
 */
export function getPermission(key: string): VocabularyEntry | undefined {
  return PERMISSION_BY_KEY.get(key);
}

/**
 * Returns the bit index for a key, or -1 when unknown.
 */
export function getBitIndex(key: string): number {
  return PERMISSION_BY_KEY.get(key)?.bitIndex ?? -1;
}

export type PermissionKeyLiteral = PermissionKeyFromDSL;
