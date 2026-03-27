import type { ResizeBarProps } from "./types";
import type { SchedulerId } from "@rfs-types/scheduler";

export default function ResizeBar<TAppointment, TResourceId extends SchedulerId>({
  appointment,
  onResizePointerDown,
}: ResizeBarProps<TAppointment, TResourceId>) {
  return (
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
  );
}
