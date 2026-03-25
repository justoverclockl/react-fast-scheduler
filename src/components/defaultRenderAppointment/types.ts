import type {
  SchedulerAppointmentAppearance,
  SchedulerDragState,
  SchedulerId,
  SchedulerPresentationAppointment,
} from "@rfs-types/scheduler";
import type * as React from "react";
import type { RefObject } from "react";

export type DefaultRenderAppointmentProps<TAppointment, TResourceId extends SchedulerId> = {
  appointment: SchedulerPresentationAppointment<TAppointment, TResourceId> & {
    lane: number;
    lanes: number;
  };
  isDropInvalid: boolean;
  onPointerDown: (event: React.PointerEvent) => void;
  onResizePointerDown: (event: React.PointerEvent) => void;
  appointmentAppearance?: SchedulerAppointmentAppearance;
  appointmentBackgroundColor?: string;
  drag: SchedulerDragState<TResourceId>;
  suppressClickRef: RefObject<boolean>;
};
