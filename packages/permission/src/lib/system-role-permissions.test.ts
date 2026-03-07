import { describe, expect, test } from "bun:test";
import { SYSTEM_ROLE_PERMISSIONS } from "./system-role-permissions";
import { SYSTEM_ROLES } from "./types";

describe("SYSTEM_ROLE_PERMISSIONS", () => {
  test("member role does not grant channel membership management", () => {
    const memberPermissions = SYSTEM_ROLE_PERMISSIONS[SYSTEM_ROLES.MEMBER];

    expect(memberPermissions).not.toContain("channel.member.add");
    expect(memberPermissions).not.toContain("channel.member.remove");
  });

  test("member role only grants the approved channel permissions", () => {
    const memberPermissions = SYSTEM_ROLE_PERMISSIONS[
      SYSTEM_ROLES.MEMBER
    ].filter((permission) => permission.startsWith("channel."));

    expect(memberPermissions).toEqual([
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
    ]);
  });

  test("member role still grants channel membership visibility", () => {
    const memberPermissions = SYSTEM_ROLE_PERMISSIONS[SYSTEM_ROLES.MEMBER];

    expect(memberPermissions).toContain("channel.member.list");
    expect(memberPermissions).toContain("channel.member.read");
  });
});
