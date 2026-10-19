import * as React from "react";

import type { SchedulerView } from "@rfs-types/scheduler";

type UseSchedulerViewArgs = {
  views: SchedulerView[];
  view?: SchedulerView;
  defaultView?: SchedulerView;
  onViewChange?: (view: SchedulerView) => void;
};

/** Current view, controlled through `view` or kept in local state. */
export function useSchedulerView({ views, view, defaultView, onViewChange }: UseSchedulerViewArgs) {
  const [uncontrolledView, setUncontrolledView] = React.useState<SchedulerView>(
    () => defaultView ?? (views.length > 0 ? views[0] : "day")
  );

  const handleViewChange = React.useCallback(
    (nextView: SchedulerView) => {
      if (view === undefined) {
        setUncontrolledView(nextView);
      }
      onViewChange?.(nextView);
    },
    [view, onViewChange]
  );

  return [view ?? uncontrolledView, handleViewChange] as const;
}
