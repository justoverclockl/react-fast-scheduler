import * as React from "react";

import type { DefaultRenderAppointmentProps } from "./types";
import type { SchedulerId } from "@rfs-types/scheduler";

export function defaultRenderAppointment<TAppointment, TResourceId extends SchedulerId>({
  appointment,
  isDropInvalid,
  onPointerDown,
  onResizePointerDown,
  appointmentAppearance,
  appointmentBackgroundColor,
}: DefaultRenderAppointmentProps<TAppointment, TResourceId>) {
  const rawMaybe = appointment.raw as { description?: unknown };
  const description = typeof rawMaybe.description === "string" ? rawMaybe.description : undefined;
  const legacyClassName =
    typeof appointmentBackgroundColor === "string" ? appointmentBackgroundColor : undefined;
  const backgroundClassName =
    appointmentAppearance?.className ?? legacyClassName ?? "rfs:bg-muted/40 rfs:dark:bg-muted/30";
  const invalidStateClassName = isDropInvalid
    ? "rfs:bg-red-100/80 rfs:text-red-950 rfs:dark:bg-red-950/40 rfs:dark:text-red-100"
    : "";
  const visualStateClassName =
    appointment.visualState === "ghost"
      ? "rfs:cursor-grab rfs:opacity-35"
      : appointment.visualState === "dragging"
        ? "rfs:cursor-grabbing rfs:opacity-55 rfs:shadow-xl"
        : "rfs:cursor-grab";
  const className = `rfs:relative rfs:h-full rfs:overflow-hidden rfs:rounded-md rfs:p-2 rfs:pb-5 rfs:text-foreground ${backgroundClassName} ${invalidStateClassName} ${visualStateClassName}`;

  return (
    <div
      onPointerDown={onPointerDown}
      className={className}
    >
      {isDropInvalid ? (
        <div className="rfs:absolute rfs:right-1 rfs:top-1 rfs:flex rfs:h-4 rfs:w-4 rfs:items-center rfs:justify-center rfs:rounded-full rfs:bg-red-600 rfs:text-[10px] rfs:font-bold rfs:text-white">
          X
        </div>
      ) : null}
      <div className="rfs:text-xs rfs:font-semibold">{appointment.title}</div>
      {description ? (
        <div className="rfs:mt-1 rfs:text-[10px] rfs:font-medium rfs:text-muted-foreground">
          {description}
        </div>
      ) : null}
      <div
        role="button"
        aria-label="Resize appointment"
        onPointerDown={(event) => {
          if (appointment.visualState === "ghost") {
            return;
          }
          event.stopPropagation();
          onResizePointerDown(event);
        }}
        className="rfs:absolute rfs:inset-x-1 rfs:bottom-1 rfs:h-2 rfs:cursor-ns-resize rfs:rounded-full rfs:bg-border/90 rfs:transition-colors rfs:hover:bg-border"
      />
    </div>
  );
}
