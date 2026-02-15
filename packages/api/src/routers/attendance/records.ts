import { ORPCError } from "@orpc/server";
import {
  attendanceTable,
  member,
  user,
  workBlockTable,
} from "@work-holo/db/schema/index";
import type { SQL } from "drizzle-orm";
import {
  and,
  asc,
  count,
  desc,
  eq,
  getTableColumns,
  gte,
  ilike,
  lte,
  or,
} from "drizzle-orm";
import { orgMemberProcedure } from "../../index";
import {
  GetAttendanceDetailInput,
  GetAttendanceDetailOutput,
  GetAttendanceStatsInput,
  GetAttendanceStatsOutput,
  ListAttendanceRecordsInput,
  ListAttendanceRecordsOutput,
} from "../../lib/schemas/admin-attendance";
import {
  GetTodayInput,
  GetTodayOutput,
  MemberAttendanceStatusOutput,
} from "../../lib/schemas/attendance";

export const recordsRouter = {
  /**
   * Returns the current user's attendance record for today, or null if not punched in.
   * Used to determine clock-in/clock-out state.
   */
  getStatus: orgMemberProcedure
    .output(MemberAttendanceStatusOutput.nullable())
    .handler(async ({ context }) => {
      const { db, session, orgId, permission } = context;
      await permission.check(permission.attendance().record.read());
      const userSession = session.user;
      const today = new Date();

      const attendance = await db.query.attendanceTable.findFirst({
        where: and(
          eq(attendanceTable.organizationId, orgId),
          eq(attendanceTable.userId, userSession.id),
          eq(attendanceTable.date, today),
          eq(attendanceTable.isDeleted, false)
        ),
      });

      if (!attendance) {
        return null;
      }

      return attendance;
    }),

  /**
   * Fetches the current user's full attendance record for today.
   * Returns null if no record exists.
   */
  getToday: orgMemberProcedure
    .input(GetTodayInput)
    .output(GetTodayOutput)
    .handler(async ({ context: { db, session, orgId, permission } }) => {
      await permission.check(permission.attendance().record.read());
      const userSession = session.user;
      const today = new Date();

      const attendance = await db.query.attendanceTable.findFirst({
        where: and(
          eq(attendanceTable.organizationId, orgId),
          eq(attendanceTable.userId, userSession.id),
          eq(attendanceTable.date, today),
          eq(attendanceTable.isDeleted, false)
        ),
      });

      return attendance ?? null;
    }),

  /**
   * Returns org-wide attendance stats: total member count and
   * number of members who punched in today.
   */
  getStats: orgMemberProcedure
    .input(GetAttendanceStatsInput)
    .output(GetAttendanceStatsOutput)
    .handler(async ({ context: { db, orgId, permission } }) => {
      await permission.check(permission.attendance().record.list());
      const [totalMembersRow] = await db
        .select({
          count: count(),
        })
        .from(member)
        .where(eq(member.organizationId, orgId));

      const totalMembers = totalMembersRow?.count ?? 0;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [presentTodayRow] = await db
        .select({
          count: count(),
        })
        .from(attendanceTable)
        .where(
          and(
            eq(attendanceTable.organizationId, orgId),
            eq(attendanceTable.date, today),
            eq(attendanceTable.isDeleted, false)
          )
        );

      const presentToday = presentTodayRow?.count ?? 0;

      return {
        totalMembers,
        presentToday,
      };
    }),

  /**
   * Lists attendance records across the organization with pagination, search by
   * user name/email, date range filtering, status filtering, and column sorting.
   * Each record includes the associated user profile.
   *
   * @param input.page - Page number (1-based)
   * @param input.perPage - Records per page
   * @param input.search - Filter by user name or email
   * @param input.filters - Filter by date, date range, or status
   * @param input.sorting - Sort by checkInTime, checkOutTime, totalHours, status, date, or user.name
   */
  list: orgMemberProcedure
    .input(ListAttendanceRecordsInput)
    .output(ListAttendanceRecordsOutput)
    .handler(async ({ input, context: { db, orgId, permission } }) => {
      await permission.check(permission.attendance().record.list());
      const { page, perPage, search, filters, sorting } = input;
      const offset = (page - 1) * perPage;

      const date = filters?.date;
      const startDate = filters?.startDate;
      const endDate = filters?.endDate;
      const status = filters?.status;

      const conditions = [
        eq(attendanceTable.organizationId, orgId),
        eq(attendanceTable.isDeleted, false),
      ];

      if (date) {
        const searchDate = new Date(date);
        searchDate.setHours(0, 0, 0, 0);
        conditions.push(eq(attendanceTable.date, searchDate));
      } else if (startDate && endDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        conditions.push(gte(attendanceTable.date, start));
        conditions.push(lte(attendanceTable.date, end));
      } else if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        conditions.push(gte(attendanceTable.date, start));
      } else if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        conditions.push(lte(attendanceTable.date, end));
      }

      if (status) {
        conditions.push(eq(attendanceTable.status, status));
      }

      let searchCondition: SQL | undefined;
      if (search) {
        searchCondition = or(
          ilike(user.name, `%${search}%`),
          ilike(user.email, `%${search}%`)
        );
      }

      const whereClause = searchCondition
        ? and(...conditions, searchCondition)
        : and(...conditions);

      let orderBy = [
        desc(attendanceTable.date),
        desc(attendanceTable.checkInTime),
      ];

      if (sorting && sorting.length > 0) {
        orderBy = sorting.map((sort) => {
          const direction = sort.desc ? desc : asc;

          switch (sort.id) {
            case "checkInTime":
              return direction(attendanceTable.checkInTime);
            case "checkOutTime":
              return direction(attendanceTable.checkOutTime);
            case "totalHours":
              return direction(attendanceTable.totalHours);
            case "status":
              return direction(attendanceTable.status);
            case "date":
              return direction(attendanceTable.date);
            case "user.name":
              return direction(user.name);
            default:
              return desc(attendanceTable.date);
          }
        });
      }

      const [totalRow] = await db
        .select({
          count: count(),
        })
        .from(attendanceTable)
        .innerJoin(user, eq(attendanceTable.userId, user.id))
        .where(whereClause);

      const total = totalRow?.count ?? 0;
      const totalPages = Math.ceil(total / perPage);

      const records = await db
        .select({
          ...getTableColumns(attendanceTable),
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          },
        })
        .from(attendanceTable)
        .innerJoin(user, eq(attendanceTable.userId, user.id))
        .where(whereClause)
        .orderBy(...orderBy)
        .limit(perPage)
        .offset(offset);

      return {
        records,
        pagination: {
          page,
          perPage,
          total,
          totalPages,
        },
      };
    }),

  /**
   * Retrieves a single attendance record with user profile and all work blocks
   * for that day, ordered by start time.
   *
   * @param input.attendanceId - The attendance record to retrieve
   * @throws NOT_FOUND if the record doesn't exist in this organization
   */
  getDetail: orgMemberProcedure
    .input(GetAttendanceDetailInput)
    .output(GetAttendanceDetailOutput)
    .handler(async ({ input, context: { db, orgId, permission } }) => {
      await permission.check(permission.attendance().record.read());
      const { attendanceId } = input;

      const [record] = await db
        .select({
          ...getTableColumns(attendanceTable),
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          },
        })
        .from(attendanceTable)
        .innerJoin(user, eq(attendanceTable.userId, user.id))
        .where(
          and(
            eq(attendanceTable.id, attendanceId),
            eq(attendanceTable.organizationId, orgId),
            eq(attendanceTable.isDeleted, false)
          )
        );

      if (!record) {
        throw new ORPCError("NOT_FOUND", {
          message: "Attendance record not found",
        });
      }

      const workBlocks = await db
        .select({
          id: workBlockTable.id,
          startedAt: workBlockTable.startedAt,
          endedAt: workBlockTable.endedAt,
          durationMinutes: workBlockTable.durationMinutes,
          endReason: workBlockTable.endReason,
        })
        .from(workBlockTable)
        .where(eq(workBlockTable.attendanceId, attendanceId))
        .orderBy(workBlockTable.startedAt);

      return {
        ...record,
        workBlocks,
      };
    }),
};
