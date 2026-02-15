import { ORPCError } from "@orpc/server";
import {
  EndBlockInput,
  EndBlockOutput,
  GetActiveBlockInput,
  GetActiveBlockOutput,
  ListBlocksInput,
  ListBlocksOutput,
  StartBlockInput,
  StartBlockOutput,
} from "@work-holo/api/lib/schemas/work-block";
import { attendanceTable, workBlockTable } from "@work-holo/db/schema/index";
import { and, eq, isNull } from "drizzle-orm";
import { orgMemberProcedure } from "../../index";

export const workBlockRouter = {
  /**
   * Returns the currently active (unfinished) work block for an attendance record.
   *
   * @param input.attendanceId - The attendance record to look up
   * @returns The active work block, or null if none is active
   * @throws NOT_FOUND if the attendance record does not exist or belongs to another user
   */
  getActive: orgMemberProcedure
    .input(GetActiveBlockInput)
    .output(GetActiveBlockOutput)
    .handler(async ({ input, context: { db, session, permission } }) => {
      await permission.check(permission.attendance().record.read());
      const user = session.user;

      const attendance = await db.query.attendanceTable.findFirst({
        where: and(
          eq(attendanceTable.id, input.attendanceId),
          eq(attendanceTable.userId, user.id),
          eq(attendanceTable.isDeleted, false)
        ),
      });

      if (!attendance) {
        throw new ORPCError("NOT_FOUND", {
          message: "Attendance record not found.",
        });
      }

      const activeBlock = await db.query.workBlockTable.findFirst({
        where: and(
          eq(workBlockTable.attendanceId, input.attendanceId),
          isNull(workBlockTable.endedAt)
        ),
      });

      return activeBlock ?? null;
    }),

  /**
   * Starts a new work block for an attendance record. Only one work block
   * can be active at a time, and blocks cannot be started after punch out.
   *
   * @param input.attendanceId - The attendance record to start a block for
   * @returns The newly created work block
   * @throws NOT_FOUND if the attendance record does not exist
   * @throws CONFLICT if a work block is already active or the user has punched out
   */
  start: orgMemberProcedure
    .input(StartBlockInput)
    .output(StartBlockOutput)
    .handler(async ({ input, context: { db, session, permission } }) => {
      await permission.check(permission.attendance().record.create());
      const user = session.user;
      const now = new Date();

      const attendance = await db.query.attendanceTable.findFirst({
        where: and(
          eq(attendanceTable.id, input.attendanceId),
          eq(attendanceTable.userId, user.id),
          eq(attendanceTable.isDeleted, false)
        ),
      });

      if (!attendance) {
        throw new ORPCError("NOT_FOUND", {
          message: "Attendance record not found.",
        });
      }

      if (attendance.checkOutTime) {
        throw new ORPCError("CONFLICT", {
          message: "Cannot start work block after punch out.",
        });
      }

      const activeBlock = await db.query.workBlockTable.findFirst({
        where: and(
          eq(workBlockTable.attendanceId, input.attendanceId),
          isNull(workBlockTable.endedAt)
        ),
      });

      if (activeBlock) {
        throw new ORPCError("CONFLICT", {
          message: "A work block is already active for this attendance.",
        });
      }

      const [workBlock] = await db
        .insert(workBlockTable)
        .values({
          attendanceId: input.attendanceId,
          userId: user.id,
          startedAt: now,
          endedAt: null,
          durationMinutes: null,
          endReason: null,
        })
        .returning();

      if (!workBlock) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: "Failed to create work block.",
        });
      }

      return workBlock;
    }),

  /**
   * Ends the currently active work block for an attendance record,
   * calculating the duration in minutes from start to now.
   *
   * @param input.attendanceId - The attendance record whose active block to end
   * @param input.endReason - Reason for ending the block (e.g. break, done)
   * @returns The updated work block with endedAt and durationMinutes populated
   * @throws NOT_FOUND if the attendance record or active block does not exist
   */
  end: orgMemberProcedure
    .input(EndBlockInput)
    .output(EndBlockOutput)
    .handler(async ({ input, context: { db, session, permission } }) => {
      await permission.check(permission.attendance().record.update());
      const user = session.user;
      const now = new Date();

      const attendance = await db.query.attendanceTable.findFirst({
        where: and(
          eq(attendanceTable.id, input.attendanceId),
          eq(attendanceTable.userId, user.id),
          eq(attendanceTable.isDeleted, false)
        ),
      });

      if (!attendance) {
        throw new ORPCError("NOT_FOUND", {
          message: "Attendance record not found.",
        });
      }

      const activeBlock = await db.query.workBlockTable.findFirst({
        where: and(
          eq(workBlockTable.attendanceId, input.attendanceId),
          isNull(workBlockTable.endedAt)
        ),
      });

      if (!activeBlock) {
        throw new ORPCError("NOT_FOUND", {
          message: "No active work block found for this attendance.",
        });
      }

      const durationMs = now.getTime() - activeBlock.startedAt.getTime();
      const durationMinutes = Math.floor(durationMs / 60_000);

      const [updatedBlock] = await db
        .update(workBlockTable)
        .set({
          endedAt: now,
          durationMinutes,
          endReason: input.endReason,
        })
        .where(eq(workBlockTable.id, activeBlock.id))
        .returning();

      if (!updatedBlock) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: "Failed to update work block.",
        });
      }

      return updatedBlock;
    }),

  /**
   * Lists all work blocks for an attendance record, ordered by most recent first.
   * Returns an empty array if the attendance record is not found.
   *
   * @param input.attendanceId - The attendance record to list blocks for
   * @returns Array of work blocks sorted descending by startedAt
   */
  list: orgMemberProcedure
    .input(ListBlocksInput)
    .output(ListBlocksOutput)
    .handler(async ({ input, context: { db, session, permission } }) => {
      await permission.check(permission.attendance().record.read());
      const user = session.user;

      const attendance = await db.query.attendanceTable.findFirst({
        where: and(
          eq(attendanceTable.id, input.attendanceId),
          eq(attendanceTable.userId, user.id),
          eq(attendanceTable.isDeleted, false)
        ),
      });

      if (!attendance) {
        return [];
      }

      const blocks = await db.query.workBlockTable.findMany({
        where: eq(workBlockTable.attendanceId, input.attendanceId),
        orderBy: (workBlockTable, { desc }) => [desc(workBlockTable.startedAt)],
      });

      return blocks;
    }),
};
