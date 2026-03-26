
import { Button } from "@components/ui/button";
import { Calendar } from "@components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover";
import { format } from "date-fns";
import * as React from "react";

import type { DefaultRenderDatePickerProps } from "./types";

export function defaultRenderDatePicker({
  selectedDate,
  onSelectedDateChange,
}: DefaultRenderDatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="rfs:min-w-40 rfs:justify-start rfs:text-left rfs:font-normal"
        >
          {format(selectedDate, "PPP")}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="rfs:w-auto rfs:p-2"
        align="center"
      >
        <Calendar
          selected={selectedDate}
          onSelect={onSelectedDateChange}
        />
      </PopoverContent>
    </Popover>
  );
}
