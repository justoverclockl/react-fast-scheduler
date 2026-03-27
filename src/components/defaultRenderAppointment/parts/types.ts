import type { SchedulerId, SchedulerPresentationAppointment } from "@rfs-types/scheduler";
import type * as React from "react";

export type ResizeBarProps<TAppointment, TResourceId extends SchedulerId> = {
  onResizePointerDown: (event: React.PointerEvent) => void;
  appointment: SchedulerPresentationAppointment<TAppointment, TResourceId>;
};

export interface CardBodyProps {
    isDropInvalid: boolean
    title: string
    description?: string
}