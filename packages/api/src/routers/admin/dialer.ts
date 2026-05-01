import { ORPCError } from "@orpc/server";
import type { db as dbClient } from "@work-holo/db";
import {
  agentExtensions,
  dialerAuditLog,
  didInventory,
  organization,
  sipTrunks,
  user,
} from "@work-holo/db/schema/index";
import { and, count, desc, eq, ilike, inArray, or } from "drizzle-orm";
import { z } from "zod";
import { adminProcedure } from "../../index";

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function writeAudit(
  db: typeof dbClient,
  opts: {
    entityType: string;
    entityId: string;
    action: string;
    changes?: unknown;
    performedBy: string;
  }
) {
  await db.insert(dialerAuditLog).values({
    entityType: opts.entityType,
    entityId: opts.entityId,
    action: opts.action,
    changes: opts.changes ? JSON.stringify(opts.changes) : null,
    performedBy: opts.performedBy,
  });
}

// ─── SIP Trunks ──────────────────────────────────────────────────────────────

const sipTrunkInput = z.object({
  name: z.string().min(1).max(100),
  provider: z.enum(["cloudbharat", "telnyx", "twilio", "custom"]),
  username: z.string().min(1),
  password: z.string().min(1),
  proxy: z.string().min(1),
  fromDomain: z.string().optional(),
  fromUser: z.string().optional(),
  register: z.boolean().default(true),
  expireSeconds: z.number().int().positive().default(60),
  pingInterval: z.number().int().positive().default(25),
  transport: z.enum(["udp", "tcp", "tls"]).default("udp"),
  isActive: z.boolean().default(true),
});

export const dialerAdminRouter = {
  // ── SIP Trunks ────────────────────────────────────────────────────────────

  listTrunks: adminProcedure
    .input(
      z.object({
        search: z.string().optional(),
        provider: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .handler(async ({ input, context }) => {
      const conditions = [];

      if (input.search) {
        conditions.push(
          or(
            ilike(sipTrunks.name, `%${input.search}%`),
            ilike(sipTrunks.proxy, `%${input.search}%`)
          )
        );
      }
      if (input.provider) {
        conditions.push(eq(sipTrunks.provider, input.provider));
      }
      if (input.isActive !== undefined) {
        conditions.push(eq(sipTrunks.isActive, input.isActive));
      }

      const trunks = await context.db
        .select({
          id: sipTrunks.id,
          name: sipTrunks.name,
          provider: sipTrunks.provider,
          proxy: sipTrunks.proxy,
          username: sipTrunks.username,
          register: sipTrunks.register,
          transport: sipTrunks.transport,
          expireSeconds: sipTrunks.expireSeconds,
          pingInterval: sipTrunks.pingInterval,
          isActive: sipTrunks.isActive,
          deploymentStatus: sipTrunks.deploymentStatus,
          deployedAt: sipTrunks.deployedAt,
          createdAt: sipTrunks.createdAt,
          updatedAt: sipTrunks.updatedAt,
        })
        .from(sipTrunks)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(sipTrunks.createdAt));

      // Get DID count per trunk
      const trunkIds = trunks.map((t) => t.id);
      const didCounts =
        trunkIds.length > 0
          ? await context.db
              .select({
                sipTrunkId: didInventory.sipTrunkId,
                didCount: count(),
              })
              .from(didInventory)
              .where(inArray(didInventory.sipTrunkId, trunkIds))
              .groupBy(didInventory.sipTrunkId)
          : [];

      const countMap = new Map(
        didCounts.map((d) => [d.sipTrunkId, d.didCount])
      );

      return trunks.map((t) => ({
        ...t,
        didCount: countMap.get(t.id) ?? 0,
      }));
    }),

  getTrunk: adminProcedure
    .input(z.object({ trunkId: z.string() }))
    .handler(async ({ input, context }) => {
      const trunk = await context.db.query.sipTrunks.findFirst({
        where: eq(sipTrunks.id, input.trunkId),
      });
      if (!trunk)
        throw new ORPCError("NOT_FOUND", { message: "Trunk not found" });
      // Mask password
      return { ...trunk, password: "••••••••" };
    }),

  createTrunk: adminProcedure
    .input(sipTrunkInput)
    .handler(async ({ input, context }) => {
      const existing = await context.db.query.sipTrunks.findFirst({
        where: eq(sipTrunks.name, input.name),
        columns: { id: true },
      });
      if (existing) {
        throw new ORPCError("CONFLICT", {
          message: "A trunk with this name already exists",
        });
      }

      const [trunk] = await context.db
        .insert(sipTrunks)
        .values({
          ...input,
          deploymentStatus: "pending",
          createdBy: context.session.user.id,
        })
        .returning({ id: sipTrunks.id, name: sipTrunks.name });

      if (!trunk)
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: "Failed to create trunk",
        });
      await writeAudit(context.db, {
        entityType: "sip_trunk",
        entityId: trunk.id,
        action: "created",
        changes: { name: input.name, provider: input.provider },
        performedBy: context.session.user.id,
      });

      return trunk;
    }),

  updateTrunk: adminProcedure
    .input(
      z.object({
        trunkId: z.string(),
        data: sipTrunkInput.partial(),
      })
    )
    .handler(async ({ input, context }) => {
      const trunk = await context.db.query.sipTrunks.findFirst({
        where: eq(sipTrunks.id, input.trunkId),
        columns: { id: true, name: true },
      });
      if (!trunk)
        throw new ORPCError("NOT_FOUND", { message: "Trunk not found" });

      // Check name uniqueness if changing name
      if (input.data.name && input.data.name !== trunk.name) {
        const nameConflict = await context.db.query.sipTrunks.findFirst({
          where: eq(sipTrunks.name, input.data.name),
          columns: { id: true },
        });
        if (nameConflict) {
          throw new ORPCError("CONFLICT", {
            message: "A trunk with this name already exists",
          });
        }
      }

      await context.db
        .update(sipTrunks)
        .set({ ...input.data, deploymentStatus: "pending" })
        .where(eq(sipTrunks.id, input.trunkId));

      await writeAudit(context.db, {
        entityType: "sip_trunk",
        entityId: input.trunkId,
        action: "updated",
        changes: input.data,
        performedBy: context.session.user.id,
      });

      return { success: true };
    }),

  deleteTrunk: adminProcedure
    .input(z.object({ trunkId: z.string() }))
    .handler(async ({ input, context }) => {
      const [didCount] = await context.db
        .select({ value: count() })
        .from(didInventory)
        .where(eq(didInventory.sipTrunkId, input.trunkId));

      if ((didCount?.value ?? 0) > 0) {
        throw new ORPCError("CONFLICT", {
          message: `Cannot delete: ${didCount?.value} DID(s) depend on this trunk`,
        });
      }

      await context.db.delete(sipTrunks).where(eq(sipTrunks.id, input.trunkId));

      await writeAudit(context.db, {
        entityType: "sip_trunk",
        entityId: input.trunkId,
        action: "deleted",
        performedBy: context.session.user.id,
      });

      return { success: true };
    }),

  // ── DID Inventory ─────────────────────────────────────────────────────────

  listDids: adminProcedure
    .input(
      z.object({
        search: z.string().optional(),
        status: z
          .enum(["available", "assigned", "retired", "blocked"])
          .optional(),
        sipTrunkId: z.string().optional(),
        organizationId: z.string().optional(),
      })
    )
    .handler(async ({ input, context }) => {
      const conditions = [];

      if (input.search) {
        conditions.push(
          or(
            ilike(didInventory.number, `%${input.search}%`),
            ilike(didInventory.friendlyName, `%${input.search}%`)
          )
        );
      }
      if (input.status) conditions.push(eq(didInventory.status, input.status));
      if (input.sipTrunkId)
        conditions.push(eq(didInventory.sipTrunkId, input.sipTrunkId));
      if (input.organizationId)
        conditions.push(eq(didInventory.organizationId, input.organizationId));

      const dids = await context.db
        .select({
          id: didInventory.id,
          number: didInventory.number,
          friendlyName: didInventory.friendlyName,
          sipTrunkId: didInventory.sipTrunkId,
          sipTrunkName: sipTrunks.name,
          sipTrunkProvider: sipTrunks.provider,
          organizationId: didInventory.organizationId,
          organizationName: organization.name,
          status: didInventory.status,
          destinationType: didInventory.destinationType,
          isActive: didInventory.isActive,
          recordingEnabled: didInventory.recordingEnabled,
          deploymentStatus: didInventory.deploymentStatus,
          assignedAt: didInventory.assignedAt,
          createdAt: didInventory.createdAt,
        })
        .from(didInventory)
        .leftJoin(sipTrunks, eq(didInventory.sipTrunkId, sipTrunks.id))
        .leftJoin(
          organization,
          eq(didInventory.organizationId, organization.id)
        )
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(didInventory.createdAt));

      return dids;
    }),

  getDid: adminProcedure
    .input(z.object({ didId: z.string() }))
    .handler(async ({ input, context }) => {
      const did = await context.db.query.didInventory.findFirst({
        where: eq(didInventory.id, input.didId),
        with: { sipTrunk: true, organization: true },
      });
      if (!did) throw new ORPCError("NOT_FOUND", { message: "DID not found" });
      return did;
    }),

  createDid: adminProcedure
    .input(
      z.object({
        number: z.string().min(7).max(20),
        friendlyName: z.string().optional(),
        sipTrunkId: z.string(),
      })
    )
    .handler(async ({ input, context }) => {
      const existing = await context.db.query.didInventory.findFirst({
        where: eq(didInventory.number, input.number),
        columns: { id: true },
      });
      if (existing) {
        throw new ORPCError("CONFLICT", {
          message: "DID number already exists in inventory",
        });
      }

      const trunk = await context.db.query.sipTrunks.findFirst({
        where: eq(sipTrunks.id, input.sipTrunkId),
        columns: { id: true },
      });
      if (!trunk) {
        throw new ORPCError("NOT_FOUND", { message: "SIP trunk not found" });
      }

      const [did] = await context.db
        .insert(didInventory)
        .values({
          number: input.number,
          friendlyName: input.friendlyName,
          sipTrunkId: input.sipTrunkId,
          status: "available",
          deploymentStatus: "undeployed",
          createdBy: context.session.user.id,
        })
        .returning({ id: didInventory.id, number: didInventory.number });

      if (!did)
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: "Failed to create DID",
        });
      await writeAudit(context.db, {
        entityType: "did",
        entityId: did.id,
        action: "created",
        changes: { number: input.number, sipTrunkId: input.sipTrunkId },
        performedBy: context.session.user.id,
      });

      return did;
    }),

  bulkCreateDids: adminProcedure
    .input(
      z.object({
        dids: z
          .array(
            z.object({
              number: z.string().min(7).max(20),
              friendlyName: z.string().optional(),
            })
          )
          .min(1)
          .max(500),
        sipTrunkId: z.string(),
      })
    )
    .handler(async ({ input, context }) => {
      const trunk = await context.db.query.sipTrunks.findFirst({
        where: eq(sipTrunks.id, input.sipTrunkId),
        columns: { id: true },
      });
      if (!trunk) {
        throw new ORPCError("NOT_FOUND", { message: "SIP trunk not found" });
      }

      const numbers = input.dids.map((d) => d.number);
      const duplicates = await context.db
        .select({ number: didInventory.number })
        .from(didInventory)
        .where(inArray(didInventory.number, numbers));

      if (duplicates.length > 0) {
        throw new ORPCError("CONFLICT", {
          message: `${duplicates.length} DID(s) already exist: ${duplicates.map((d) => d.number).join(", ")}`,
        });
      }

      const rows = input.dids.map((d) => ({
        number: d.number,
        friendlyName: d.friendlyName,
        sipTrunkId: input.sipTrunkId,
        status: "available" as const,
        deploymentStatus: "undeployed" as const,
        createdBy: context.session.user.id,
      }));

      await context.db.insert(didInventory).values(rows);

      await writeAudit(context.db, {
        entityType: "did",
        entityId: "bulk",
        action: "created",
        changes: { count: rows.length, sipTrunkId: input.sipTrunkId },
        performedBy: context.session.user.id,
      });

      return { created: rows.length };
    }),

  assignDid: adminProcedure
    .input(
      z.object({
        didId: z.string(),
        organizationId: z.string(),
      })
    )
    .handler(async ({ input, context }) => {
      const did = await context.db.query.didInventory.findFirst({
        where: eq(didInventory.id, input.didId),
        columns: { id: true, status: true, number: true },
      });
      if (!did) throw new ORPCError("NOT_FOUND", { message: "DID not found" });
      if (did.status !== "available") {
        throw new ORPCError("CONFLICT", {
          message: `DID is not available (current status: ${did.status})`,
        });
      }

      const org = await context.db.query.organization.findFirst({
        where: eq(organization.id, input.organizationId),
        columns: { id: true, name: true },
      });
      if (!org) {
        throw new ORPCError("NOT_FOUND", { message: "Organization not found" });
      }

      await context.db
        .update(didInventory)
        .set({
          organizationId: input.organizationId,
          status: "assigned",
          assignedAt: new Date(),
        })
        .where(eq(didInventory.id, input.didId));

      await writeAudit(context.db, {
        entityType: "did",
        entityId: input.didId,
        action: "assigned",
        changes: { organizationId: input.organizationId, orgName: org.name },
        performedBy: context.session.user.id,
      });

      return { success: true };
    }),

  unassignDid: adminProcedure
    .input(z.object({ didId: z.string() }))
    .handler(async ({ input, context }) => {
      const did = await context.db.query.didInventory.findFirst({
        where: eq(didInventory.id, input.didId),
        columns: { id: true, status: true, organizationId: true },
      });
      if (!did) throw new ORPCError("NOT_FOUND", { message: "DID not found" });
      if (did.status !== "assigned") {
        throw new ORPCError("CONFLICT", { message: "DID is not assigned" });
      }

      await context.db
        .update(didInventory)
        .set({
          organizationId: null,
          status: "available",
          assignedAt: null,
          destinationType: null,
          destinationTarget: null,
          isActive: false,
          deploymentStatus: "undeployed",
        })
        .where(eq(didInventory.id, input.didId));

      await writeAudit(context.db, {
        entityType: "did",
        entityId: input.didId,
        action: "unassigned",
        changes: { previousOrgId: did.organizationId },
        performedBy: context.session.user.id,
      });

      return { success: true };
    }),

  retireDid: adminProcedure
    .input(z.object({ didId: z.string() }))
    .handler(async ({ input, context }) => {
      await context.db
        .update(didInventory)
        .set({
          status: "retired",
          isActive: false,
          deploymentStatus: "undeployed",
        })
        .where(eq(didInventory.id, input.didId));

      await writeAudit(context.db, {
        entityType: "did",
        entityId: input.didId,
        action: "deleted",
        performedBy: context.session.user.id,
      });

      return { success: true };
    }),

  // ── Agent Extensions ──────────────────────────────────────────────────────

  listExtensions: adminProcedure
    .input(
      z.object({
        search: z.string().optional(),
        organizationId: z.string().optional(),
      })
    )
    .handler(async ({ input, context }) => {
      const conditions = [];

      if (input.search) {
        conditions.push(
          or(
            ilike(agentExtensions.extension, `%${input.search}%`),
            ilike(agentExtensions.callerIdName, `%${input.search}%`)
          )
        );
      }
      if (input.organizationId) {
        conditions.push(
          eq(agentExtensions.organizationId, input.organizationId)
        );
      }

      return context.db
        .select({
          id: agentExtensions.id,
          extension: agentExtensions.extension,
          callerIdName: agentExtensions.callerIdName,
          callerIdNumber: agentExtensions.callerIdNumber,
          organizationId: agentExtensions.organizationId,
          organizationName: organization.name,
          userId: agentExtensions.userId,
          userName: user.name,
          context: agentExtensions.context,
          isActive: agentExtensions.isActive,
          deploymentStatus: agentExtensions.deploymentStatus,
          deployedAt: agentExtensions.deployedAt,
          createdAt: agentExtensions.createdAt,
        })
        .from(agentExtensions)
        .leftJoin(
          organization,
          eq(agentExtensions.organizationId, organization.id)
        )
        .leftJoin(user, eq(agentExtensions.userId, user.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(agentExtensions.extension);
    }),

  getExtension: adminProcedure
    .input(z.object({ extensionId: z.string() }))
    .handler(async ({ input, context }) => {
      const ext = await context.db.query.agentExtensions.findFirst({
        where: eq(agentExtensions.id, input.extensionId),
      });
      if (!ext)
        throw new ORPCError("NOT_FOUND", { message: "Extension not found" });
      return { ...ext, password: "••••••••" };
    }),

  createExtension: adminProcedure
    .input(
      z.object({
        extension: z.string().min(1).max(20),
        password: z.string().min(6),
        callerIdName: z.string().min(1),
        callerIdNumber: z.string().min(7),
        organizationId: z.string().optional(),
        userId: z.string().optional(),
        context: z.string().default("default"),
        tollAllow: z.string().default("domestic,international,local"),
        isActive: z.boolean().default(true),
      })
    )
    .handler(async ({ input, context }) => {
      const existing = await context.db.query.agentExtensions.findFirst({
        where: eq(agentExtensions.extension, input.extension),
        columns: { id: true },
      });
      if (existing) {
        throw new ORPCError("CONFLICT", {
          message: `Extension ${input.extension} already exists`,
        });
      }

      const [ext] = await context.db
        .insert(agentExtensions)
        .values({
          ...input,
          deploymentStatus: "pending",
          createdBy: context.session.user.id,
        })
        .returning({
          id: agentExtensions.id,
          extension: agentExtensions.extension,
        });

      if (!ext)
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: "Failed to create extension",
        });
      await writeAudit(context.db, {
        entityType: "agent_extension",
        entityId: ext.id,
        action: "created",
        changes: {
          extension: input.extension,
          callerIdName: input.callerIdName,
        },
        performedBy: context.session.user.id,
      });

      return ext;
    }),

  updateExtension: adminProcedure
    .input(
      z.object({
        extensionId: z.string(),
        data: z
          .object({
            password: z.string().min(6).optional(),
            callerIdName: z.string().min(1).optional(),
            callerIdNumber: z.string().min(7).optional(),
            organizationId: z.string().nullable().optional(),
            userId: z.string().nullable().optional(),
            context: z.string().optional(),
            tollAllow: z.string().optional(),
            isActive: z.boolean().optional(),
          })
          .partial(),
      })
    )
    .handler(async ({ input, context }) => {
      const ext = await context.db.query.agentExtensions.findFirst({
        where: eq(agentExtensions.id, input.extensionId),
        columns: { id: true },
      });
      if (!ext)
        throw new ORPCError("NOT_FOUND", { message: "Extension not found" });

      await context.db
        .update(agentExtensions)
        .set({ ...input.data, deploymentStatus: "pending" })
        .where(eq(agentExtensions.id, input.extensionId));

      await writeAudit(context.db, {
        entityType: "agent_extension",
        entityId: input.extensionId,
        action: "updated",
        changes: input.data,
        performedBy: context.session.user.id,
      });

      return { success: true };
    }),

  deleteExtension: adminProcedure
    .input(z.object({ extensionId: z.string() }))
    .handler(async ({ input, context }) => {
      await context.db
        .delete(agentExtensions)
        .where(eq(agentExtensions.id, input.extensionId));

      await writeAudit(context.db, {
        entityType: "agent_extension",
        entityId: input.extensionId,
        action: "deleted",
        performedBy: context.session.user.id,
      });

      return { success: true };
    }),

  // ── Server Status ─────────────────────────────────────────────────────────

  getServerStatus: adminProcedure.handler(async ({ context }) => {
    const VPS_IP = "135.181.31.20";

    // Check if VPS is reachable via TCP on port 22 (SSH — always open on the server)
    const vpsReachable = await new Promise<boolean>((resolve) => {
      const net = require("node:net");
      const socket = new net.Socket();
      const timeout = 3000;

      socket.setTimeout(timeout);
      socket.once("connect", () => {
        socket.destroy();
        resolve(true);
      });
      socket.once("timeout", () => {
        socket.destroy();
        resolve(false);
      });
      socket.once("error", () => {
        resolve(false);
      });
      socket.connect(22, VPS_IP);
    });

    const [trunkCount] = await context.db
      .select({ value: count() })
      .from(sipTrunks);
    const [didCount] = await context.db
      .select({ value: count() })
      .from(didInventory);
    const [extensionCount] = await context.db
      .select({ value: count() })
      .from(agentExtensions);
    const [pendingCount] = await context.db
      .select({ value: count() })
      .from(sipTrunks)
      .where(eq(sipTrunks.deploymentStatus, "pending"));

    return {
      vpsIp: VPS_IP,
      vpsReachable,
      eslStatus: "not_connected" as const, // Will be "connected" once SIP Worker is wired (Phase 2)
      trunkCount: trunkCount?.value ?? 0,
      didCount: didCount?.value ?? 0,
      extensionCount: extensionCount?.value ?? 0,
      pendingDeployments: pendingCount?.value ?? 0,
    };
  }),

  // ── Audit Log ─────────────────────────────────────────────────────────────

  getAuditLog: adminProcedure
    .input(
      z.object({
        entityType: z.string().optional(),
        entityId: z.string().optional(),
        limit: z.number().int().positive().max(100).default(50),
        offset: z.number().int().min(0).default(0),
      })
    )
    .handler(async ({ input, context }) => {
      const conditions = [];
      if (input.entityType)
        conditions.push(eq(dialerAuditLog.entityType, input.entityType));
      if (input.entityId)
        conditions.push(eq(dialerAuditLog.entityId, input.entityId));

      return context.db
        .select({
          id: dialerAuditLog.id,
          entityType: dialerAuditLog.entityType,
          entityId: dialerAuditLog.entityId,
          action: dialerAuditLog.action,
          changes: dialerAuditLog.changes,
          performedBy: dialerAuditLog.performedBy,
          performerName: user.name,
          performerEmail: user.email,
          createdAt: dialerAuditLog.createdAt,
        })
        .from(dialerAuditLog)
        .leftJoin(user, eq(dialerAuditLog.performedBy, user.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(dialerAuditLog.createdAt))
        .limit(input.limit)
        .offset(input.offset);
    }),
};
