
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
          className="min-w-40 justify-start text-left font-normal"
        >
          {format(selectedDate, "PPP")}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-2"
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
