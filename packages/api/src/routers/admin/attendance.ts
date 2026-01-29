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
import { orgAdminProcedure } from "../../index";
import {
  GetAttendanceDetailInput,
  GetAttendanceDetailOutput,
  GetAttendanceStatsInput,
  GetAttendanceStatsOutput,
  ListAttendanceRecordsInput,
  ListAttendanceRecordsOutput,
} from "../../lib/schemas/admin-attendance";

export const adminAttendanceRouter = {
  getAttendanceStats: orgAdminProcedure
    .input(GetAttendanceStatsInput)
    .output(GetAttendanceStatsOutput)
    .handler(async ({ context: { db, orgId } }) => {
      // Get total members count
      const [totalMembersRow] = await db
        .select({
          count: count(),
        })
        .from(member)
        .where(eq(member.organizationId, orgId));

      const totalMembers = totalMembersRow?.count ?? 0;

      // Get present today count (attendance records with checkInTime today and no checkOutTime or checkOutTime today)
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

  listAttendanceRecords: orgAdminProcedure
    .input(ListAttendanceRecordsInput)
    .output(ListAttendanceRecordsOutput)
    .handler(async ({ input, context: { db, orgId } }) => {
      const { page, perPage, search, filters, sorting } = input;
      const offset = (page - 1) * perPage;

      // Extract filters safely
      const date = filters?.date;
      const startDate = filters?.startDate;
      const endDate = filters?.endDate;
      const status = filters?.status;

      // Build where conditions
      const conditions = [
        eq(attendanceTable.organizationId, orgId),
        eq(attendanceTable.isDeleted, false),
      ];

      // Handle date filtering (single date or date range)
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

      // Add search condition for user name or email
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

      // Handle Sorting
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
            case "user.name": // Sorting by joined column
              return direction(user.name);
            default:
              return desc(attendanceTable.date);
          }
        });
      }

      // Get total count
      const [totalRow] = await db
        .select({
          count: count(),
        })
        .from(attendanceTable)
        .innerJoin(user, eq(attendanceTable.userId, user.id))
        .where(whereClause);

      const total = totalRow?.count ?? 0;
      const totalPages = Math.ceil(total / perPage);

      // Get records with user data
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

  getAttendanceDetail: orgAdminProcedure
    .input(GetAttendanceDetailInput)
    .output(GetAttendanceDetailOutput)
    .handler(async ({ input, context: { db, orgId } }) => {
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

      // Get work blocks for this attendance
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
