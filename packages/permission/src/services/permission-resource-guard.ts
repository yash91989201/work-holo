import { ORPCError } from "@orpc/server";
import type { db as Db } from "@work-holo/db";
import {
  channelMemberTable,
  channelTable,
  member,
  messageTable,
} from "@work-holo/db/schema/index";
import { and, eq } from "drizzle-orm";
import type { PermissionAction, PermissionDescriptor } from "../lib/types";
import type { PermissionChecker } from "./permission-checker";

/**
 * Applies resource-level preconditions before permission checks.
 */
export class PermissionResourceGuard {
  private readonly userId: string;
  private readonly orgId: string;
  private readonly db: typeof Db;
  private readonly checker: PermissionChecker;

  /**
   * Creates a resource guard bound to one user and organization.
   */
  constructor(
    userId: string,
    orgId: string,
    db: typeof Db,
    checker: PermissionChecker
  ) {
    this.userId = userId;
    this.orgId = orgId;
    this.db = db;
    this.checker = checker;
  }

  /**
   * Ensures the user can access a channel for the requested action.
   */
  async requireChannelAccess(
    channelId: string,
    action: PermissionAction | string
  ): Promise<void> {
    const channel = await this.db.query.channelTable.findFirst({
      where: eq(channelTable.id, channelId),
      columns: { organizationId: true, createdBy: true, teamId: true },
    });

    if (!channel) {
      throw new ORPCError("NOT_FOUND", {
        message: "Channel not found",
      });
    }

    if (channel.organizationId !== this.orgId) {
      throw new ORPCError("FORBIDDEN", {
        message: "Channel does not belong to your organization",
      });
    }

    const membership = await this.db.query.channelMemberTable.findFirst({
      where: and(
        eq(channelMemberTable.channelId, channelId),
        eq(channelMemberTable.userId, this.userId)
      ),
    });

    if (!membership) {
      const orgMembership = await this.db.query.member.findFirst({
        where: and(
          eq(member.organizationId, this.orgId),
          eq(member.userId, this.userId)
        ),
        columns: { role: true },
      });

      const isAdmin =
        orgMembership?.role === "owner" || orgMembership?.role === "admin";

      if (!isAdmin) {
        throw new ORPCError("FORBIDDEN", {
          message: "You are not a member of this channel",
        });
      }
    }

    const teamId = channel.teamId ?? undefined;
    let descriptor: PermissionDescriptor;

    if (typeof action === "function") {
      const baseDescriptor = action(channelId);
      if (teamId) {
        descriptor = this.checker.buildDescriptorFromKey(
          baseDescriptor.permissionKey,
          {
            resourceId: channelId,
            teamId,
          }
        );
      } else {
        descriptor = baseDescriptor;
      }
    } else {
      descriptor = this.checker.buildDescriptorFromKey(action, {
        resourceId: channelId,
        teamId,
      });
    }

    await this.checker.check(descriptor, {
      ownerId: channel.createdBy ?? undefined,
      teamId,
    });
  }

  /**
   * Ensures the user can access a message for the requested action.
   */
  async requireMessageAccess(
    messageId: string,
    action: PermissionAction | string
  ): Promise<void> {
    const message = await this.db.query.messageTable.findFirst({
      where: eq(messageTable.id, messageId),
      columns: { channelId: true, senderId: true },
    });

    if (!message) {
      throw new ORPCError("NOT_FOUND", {
        message: "Message not found",
      });
    }

    await this.requireChannelAccess(message.channelId, action);

    const descriptor =
      typeof action === "function"
        ? action(messageId)
        : this.checker.buildDescriptorFromKey(action, {
            resourceId: messageId,
          });

    await this.checker.check(descriptor, {
      ownerId: message.senderId ?? undefined,
    });
  }
}
