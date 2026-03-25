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
    appointmentAppearance?.className ?? legacyClassName ?? "bg-muted/40 dark:bg-muted/30";
  const invalidStateClassName = isDropInvalid
    ? "border-red-500 bg-red-100/80 text-red-950 ring-1 ring-red-500/60 dark:bg-red-950/40 dark:text-red-100"
    : "";
  const visualStateClassName =
    appointment.visualState === "ghost"
      ? "cursor-grab border-dashed opacity-35"
      : appointment.visualState === "dragging"
        ? "cursor-grabbing opacity-55 shadow-xl ring-1 ring-border/70"
        : "cursor-grab";
  const className = `relative h-full overflow-hidden rounded-md border border-border p-2 pb-5 text-foreground ${backgroundClassName} ${invalidStateClassName} ${visualStateClassName}`;

  return (
    <div
      onPointerDown={onPointerDown}
      className={className}
    >
      {isDropInvalid ? (
        <div className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
          X
        </div>
      ) : null}
      <div className="text-xs font-semibold">{appointment.title}</div>
      {description ? (
        <div className="mt-1 text-[10px] font-medium text-muted-foreground">{description}</div>
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
        className="absolute inset-x-1 bottom-1 h-2 cursor-ns-resize rounded-full bg-border/90 transition-colors hover:bg-border"
      />
    </div>
  );
}
