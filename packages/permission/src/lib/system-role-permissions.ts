import { type PermissionKey, SYSTEM_ROLES, type SystemRole } from "./types";
import { PERMISSIONS } from "./vocabulary";

const ALL_KEYS = PERMISSIONS.map((permission) => permission.key);
const ATTENDANCE_KEYS = ALL_KEYS.filter((key) => key.startsWith("attendance."));

const MEMBER_CHANNEL_KEYS: PermissionKey[] = [
  "channel.list",
  "channel.read",
  "channel.member.list",
  "channel.member.read",
  "channel.message.create",
  "channel.message.delete",
  "channel.message.list",
  "channel.message.mention.channel",
  "channel.message.mention.user",
  "channel.message.pin",
  "channel.message.react",
  "channel.message.read",
  "channel.message.reader.list",
  "channel.message.reply",
  "channel.message.update",
];

const MEMBER_ATTENDANCE_KEYS = ATTENDANCE_KEYS.filter(
  (key) =>
    key.endsWith(".read") || key.endsWith(".list") || key.endsWith(".create")
);

export const SYSTEM_ROLE_PERMISSIONS: Record<SystemRole, PermissionKey[]> = {
  [SYSTEM_ROLES.OWNER]: ALL_KEYS,
  [SYSTEM_ROLES.ADMIN]: ALL_KEYS.filter(
    (key) => !(key === "org.delete" || key === "org.create")
  ),
  [SYSTEM_ROLES.MEMBER]: [
    ...MEMBER_CHANNEL_KEYS,
    ...MEMBER_ATTENDANCE_KEYS,
    "org.read",
    "org.active.read",
    "org.active.switch",
    "team.read",
    "team.member.read",
    "team.module.access",
  ],
};
