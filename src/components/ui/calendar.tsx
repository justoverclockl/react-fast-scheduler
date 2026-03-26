import { cn } from "@lib/cn";
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import * as React from "react";

import { Button } from "./button";

export function Calendar({
  selected,
  onSelect,
}: {
  selected?: Date;
  onSelect?: (date: Date) => void;
}) {
  const [month, setMonth] = React.useState(selected ?? new Date());

  React.useEffect(() => {
    if (selected) {
      setMonth(selected);
    }
  }, [selected]);

  const monthStart = startOfMonth(month);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
  const days: Date[] = [];

  for (let day = calendarStart; day <= calendarEnd; day = addDays(day, 1)) {
    days.push(day);
  }

  return (
    <div className="rfs:w-72 rfs:rounded-md rfs:bg-popover">
      <div className="rfs:mb-2 rfs:flex rfs:items-center rfs:justify-between">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Previous month"
          onClick={() => setMonth(addMonths(month, -1))}
        >
          {"<"}
        </Button>
        <div className="rfs:text-sm rfs:font-medium">{format(month, "MMMM yyyy")}</div>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Next month"
          onClick={() => setMonth(addMonths(month, 1))}
        >
          {">"}
        </Button>
      </div>

      <div className="rfs:grid rfs:grid-cols-7 rfs:gap-1 rfs:text-center rfs:text-xs rfs:text-muted-foreground">
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((label) => (
          <div
            key={label}
            className="rfs:py-1"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="rfs:grid rfs:grid-cols-7 rfs:gap-1">
        {days.map((day) => {
          const isSelected = selected ? isSameDay(day, selected) : false;
          return (
            <Button
              key={day.toISOString()}
              variant={isSelected ? "default" : "ghost"}
              size="icon"
              className={cn(
                "rfs:text-xs",
                !isSameMonth(day, month) &&
                  "rfs:text-muted-foreground rfs:opacity-60",
                isToday(day) && !isSelected && "rfs:border rfs:border-border"
              )}
              onClick={() => onSelect?.(day)}
            >
              {format(day, "d")}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
