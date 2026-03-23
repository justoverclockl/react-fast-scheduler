import * as React from "react";
import type { DefaultRenderDatePickerProps } from "./types";
import { fromInputDateValue, toInputDateValue } from "../../utils/scheduler-core.utils";

export function defaultRenderDatePicker({ selectedDate, onSelectedDateChange }: DefaultRenderDatePickerProps) {
  return (
    <input
      type="date"
      value={toInputDateValue(selectedDate)}
      onChange={(event) => {
        const nextDate = fromInputDateValue(event.target.value);
        if (nextDate) {
          onSelectedDateChange(nextDate);
        }
      }}
      className="h-7 rounded-md border border-border bg-card px-2 text-xs text-foreground"
      aria-label="Select date"
    />
  );
}
