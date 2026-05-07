import { organization, user } from "@work-holo/db/schema/auth";
import { callLogs } from "@work-holo/db/schema/call-logs";
import { agentExtensions, didInventory } from "@work-holo/db/schema/dialer";
import { and, count, desc, eq, gte, ilike, lte, or } from "drizzle-orm";
import { z } from "zod";
import { adminProcedure } from "../../index";

export const callLogsAdminRouter = {
  list: adminProcedure
    .input(
      z.object({
        organizationId: z.string().optional(),
        direction: z.enum(["inbound", "outbound"]).optional(),
        status: z
          .enum(["answered", "missed", "failed", "busy", "no_answer"])
          .optional(),
        search: z.string().optional(),
        from: z.string().optional(),
        to: z.string().optional(),
        limit: z.number().int().positive().max(100).default(50),
        offset: z.number().int().min(0).default(0),
      })
    )
    .handler(async ({ input, context }) => {
      const conditions = [];

      if (input.organizationId)
        conditions.push(eq(callLogs.organizationId, input.organizationId));
      if (input.direction)
        conditions.push(eq(callLogs.direction, input.direction));
      if (input.status) conditions.push(eq(callLogs.status, input.status));
      if (input.from)
        conditions.push(gte(callLogs.startedAt, new Date(input.from)));
      if (input.to)
        conditions.push(lte(callLogs.startedAt, new Date(input.to)));
      if (input.search) {
        conditions.push(
          or(
            ilike(callLogs.fromNumber, `%${input.search}%`),
            ilike(callLogs.toNumber, `%${input.search}%`)
          )
        );
      }

      const [rows, [total]] = await Promise.all([
        context.db
          .select({
            id: callLogs.id,
            freeswitchCallId: callLogs.freeswitchCallId,
            direction: callLogs.direction,
            fromNumber: callLogs.fromNumber,
            toNumber: callLogs.toNumber,
            status: callLogs.status,
            hangupCause: callLogs.hangupCause,
            durationSeconds: callLogs.durationSeconds,
            billableSeconds: callLogs.billableSeconds,
            startedAt: callLogs.startedAt,
            answeredAt: callLogs.answeredAt,
            endedAt: callLogs.endedAt,
            organizationId: callLogs.organizationId,
            organizationName: organization.name,
            agentName: user.name,
            extension: agentExtensions.extension,
            didNumber: didInventory.number,
            recordingUrl: callLogs.recordingUrl,
          })
          .from(callLogs)
          .leftJoin(organization, eq(callLogs.organizationId, organization.id))
          .leftJoin(user, eq(callLogs.agentUserId, user.id))
          .leftJoin(
            agentExtensions,
            eq(callLogs.extensionId, agentExtensions.id)
          )
          .leftJoin(didInventory, eq(callLogs.didId, didInventory.id))
          .where(conditions.length > 0 ? and(...conditions) : undefined)
          .orderBy(desc(callLogs.startedAt))
          .limit(input.limit)
          .offset(input.offset),
        context.db
          .select({ value: count() })
          .from(callLogs)
          .where(conditions.length > 0 ? and(...conditions) : undefined),
      ]);

      return { rows, total: total?.value ?? 0 };
    }),

  stats: adminProcedure
    .input(z.object({ organizationId: z.string().optional() }))
    .handler(async ({ input, context }) => {
      const condition = input.organizationId
        ? eq(callLogs.organizationId, input.organizationId)
        : undefined;

      const [total, answered, inbound, outbound] = await Promise.all([
        context.db.select({ value: count() }).from(callLogs).where(condition),
        context.db
          .select({ value: count() })
          .from(callLogs)
          .where(
            condition
              ? and(condition, eq(callLogs.status, "answered"))
              : eq(callLogs.status, "answered")
          ),
        context.db
          .select({ value: count() })
          .from(callLogs)
          .where(
            condition
              ? and(condition, eq(callLogs.direction, "inbound"))
              : eq(callLogs.direction, "inbound")
          ),
        context.db
          .select({ value: count() })
          .from(callLogs)
          .where(
            condition
              ? and(condition, eq(callLogs.direction, "outbound"))
              : eq(callLogs.direction, "outbound")
          ),
      ]);

      return {
        total: total[0]?.value ?? 0,
        answered: answered[0]?.value ?? 0,
        inbound: inbound[0]?.value ?? 0,
        outbound: outbound[0]?.value ?? 0,
      };
    }),
};
