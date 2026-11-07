import { defaultRenderDatePicker } from "@components/defaultRenderDatePicker";
import { defaultRenderToolbar } from "@components/defaultRenderToolbar";
import { Button } from "@components/ui/button";
import { isSchedulerWorkingDay, shiftDays, shiftWorkingDays } from "@utils/scheduler-core.utils";
import * as React from "react";

import type {
  SchedulerDatePickerRenderArgs,
  SchedulerToolbarRenderArgs,
  SchedulerView,
  SchedulerWeekday,
} from "@rfs-types";

const DEFAULT_VIEW_LABELS: Record<SchedulerView, React.ReactNode> = {
  day: "Day",
  agenda: "Agenda",
  week: "Week",
};

type SchedulerToolbarProps = {
  selectedDate: Date;
  onSelectedDateChange: (date: Date) => void;
  prevButtonLabel: React.ReactNode;
  nextButtonLabel: React.ReactNode;
  renderToolbar?: (args: SchedulerToolbarRenderArgs) => React.ReactNode;
  renderDatePicker?: (args: SchedulerDatePickerRenderArgs) => React.ReactNode;
  view: SchedulerView;
  views: SchedulerView[];
  onViewChange: (view: SchedulerView) => void;
  viewLabels?: Partial<Record<SchedulerView, React.ReactNode>>;
  visibleDays: Date[];
  workingDays?: SchedulerWeekday[];
};

export function Toolbar({
  selectedDate,
  onSelectedDateChange,
  prevButtonLabel,
  nextButtonLabel,
  renderToolbar,
  renderDatePicker,
  view,
  views,
  onViewChange,
  viewLabels,
  visibleDays,
  workingDays,
}: SchedulerToolbarProps) {
  const isWorkingDay = (date: Date) => isSchedulerWorkingDay(date, workingDays);
  // Without workingDays these move by exactly one day, as before.
  const goToPreviousDay = () =>
    onSelectedDateChange(shiftWorkingDays(selectedDate, -1, workingDays));
  const goToNextDay = () => onSelectedDateChange(shiftWorkingDays(selectedDate, 1, workingDays));
  const goToPrevious =
    view === "week" ? () => onSelectedDateChange(shiftDays(selectedDate, -7)) : goToPreviousDay;
  const goToNext =
    view === "week" ? () => onSelectedDateChange(shiftDays(selectedDate, 7)) : goToNextDay;
  const defaultDatePicker = (renderDatePicker ?? defaultRenderDatePicker)({
    selectedDate,
    onSelectedDateChange,
    isWorkingDay,
  });
  const defaultViewSwitcher =
    views.length > 1 ? (
      <div
        role="group"
        aria-label="View"
        className="rfs:flex rfs:items-center rfs:gap-1 rfs:rounded-lg rfs:border rfs:border-border rfs:bg-card rfs:p-1 rfs:shadow-xs"
      >
        {views.map((option) => (
          <Button
            key={option}
            variant={option === view ? "default" : "ghost"}
            size="sm"
            aria-pressed={option === view}
            onClick={() => onViewChange(option)}
          >
            {viewLabels?.[option] ?? DEFAULT_VIEW_LABELS[option]}
          </Button>
        ))}
      </div>
    ) : null;
  const args: SchedulerToolbarRenderArgs = {
    selectedDate,
    onSelectedDateChange,
    goToPreviousDay,
    goToNextDay,
    goToPrevious,
    goToNext,
    visibleDays,
    isWorkingDay,
    defaultDatePicker,
    view,
    views,
    onViewChange,
    defaultViewSwitcher,
  };

  if (renderToolbar) {
    return <>{renderToolbar(args)}</>;
  }

  return <>{defaultRenderToolbar({ ...args, prevButtonLabel, nextButtonLabel })}</>;
}
