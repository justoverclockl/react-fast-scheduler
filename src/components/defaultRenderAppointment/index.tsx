import CardBody from "@components/defaultRenderAppointment/parts/CardBody";
import ResizeBar from "@components/defaultRenderAppointment/parts/ResizeBar";

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
      <CardBody
        isDropInvalid={isDropInvalid}
        title={appointment.title}
        description={description}
      />
      <ResizeBar
        onResizePointerDown={onResizePointerDown}
        appointment={appointment}
      />
    </div>
  );
}
