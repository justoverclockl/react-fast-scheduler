import { dayISO, getSchedulerVisibleDays } from "@utils/scheduler-core.utils";
import * as React from "react";

import type {
  SchedulerView,
  SchedulerWeekStartsOn,
  SchedulerWeekday,
} from "@rfs-types/scheduler";

/**
 * Days shown by the current view. `weekDays` is set only in the week view, the only view that
 * loads and lays out more than the selected day.
 */
export function useSchedulerVisibleDays(
  view: SchedulerView,
  selectedDate: Date,
  weekStartsOn: SchedulerWeekStartsOn | undefined,
  workingDays: SchedulerWeekday[] | undefined
) {
  const selectedISO = dayISO(selectedDate);
  // Keyed by value, so an inline `workingDays={[1, 2, 3, 4, 5]}` keeps the same days.
  const workingDaysKey = workingDays?.join(",");
  const visibleDays = React.useMemo(
    () => getSchedulerVisibleDays(view, selectedDate, { weekStartsOn, workingDays }),
    // Keyed by day: a new Date object for the same day keeps the same array.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [view, selectedISO, weekStartsOn, workingDaysKey]
  );

  return { visibleDays, weekDays: view === "week" ? visibleDays : undefined };
}
