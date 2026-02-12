import type { VocabularyEntry } from "../lib/types";

/**
 * IMPORTANT: Bitset index stability rules
 *
 * Each entry has an explicit `bitIndex` that MUST remain stable forever.
 * Changing an existing bitIndex silently invalidates all cached bitsets.
 *
 * Rules:
 * 1. NEVER change an existing entry's bitIndex
 * 2. NEVER reorder entries to change bitIndex assignments
 * 3. New entries MUST use the next available bitIndex (append-only)
 * 4. Deleted entries should be commented out, not removed (to reserve the index)
 *
 * The next available bitIndex is: 59
 */

const VOCABULARY: VocabularyEntry[] = [
  // ── attendance ──
  {
    key: "attendance.record.create",
    resource: "attendance",
    subResource: "record",
    action: "create",
    bitIndex: 0,
    description: "Create attendance records",
  },
  {
    key: "attendance.record.delete",
    resource: "attendance",
    subResource: "record",
    action: "delete",
    bitIndex: 1,
    description: "Delete attendance records",
  },
  {
    key: "attendance.record.list",
    resource: "attendance",
    subResource: "record",
    action: "list",
    bitIndex: 2,
    description: "List attendance records",
  },
  {
    key: "attendance.record.update",
    resource: "attendance",
    subResource: "record",
    action: "update",
    bitIndex: 3,
    description: "Update attendance records",
  },
  {
    key: "attendance.record.view",
    resource: "attendance",
    subResource: "record",
    action: "view",
    bitIndex: 4,
    description: "View attendance records",
  },

  // ── channel ──
  {
    key: "channel.create",
    resource: "channel",
    subResource: "",
    action: "create",
    bitIndex: 5,
    description: "Create channels",
  },
  {
    key: "channel.delete",
    resource: "channel",
    subResource: "",
    action: "delete",
    bitIndex: 6,
    description: "Delete channels",
  },
  {
    key: "channel.member.add",
    resource: "channel",
    subResource: "member",
    action: "add",
    bitIndex: 49,
    description: "Add members to channels",
  },
  {
    key: "channel.member.list",
    resource: "channel",
    subResource: "member",
    action: "list",
    bitIndex: 50,
    description: "List channel members",
  },
  {
    key: "channel.member.remove",
    resource: "channel",
    subResource: "member",
    action: "remove",
    bitIndex: 51,
    description: "Remove members from channels",
  },
  {
    key: "channel.member.search",
    resource: "channel",
    subResource: "member",
    action: "search",
    bitIndex: 52,
    description: "Search channel members",
  },
  {
    key: "channel.update",
    resource: "channel",
    subResource: "",
    action: "update",
    bitIndex: 7,
    description: "Update channel settings",
  },
  {
    key: "channel.view",
    resource: "channel",
    subResource: "",
    action: "view",
    bitIndex: 8,
    description: "View channel details",
  },

  // ── message ──
  {
    key: "message.create",
    resource: "message",
    subResource: "",
    action: "create",
    bitIndex: 9,
    description: "Send messages",
  },
  {
    key: "message.delete",
    resource: "message",
    subResource: "",
    action: "delete",
    bitIndex: 10,
    description: "Delete messages",
  },
  {
    key: "message.list",
    resource: "message",
    subResource: "",
    action: "list",
    bitIndex: 53,
    description: "List messages in a channel",
  },
  {
    key: "message.mention.channel",
    resource: "message",
    subResource: "mention",
    action: "mention.channel",
    bitIndex: 11,
    description: "Mention entire channel",
  },
  {
    key: "message.mention.user",
    resource: "message",
    subResource: "mention",
    action: "mention.user",
    bitIndex: 12,
    description: "Mention users in messages",
  },
  {
    key: "message.pin",
    resource: "message",
    subResource: "",
    action: "pin",
    bitIndex: 13,
    description: "Pin messages",
  },
  {
    key: "message.pin.list",
    resource: "message",
    subResource: "pin",
    action: "list",
    bitIndex: 54,
    description: "List pinned messages",
  },
  {
    key: "message.react",
    resource: "message",
    subResource: "",
    action: "react",
    bitIndex: 14,
    description: "React to messages",
  },
  {
    key: "message.read",
    resource: "message",
    subResource: "",
    action: "read",
    bitIndex: 55,
    description: "Mark messages as read",
  },
  {
    key: "message.readers.list",
    resource: "message",
    subResource: "readers",
    action: "list",
    bitIndex: 56,
    description: "List message readers",
  },
  {
    key: "message.search",
    resource: "message",
    subResource: "",
    action: "search",
    bitIndex: 57,
    description: "Search messages",
  },
  {
    key: "message.unread_count",
    resource: "message",
    subResource: "",
    action: "unread_count",
    bitIndex: 58,
    description: "Get unread message count",
  },
  {
    key: "message.update",
    resource: "message",
    subResource: "",
    action: "update",
    bitIndex: 15,
    description: "Update messages",
  },
  {
    key: "message.view",
    resource: "message",
    subResource: "",
    action: "view",
    bitIndex: 16,
    description: "View message details",
  },

  // ── module ──
  {
    key: "module.access",
    resource: "module",
    subResource: "",
    action: "access",
    bitIndex: 17,
    description: "Access a module",
  },

  // ── org ──
  {
    key: "org.context.switch",
    resource: "org",
    subResource: "context",
    action: "switch",
    bitIndex: 18,
    description: "Switch organization context",
  },
  {
    key: "org.context.view",
    resource: "org",
    subResource: "context",
    action: "view",
    bitIndex: 19,
    description: "View organization context",
  },
  {
    key: "org.create",
    resource: "org",
    subResource: "",
    action: "create",
    bitIndex: 20,
    description: "Create organizations",
  },
  {
    key: "org.delete",
    resource: "org",
    subResource: "",
    action: "delete",
    bitIndex: 21,
    description: "Delete organizations",
  },
  {
    key: "org.invite.create",
    resource: "org",
    subResource: "invite",
    action: "create",
    bitIndex: 22,
    description: "Create organization invitations",
  },
  {
    key: "org.invite.delete",
    resource: "org",
    subResource: "invite",
    action: "delete",
    bitIndex: 23,
    description: "Delete organization invitations",
  },
  {
    key: "org.invite.list",
    resource: "org",
    subResource: "invite",
    action: "list",
    bitIndex: 24,
    description: "List organization invitations",
  },
  {
    key: "org.invite.resend",
    resource: "org",
    subResource: "invite",
    action: "resend",
    bitIndex: 25,
    description: "Resend organization invitations",
  },
  {
    key: "org.invite.update",
    resource: "org",
    subResource: "invite",
    action: "update",
    bitIndex: 26,
    description: "Update organization invitations",
  },
  {
    key: "org.invite.view",
    resource: "org",
    subResource: "invite",
    action: "view",
    bitIndex: 27,
    description: "View organization invitation details",
  },
  {
    key: "org.list",
    resource: "org",
    subResource: "",
    action: "list",
    bitIndex: 28,
    description: "List organizations",
  },
  {
    key: "org.role.create",
    resource: "org",
    subResource: "role",
    action: "create",
    bitIndex: 29,
    description: "Create organization roles",
  },
  {
    key: "org.role.delete",
    resource: "org",
    subResource: "role",
    action: "delete",
    bitIndex: 30,
    description: "Delete organization roles",
  },
  {
    key: "org.role.list",
    resource: "org",
    subResource: "role",
    action: "list",
    bitIndex: 31,
    description: "List organization roles",
  },
  {
    key: "org.role.update",
    resource: "org",
    subResource: "role",
    action: "update",
    bitIndex: 32,
    description: "Update organization roles",
  },
  {
    key: "org.role.view",
    resource: "org",
    subResource: "role",
    action: "view",
    bitIndex: 33,
    description: "View organization role details",
  },
  {
    key: "org.update",
    resource: "org",
    subResource: "",
    action: "update",
    bitIndex: 34,
    description: "Update organization settings",
  },
  {
    key: "org.view",
    resource: "org",
    subResource: "",
    action: "view",
    bitIndex: 35,
    description: "View organization details",
  },

  // ── team ──
  {
    key: "team.create",
    resource: "team",
    subResource: "",
    action: "create",
    bitIndex: 36,
    description: "Create teams",
  },
  {
    key: "team.delete",
    resource: "team",
    subResource: "",
    action: "delete",
    bitIndex: 37,
    description: "Delete teams",
  },
  {
    key: "team.member.add",
    resource: "team",
    subResource: "member",
    action: "add",
    bitIndex: 38,
    description: "Add members to teams",
  },
  {
    key: "team.member.remove",
    resource: "team",
    subResource: "member",
    action: "remove",
    bitIndex: 39,
    description: "Remove members from teams",
  },
  {
    key: "team.member.view",
    resource: "team",
    subResource: "member",
    action: "view",
    bitIndex: 40,
    description: "View team member details",
  },
  {
    key: "team.module.disable",
    resource: "team",
    subResource: "module",
    action: "disable",
    bitIndex: 41,
    description: "Disable modules for teams",
  },
  {
    key: "team.module.enable",
    resource: "team",
    subResource: "module",
    action: "enable",
    bitIndex: 42,
    description: "Enable modules for teams",
  },
  {
    key: "team.role.assign",
    resource: "team",
    subResource: "role",
    action: "assign",
    bitIndex: 43,
    description: "Assign team roles",
  },
  {
    key: "team.role.create",
    resource: "team",
    subResource: "role",
    action: "create",
    bitIndex: 44,
    description: "Create team roles",
  },
  {
    key: "team.role.delete",
    resource: "team",
    subResource: "role",
    action: "delete",
    bitIndex: 45,
    description: "Delete team roles",
  },
  {
    key: "team.role.update",
    resource: "team",
    subResource: "role",
    action: "update",
    bitIndex: 46,
    description: "Update team roles",
  },
  {
    key: "team.update",
    resource: "team",
    subResource: "",
    action: "update",
    bitIndex: 47,
    description: "Update team settings",
  },
  {
    key: "team.view",
    resource: "team",
    subResource: "",
    action: "view",
    bitIndex: 48,
    description: "View team details",
  },
];

export const PERMISSIONS: VocabularyEntry[] = VOCABULARY.sort((a, b) =>
  a.key.localeCompare(b.key)
);

export const PERMISSION_BY_KEY = new Map<string, VocabularyEntry>(
  PERMISSIONS.map((p) => [p.key, p])
);

export const PERMISSION_BY_BIT_INDEX = new Map<number, VocabularyEntry>(
  PERMISSIONS.map((p) => [p.bitIndex, p])
);

export const TOTAL_PERMISSIONS = PERMISSIONS.length;

export function getPermission(key: string): VocabularyEntry | undefined {
  return PERMISSION_BY_KEY.get(key);
}

export function getBitIndex(key: string): number {
  return PERMISSION_BY_KEY.get(key)?.bitIndex ?? -1;
}

export type PermissionKeyLiteral = (typeof PERMISSIONS)[number]["key"];
