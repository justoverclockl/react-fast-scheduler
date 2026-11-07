import { Button } from "@components/ui/button";
import * as React from "react";

import type { SchedulerToolbarRenderArgs } from "@rfs-types";

type DefaultRenderToolbarProps = SchedulerToolbarRenderArgs & {
  prevButtonLabel?: React.ReactNode;
  nextButtonLabel?: React.ReactNode;
};

export function defaultRenderToolbar({
  goToPrevious,
  goToNext,
  defaultDatePicker,
  defaultViewSwitcher,
  prevButtonLabel = "Prev",
  nextButtonLabel = "Next",
}: DefaultRenderToolbarProps) {
  return (
    <div className="rfs-toolbar">
      <div className="rfs:flex rfs:items-center rfs:gap-2 rfs:rounded-lg rfs:border rfs:border-border rfs:bg-card rfs:p-1 rfs:shadow-xs">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPrevious}
        >
          {prevButtonLabel}
        </Button>
        {defaultDatePicker}
        <Button
          variant="outline"
          size="sm"
          onClick={goToNext}
        >
          {nextButtonLabel}
        </Button>
      </div>
      {defaultViewSwitcher && <div className="rfs:ml-auto">{defaultViewSwitcher}</div>}
    </div>
  );
}
