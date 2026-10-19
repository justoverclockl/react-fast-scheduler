import { defaultRenderDatePicker } from "@components/defaultRenderDatePicker";
import { defaultRenderToolbar } from "@components/defaultRenderToolbar";
import { Button } from "@components/ui/button";
import { shiftDays } from "@utils/scheduler-core.utils";
import * as React from "react";

import type { SchedulerToolbarRenderArgs, SchedulerView } from "@rfs-types";

const DEFAULT_VIEW_LABELS: Record<SchedulerView, React.ReactNode> = {
  day: "Day",
  agenda: "Agenda",
};

type SchedulerToolbarProps = {
  selectedDate: Date;
  onSelectedDateChange: (date: Date) => void;
  prevButtonLabel: React.ReactNode;
  nextButtonLabel: React.ReactNode;
  renderToolbar?: (args: SchedulerToolbarRenderArgs) => React.ReactNode;
  renderDatePicker?: (args: {
    selectedDate: Date;
    onSelectedDateChange: (date: Date) => void;
  }) => React.ReactNode;
  view: SchedulerView;
  views: SchedulerView[];
  onViewChange: (view: SchedulerView) => void;
  viewLabels?: Partial<Record<SchedulerView, React.ReactNode>>;
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
}: SchedulerToolbarProps) {
  const goToPreviousDay = () => onSelectedDateChange(shiftDays(selectedDate, -1));
  const goToNextDay = () => onSelectedDateChange(shiftDays(selectedDate, 1));
  const defaultDatePicker = (renderDatePicker ?? defaultRenderDatePicker)({
    selectedDate,
    onSelectedDateChange,
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
