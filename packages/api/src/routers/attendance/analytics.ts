import { attendanceTable } from "@work-holo/db/schema/index";
import { and, asc, eq, gte, lte } from "drizzle-orm";
import { orgMemberProcedure } from "../../index";
import {
  AttendanceAnalyticsInput,
  AttendanceAnalyticsOutput,
  attendanceStatuses,
} from "../../lib/schemas/attendance";

export const analyticsRouter = {
  /**
   * Calculates attendance analytics for the current user over a configurable date range.
   * Computes summary stats (present/absent/late/remote days, hours, overtime),
   * status breakdown, daily trends, punctuality averages, and attendance streaks.
   * Defaults to the last 30 days if no date range is provided.
   *
   * @param input.startDate - Start of the analysis period (optional, defaults to 30 days ago)
   * @param input.endDate - End of the analysis period (optional, defaults to today)
   * @returns Attendance summary, status breakdown, daily trends, punctuality metrics, and streak data
   */
  getAnalytics: orgMemberProcedure
    .input(AttendanceAnalyticsInput.optional())
    .output(AttendanceAnalyticsOutput)
    .handler(async ({ input, context: { db, session, orgId, permission } }) => {
      await permission.check(permission.attendance().record.read());
      const user = session.user;

      const today = new Date();
      const startDate = input?.startDate
        ? new Date(input.startDate)
        : new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000);
      const endDate = input?.endDate ? new Date(input.endDate) : today;

      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      const [rangeStart, rangeEnd] =
        startDate > endDate ? [endDate, startDate] : [startDate, endDate];

      const records = await db
        .select()
        .from(attendanceTable)
        .where(
          and(
            eq(attendanceTable.organizationId, orgId),
            eq(attendanceTable.userId, user.id),
            eq(attendanceTable.isDeleted, false),
            gte(attendanceTable.date, rangeStart),
            lte(attendanceTable.date, rangeEnd)
          )
        )
        .orderBy(asc(attendanceTable.date));

      const presentStatuses = new Set([
        "present",
        "late",
        "partial",
        "work_from_home",
      ]);
      const excusedStatuses = new Set(["excused", "holiday", "sick_leave"]);

      const totalDays = records.length;
      const presentDays = records.filter((r) =>
        presentStatuses.has(r.status)
      ).length;
      const absentDays = records.filter((r) => r.status === "absent").length;
      const lateDays = records.filter((r) => r.status === "late").length;
      const remoteDays = records.filter(
        (r) => r.status === "work_from_home"
      ).length;
      const excusedDays = records.filter((r) =>
        excusedStatuses.has(r.status)
      ).length;

      const toNumber = (value: unknown) => {
        if (value === null || value === undefined) return 0;
        const num = Number(value);
        return Number.isFinite(num) ? num : 0;
      };

      const totalHours = records.reduce(
        (sum, record) => sum + toNumber(record.totalHours),
        0
      );
      const overtimeHours = records.reduce(
        (sum, record) => sum + toNumber(record.overtimeHours),
        0
      );
      const totalBreakMinutes = records.reduce(
        (sum, record) => sum + (record.breakDuration ?? 0),
        0
      );

      const averageDailyHours = presentDays > 0 ? totalHours / presentDays : 0;
      const averageBreakMinutes =
        totalDays > 0 ? totalBreakMinutes / totalDays : 0;
      const attendanceRate =
        totalDays > 0 ? ((presentDays + excusedDays) / totalDays) * 100 : 0;

      const statusBreakdown = attendanceStatuses.map((status) => ({
        status,
        count: records.filter((record) => record.status === status).length,
      }));

      const dailyTrends = records.map((record) => ({
        date: record.date.toISOString(),
        status: record.status,
        totalHours: record.totalHours ? toNumber(record.totalHours) : null,
        breakMinutes: record.breakDuration ?? null,
        checkInTime: record.checkInTime?.toISOString() ?? null,
        checkOutTime: record.checkOutTime?.toISOString() ?? null,
      }));

      const calculateAverageTime = (dates: Date[]) => {
        if (dates.length === 0) return null;
        const totalMinutes = dates.reduce(
          (sum, date) => sum + date.getHours() * 60 + date.getMinutes(),
          0
        );
        const avgMinutes = totalMinutes / dates.length;
        const hours = Math.floor(avgMinutes / 60)
          .toString()
          .padStart(2, "0");
        const minutes = Math.round(avgMinutes % 60)
          .toString()
          .padStart(2, "0");
        return `${hours}:${minutes}`;
      };

      const checkIns = records
        .map((record) => record.checkInTime)
        .filter((date): date is Date => date instanceof Date);
      const checkOuts = records
        .map((record) => record.checkOutTime)
        .filter((date): date is Date => date instanceof Date);

      const punctuality = {
        averageCheckInTime: calculateAverageTime(checkIns),
        averageCheckOutTime: calculateAverageTime(checkOuts),
        earliestCheckIn:
          checkIns.length > 0
            ? new Date(
                Math.min(...checkIns.map((date) => date.getTime()))
              ).toISOString()
            : null,
        latestCheckOut:
          checkOuts.length > 0
            ? new Date(
                Math.max(...checkOuts.map((date) => date.getTime()))
              ).toISOString()
            : null,
      };

      const streakableStatuses = new Set([
        "present",
        "late",
        "partial",
        "work_from_home",
        "excused",
        "holiday",
        "sick_leave",
      ]);

      let currentStreak = 0;
      let longestStreak = 0;

      for (const record of records) {
        if (streakableStatuses.has(record.status)) {
          currentStreak += 1;
          if (currentStreak > longestStreak) {
            longestStreak = currentStreak;
          }
        } else {
          currentStreak = 0;
        }
      }

      return {
        range: {
          startDate: rangeStart.toISOString(),
          endDate: rangeEnd.toISOString(),
        },
        summary: {
          totalDays,
          presentDays,
          absentDays,
          lateDays,
          remoteDays,
          excusedDays,
          attendanceRate,
          averageDailyHours,
          averageBreakMinutes,
          totalHours,
          overtimeHours,
        },
        statusBreakdown,
        dailyTrends,
        punctuality,
        streaks: {
          currentStreak,
          longestStreak,
        },
      };
    }),

  /**
   * Calculates attendance analytics for ALL members of the organization over a configurable date range.
   * Aggregates across all org members without filtering by userId.
   * Computes summary stats (present/absent/late/remote days, hours, overtime),
   * status breakdown, daily trends, punctuality averages, and attendance streaks.
   * Defaults to the last 30 days if no date range is provided.
   *
   * @param input.startDate - Start of the analysis period (optional, defaults to 30 days ago)
   * @param input.endDate - End of the analysis period (optional, defaults to today)
   * @returns Attendance summary, status breakdown, daily trends, punctuality metrics, and streak data
   */
  getOrgAnalytics: orgMemberProcedure
    .input(AttendanceAnalyticsInput.optional())
    .output(AttendanceAnalyticsOutput)
    .handler(async ({ input, context: { db, orgId, permission } }) => {
      await permission.check(permission.attendance().record.read());

      const today = new Date();
      const startDate = input?.startDate
        ? new Date(input.startDate)
        : new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000);
      const endDate = input?.endDate ? new Date(input.endDate) : today;

      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      const [rangeStart, rangeEnd] =
        startDate > endDate ? [endDate, startDate] : [startDate, endDate];

      const records = await db
        .select()
        .from(attendanceTable)
        .where(
          and(
            eq(attendanceTable.organizationId, orgId),
            eq(attendanceTable.isDeleted, false),
            gte(attendanceTable.date, rangeStart),
            lte(attendanceTable.date, rangeEnd)
          )
        )
        .orderBy(asc(attendanceTable.date));

      const presentStatuses = new Set([
        "present",
        "late",
        "partial",
        "work_from_home",
      ]);
      const excusedStatuses = new Set(["excused", "holiday", "sick_leave"]);

      const totalDays = records.length;
      const presentDays = records.filter((r) =>
        presentStatuses.has(r.status)
      ).length;
      const absentDays = records.filter((r) => r.status === "absent").length;
      const lateDays = records.filter((r) => r.status === "late").length;
      const remoteDays = records.filter(
        (r) => r.status === "work_from_home"
      ).length;
      const excusedDays = records.filter((r) =>
        excusedStatuses.has(r.status)
      ).length;

      const toNumber = (value: unknown) => {
        if (value === null || value === undefined) return 0;
        const num = Number(value);
        return Number.isFinite(num) ? num : 0;
      };

      const totalHours = records.reduce(
        (sum, record) => sum + toNumber(record.totalHours),
        0
      );
      const overtimeHours = records.reduce(
        (sum, record) => sum + toNumber(record.overtimeHours),
        0
      );
      const totalBreakMinutes = records.reduce(
        (sum, record) => sum + (record.breakDuration ?? 0),
        0
      );

      const averageDailyHours = presentDays > 0 ? totalHours / presentDays : 0;
      const averageBreakMinutes =
        totalDays > 0 ? totalBreakMinutes / totalDays : 0;
      const attendanceRate =
        totalDays > 0 ? ((presentDays + excusedDays) / totalDays) * 100 : 0;

      const statusBreakdown = attendanceStatuses.map((status) => ({
        status,
        count: records.filter((record) => record.status === status).length,
      }));

      const dailyTrends = records.map((record) => ({
        date: record.date.toISOString(),
        status: record.status,
        totalHours: record.totalHours ? toNumber(record.totalHours) : null,
        breakMinutes: record.breakDuration ?? null,
        checkInTime: record.checkInTime?.toISOString() ?? null,
        checkOutTime: record.checkOutTime?.toISOString() ?? null,
      }));

      const calculateAverageTime = (dates: Date[]) => {
        if (dates.length === 0) return null;
        const totalMinutes = dates.reduce(
          (sum, date) => sum + date.getHours() * 60 + date.getMinutes(),
          0
        );
        const avgMinutes = totalMinutes / dates.length;
        const hours = Math.floor(avgMinutes / 60)
          .toString()
          .padStart(2, "0");
        const minutes = Math.round(avgMinutes % 60)
          .toString()
          .padStart(2, "0");
        return `${hours}:${minutes}`;
      };

      const checkIns = records
        .map((record) => record.checkInTime)
        .filter((date): date is Date => date instanceof Date);
      const checkOuts = records
        .map((record) => record.checkOutTime)
        .filter((date): date is Date => date instanceof Date);

      const punctuality = {
        averageCheckInTime: calculateAverageTime(checkIns),
        averageCheckOutTime: calculateAverageTime(checkOuts),
        earliestCheckIn:
          checkIns.length > 0
            ? new Date(
                Math.min(...checkIns.map((date) => date.getTime()))
              ).toISOString()
            : null,
        latestCheckOut:
          checkOuts.length > 0
            ? new Date(
                Math.max(...checkOuts.map((date) => date.getTime()))
              ).toISOString()
            : null,
      };

      const streakableStatuses = new Set([
        "present",
        "late",
        "partial",
        "work_from_home",
        "excused",
        "holiday",
        "sick_leave",
      ]);

      let currentStreak = 0;
      let longestStreak = 0;

      for (const record of records) {
        if (streakableStatuses.has(record.status)) {
          currentStreak += 1;
          if (currentStreak > longestStreak) {
            longestStreak = currentStreak;
          }
        } else {
          currentStreak = 0;
        }
      }

      return {
        range: {
          startDate: rangeStart.toISOString(),
          endDate: rangeEnd.toISOString(),
        },
        summary: {
          totalDays,
          presentDays,
          absentDays,
          lateDays,
          remoteDays,
          excusedDays,
          attendanceRate,
          averageDailyHours,
          averageBreakMinutes,
          totalHours,
          overtimeHours,
        },
        statusBreakdown,
        dailyTrends,
        punctuality,
        streaks: {
          currentStreak,
          longestStreak,
        },
      };
    }),
};
