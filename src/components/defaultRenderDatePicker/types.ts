import type { SchedulerDatePickerRenderArgs } from "@rfs-types";

/** `isWorkingDay` is optional so existing direct calls keep working. */
export type DefaultRenderDatePickerProps = Omit<SchedulerDatePickerRenderArgs, "isWorkingDay"> &
  Partial<Pick<SchedulerDatePickerRenderArgs, "isWorkingDay">>;
