import type {
  SchedulerAppointmentAppearance,
  SchedulerDragState,
  SchedulerEvent,
  SchedulerId,
} from "@rfs-types/scheduler";
import type * as React from "react";
import type { RefObject } from "react";

export type DefaultRenderAppointmentProps<TAppointment, TResourceId extends SchedulerId> = {
  appointment: SchedulerEvent<TAppointment, TResourceId> & { lane: number; lanes: number };
  onPointerDown: (event: React.PointerEvent) => void;
  onResizePointerDown: (event: React.PointerEvent) => void;
  appointmentAppearance?: SchedulerAppointmentAppearance;
  appointmentBackgroundColor?: string;
  drag: SchedulerDragState<TResourceId>;
  suppressClickRef: RefObject<boolean>;
};
