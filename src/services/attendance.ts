import { axiosPrivate } from "@configs/axios";
import { pageSchema, toApiResult } from "@utils/api-response.utils";
import { z } from "zod";

export const AttendanceStatusSchema = z.enum(["PRESENT", "ABSENT"]);
export type AttendanceStatus = z.infer<typeof AttendanceStatusSchema>;

export const DayOfWeekSchema = z.enum([
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
]);

// passthrough: keep audit fields (createdById, deletedAt, ...) the screens do not read
export const AttendanceRecordSchema = z
  .object({
    id: z.number(),
    date: z.string(),
    status: AttendanceStatusSchema,
    coin: z.number(),
    bonusCoin: z.number(),
    userId: z.number(),
    dayOfWeek: DayOfWeekSchema.nullish(),
  })
  .passthrough();
export type IAttendanceRecord = z.infer<typeof AttendanceRecordSchema>;

export const AttendanceSummarySchema = z.object({
  user: z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
  }),
  attendances: z.array(AttendanceRecordSchema),
  /** Total number of check-in days in the current week only */
  count: z.number(),
  /**
   * The streak of consecutive check-ins the user has achieved,
   * regardless of which week (could be this week or previous weeks)
   */
  totalStreak: z.number(),
});
export type IAttendanceSummary = z.infer<typeof AttendanceSummarySchema>;

export const AttendanceConfigSchema = z
  .object({
    id: z.number(),
    dayOfWeek: DayOfWeekSchema,
    bonusCoin: z.number(),
    baseCoin: z.number(),
  })
  .passthrough();
export type IAttendanceConfig = z.infer<typeof AttendanceConfigSchema>;

export const AttendanceConfigListSchema = pageSchema(AttendanceConfigSchema);

const attendanceService = {
  getAttendanceSummary: async () => {
    const response = await axiosPrivate.get("/attendance/user");
    return toApiResult(response, AttendanceSummarySchema);
  },
  checkIn: async () => {
    const response = await axiosPrivate.post("/attendance");
    return toApiResult(response, AttendanceRecordSchema);
  },
  getAttendanceConfig: async () => {
    const response = await axiosPrivate.get("/attendence-config");
    return toApiResult(response, AttendanceConfigListSchema);
  },
};

export default attendanceService;
