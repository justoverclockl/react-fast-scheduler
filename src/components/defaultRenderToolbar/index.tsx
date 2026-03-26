import { Button } from "@components/ui/button";
import * as React from "react";

import type { SchedulerToolbarRenderArgs } from "@rfs-types";

type DefaultRenderToolbarProps = SchedulerToolbarRenderArgs & {
  prevButtonLabel?: React.ReactNode;
  nextButtonLabel?: React.ReactNode;
};

export function defaultRenderToolbar({
  goToPreviousDay,
  goToNextDay,
  defaultDatePicker,
  prevButtonLabel = "Prev",
  nextButtonLabel = "Next",
}: DefaultRenderToolbarProps) {
  return (
    <div className="rfs-toolbar">
      <div className="rfs:flex rfs:items-center rfs:gap-2 rfs:rounded-lg rfs:border rfs:border-border rfs:bg-card rfs:p-1 rfs:shadow-xs">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPreviousDay}
        >
          {prevButtonLabel}
        </Button>
        {defaultDatePicker}
        <Button
          variant="outline"
          size="sm"
          onClick={goToNextDay}
        >
          {nextButtonLabel}
        </Button>
      </div>
    </div>
  );
}
