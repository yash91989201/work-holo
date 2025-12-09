import { attendanceTable } from "@work-holo/db/schema/index";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Base attendance schema from database
export const AttendanceSelectSchema = createSelectSchema(attendanceTable);

// Get attendance stats input/output
export const GetAttendanceStatsInput = z.object({});

export const GetAttendanceStatsOutput = z.object({
  totalMembers: z.number(),
  presentToday: z.number(),
});

export type GetAttendanceStatsInputType = z.infer<
  typeof GetAttendanceStatsInput
>;
export type GetAttendanceStatsOutputType = z.infer<
  typeof GetAttendanceStatsOutput
>;

// List attendance records input/output
export const ListAttendanceRecordsInput = z
  .object({
    page: z.number().min(1).default(1),
    perPage: z.number().min(1).max(100).default(10),
    search: z.string().optional(),
    filters: z
      .object({
        date: z.date().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        status: z
          .enum([
            "present",
            "absent",
            "late",
            "excused",
            "partial",
            "holiday",
            "sick_leave",
            "work_from_home",
          ])
          .optional(),
      })
      .optional(),
    sorting: z
      .array(
        z.object({
          id: z.string(),
          desc: z.boolean(),
        })
      )
      .optional(),
  })
  .optional()
  .default({ page: 1, perPage: 10 });

export const AttendanceRecordWithUserSchema = AttendanceSelectSchema.extend({
  user: z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string(),
    image: z.string().nullable(),
  }),
});

export const ListAttendanceRecordsOutput = z.object({
  records: z.array(AttendanceRecordWithUserSchema),
  pagination: z.object({
    page: z.number(),
    perPage: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

export type ListAttendanceRecordsInputType = z.infer<
  typeof ListAttendanceRecordsInput
>;
export type ListAttendanceRecordsOutputType = z.infer<
  typeof ListAttendanceRecordsOutput
>;

// Get attendance detail input/output
export const GetAttendanceDetailInput = z.object({
  attendanceId: z.string().min(1, "Attendance ID is required"),
});

export const GetAttendanceDetailOutput = AttendanceRecordWithUserSchema.extend({
  workBlocks: z.array(
    z.object({
      id: z.string(),
      startedAt: z.date(),
      endedAt: z.date().nullable(),
      durationMinutes: z.number().nullable(),
      endReason: z
        .enum(["manual", "break", "punch_out", "idle_timeout"])
        .nullable(),
    })
  ),
});

export type GetAttendanceDetailInputType = z.infer<
  typeof GetAttendanceDetailInput
>;
export type GetAttendanceDetailOutputType = z.infer<
  typeof GetAttendanceDetailOutput
>;
