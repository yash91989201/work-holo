import { user } from "@work-holo/db/schema/auth";
import { callLogs } from "@work-holo/db/schema/call-logs";
import { agentExtensions, didInventory } from "@work-holo/db/schema/dialer";
import { and, count, desc, eq, gte, ilike, lte, or } from "drizzle-orm";
import { z } from "zod";
import { orgMemberProcedure } from "../../index";

export const orgCallLogsRouter = {
  list: orgMemberProcedure
    .input(
      z.object({
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
      const { db, orgId } = context;
      const base = eq(callLogs.organizationId, orgId);
      const conditions = [base];

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

      const where = and(...conditions);

      const [rows, [total]] = await Promise.all([
        db
          .select({
            id: callLogs.id,
            direction: callLogs.direction,
            fromNumber: callLogs.fromNumber,
            toNumber: callLogs.toNumber,
            status: callLogs.status,
            durationSeconds: callLogs.durationSeconds,
            billableSeconds: callLogs.billableSeconds,
            startedAt: callLogs.startedAt,
            answeredAt: callLogs.answeredAt,
            endedAt: callLogs.endedAt,
            agentName: user.name,
            extension: agentExtensions.extension,
            didNumber: didInventory.number,
            recordingUrl: callLogs.recordingUrl,
          })
          .from(callLogs)
          .leftJoin(user, eq(callLogs.agentUserId, user.id))
          .leftJoin(
            agentExtensions,
            eq(callLogs.extensionId, agentExtensions.id)
          )
          .leftJoin(didInventory, eq(callLogs.didId, didInventory.id))
          .where(where)
          .orderBy(desc(callLogs.startedAt))
          .limit(input.limit)
          .offset(input.offset),
        db.select({ value: count() }).from(callLogs).where(where),
      ]);

      return { rows, total: total?.value ?? 0 };
    }),

  stats: orgMemberProcedure.handler(async ({ context }) => {
    const { db, orgId } = context;
    const base = eq(callLogs.organizationId, orgId);

    const [total, answered, inbound, outbound] = await Promise.all([
      db.select({ value: count() }).from(callLogs).where(base),
      db
        .select({ value: count() })
        .from(callLogs)
        .where(and(base, eq(callLogs.status, "answered"))),
      db
        .select({ value: count() })
        .from(callLogs)
        .where(and(base, eq(callLogs.direction, "inbound"))),
      db
        .select({ value: count() })
        .from(callLogs)
        .where(and(base, eq(callLogs.direction, "outbound"))),
    ]);

    return {
      total: total[0]?.value ?? 0,
      answered: answered[0]?.value ?? 0,
      inbound: inbound[0]?.value ?? 0,
      outbound: outbound[0]?.value ?? 0,
    };
  }),
};
