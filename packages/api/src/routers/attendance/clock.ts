import { ORPCError } from "@orpc/server";
import type { AttendanceUpdateType } from "@work-holo/db/lib/types";
import { attendanceTable, workBlockTable } from "@work-holo/db/schema/index";
import { and, eq, isNull } from "drizzle-orm";
import { orgMemberProcedure } from "../../index";
import {
  AddBreakDurationInput,
  AddBreakDurationOutput,
  MemberPunchInInput,
  MemberPunchInOutput,
  MemberPunchOutInput,
  MemberPunchOutOutput,
} from "../../lib/schemas/attendance";

export const clockRouter = {
  /**
   * Clocks in the current user for today. Creates an attendance record with "present" status
   * and starts an initial work block. Returns the existing record if already punched in.
   *
   * @param input.note - Optional note for the attendance entry
   * @param input.location - Optional location string
   * @returns The attendance record for today
   */
  punchIn: orgMemberProcedure
    .input(MemberPunchInInput)
    .output(MemberPunchInOutput)
    .handler(async ({ input, context: { db, session, orgId, permission } }) => {
      await permission.check(permission.attendance().record.create());
      const user = session.user;
      const teamId = session.session.activeTeamId ?? null;

      const now = new Date();

      const existingAttendance = await db.query.attendanceTable.findFirst({
        where: and(
          eq(attendanceTable.organizationId, orgId),
          eq(attendanceTable.userId, user.id),
          eq(attendanceTable.date, now),
          eq(attendanceTable.isDeleted, false)
        ),
      });

      if (existingAttendance !== undefined) {
        return existingAttendance;
      }

      const [attendance] = await db
        .insert(attendanceTable)
        .values({
          userId: user.id,
          organizationId: orgId,
          teamId,
          date: now,
          status: "present",
          checkInTime: now,
          clockInMethod: "manual",
          notes: input.note ?? null,
          location: input.location ?? null,
          isManualEntry: true,
          breakDuration: 0,
        })
        .returning();

      if (!attendance) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: "Failed to create attendance record.",
        });
      }

      await db.insert(workBlockTable).values({
        attendanceId: attendance.id,
        userId: user.id,
        startedAt: now,
        endedAt: null,
        durationMinutes: null,
        endReason: null,
      });

      return attendance;
    }),

  /**
   * Clocks out the current user by recording checkout time and calculating total hours worked.
   * Automatically closes any active work block with a "punch_out" end reason.
   * Subtracts accumulated break duration from total hours.
   *
   * @param input.note - Optional note to attach to the attendance record
   * @param input.location - Optional checkout location
   * @returns The updated attendance record with checkout time and total hours
   * @throws CONFLICT if no punch-in exists for today
   */
  punchOut: orgMemberProcedure
    .input(MemberPunchOutInput)
    .output(MemberPunchOutOutput)
    .handler(async ({ input, context }) => {
      const { db, session, orgId, permission } = context;
      await permission.check(permission.attendance().record.create());
      const user = session.user;
      const now = new Date();

      const attendance = await db.query.attendanceTable.findFirst({
        where: and(
          eq(attendanceTable.organizationId, orgId),
          eq(attendanceTable.userId, user.id),
          eq(attendanceTable.date, now),
          eq(attendanceTable.isDeleted, false)
        ),
      });

      if (attendance === undefined) {
        throw new ORPCError("CONFLICT", {
          message: "You need to punch in before you can punch out.",
        });
      }

      const activeBlock = await db.query.workBlockTable.findFirst({
        where: and(
          eq(workBlockTable.attendanceId, attendance.id),
          isNull(workBlockTable.endedAt)
        ),
      });

      if (activeBlock) {
        const durationMs = now.getTime() - activeBlock.startedAt.getTime();
        const durationMinutes = Math.floor(durationMs / 60_000);

        await db
          .update(workBlockTable)
          .set({
            endedAt: now,
            durationMinutes,
            endReason: "punch_out",
          })
          .where(eq(workBlockTable.id, activeBlock.id));
      }

      if (!attendance.checkInTime) {
        throw new ORPCError("BAD_REQUEST", {
          message: "Checkin before checkout is required.",
        });
      }

      const totalMinutes =
        (now.getTime() - attendance.checkInTime?.getTime()) / 60_000 -
        (attendance.breakDuration ?? 0);

      const totalHours = (totalMinutes / 60).toFixed(2);

      const updatePayload: Partial<AttendanceUpdateType> = {
        checkOutTime: now,
        clockOutMethod: "manual",
        totalHours,
      };

      if (input.note !== undefined) {
        updatePayload.notes = input.note;
      }

      if (input.location !== undefined) {
        updatePayload.location = input.location;
      }

      const [updatedAttendance] = await db
        .update(attendanceTable)
        .set(updatePayload)
        .where(eq(attendanceTable.id, attendance.id))
        .returning();

      if (!updatedAttendance) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: "Failed to update attendance record.",
        });
      }

      return updatedAttendance;
    }),

  /**
   * Adds break time (in minutes) to an open attendance record. Break duration
   * accumulates across multiple calls and is subtracted from total hours at punch-out.
   *
   * @param input.attendanceId - The attendance record to add break time to
   * @param input.minutes - Number of break minutes to add
   * @returns The new accumulated break duration in minutes
   * @throws NOT_FOUND if the attendance record doesn't exist
   * @throws CONFLICT if the attendance record is already checked out
   */
  addBreakDuration: orgMemberProcedure
    .input(AddBreakDurationInput)
    .output(AddBreakDurationOutput)
    .handler(async ({ input, context: { db, session, permission } }) => {
      await permission.check(permission.attendance().record.create());
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

      if (attendance.checkOutTime) {
        throw new ORPCError("CONFLICT", {
          message: "Cannot add break duration after punch out.",
        });
      }

      const newBreakDuration = (attendance.breakDuration ?? 0) + input.minutes;

      await db
        .update(attendanceTable)
        .set({
          breakDuration: newBreakDuration,
        })
        .where(eq(attendanceTable.id, attendance.id));

      return {
        breakDuration: newBreakDuration,
      };
    }),
};
