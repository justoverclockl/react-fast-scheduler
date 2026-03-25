import { GUTTER_W, PX_PER_MIN, TOP_PAD } from "@components/constants";
import * as React from "react";

type SchedulerGutterProps = {
  dayMinutes: number;
  dayStartAbs: number;
  gridHeight: number;
};

export function Gutter({ dayMinutes, dayStartAbs, gridHeight }: SchedulerGutterProps) {
  return (
    <div
      className="rfs-times border-border bg-card"
      style={{ width: GUTTER_W, height: gridHeight }}
    >
      {Array.from({ length: Math.floor(dayMinutes / 60) + 1 }).map((_, i) => (
        <div
          key={`tick-${i}`}
          className="rfs-time-tick text-muted-foreground"
          style={{ top: TOP_PAD + i * 60 * PX_PER_MIN }}
        >
          {String(Math.floor((dayStartAbs + i * 60) / 60)).padStart(2, "0")}:
          {String((dayStartAbs + i * 60) % 60).padStart(2, "0")}
        </div>
      ))}
    </div>
  );
}
