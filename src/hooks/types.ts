import type { SchedulerLayoutAppointment } from "@rfs-types/internal";
import type {
  BaseSchedulerResource,
  SchedulerAppointmentAppearance,
  SchedulerDragState,
  SchedulerId,
  SchedulerPresentationAppointment,
  SchedulerProps,
} from "@rfs-types/scheduler";
import type * as React from "react";

export type SchedulerMetrics = {
  dayStartAbs: number;
  dayEndAbs: number;
  dayMinutes: number;
  gridHeight: number;
  gridMinWidth: number;
};

export type SchedulerBaseData<TAppointment, TResourceId extends SchedulerId> = SchedulerMetrics & {
  appointmentMap: Map<SchedulerId, SchedulerPresentationAppointment<TAppointment, TResourceId>>;
  renderAppts: SchedulerPresentationAppointment<TAppointment, TResourceId>[];
};

export type SchedulerPresentationData<TAppointment, TResourceId extends SchedulerId> = {
  appointmentAppearanceByResource: Map<TResourceId, SchedulerAppointmentAppearance | undefined>;
  appointmentBgByResource: Map<TResourceId, string | undefined>;
  effectiveAppts: SchedulerPresentationAppointment<TAppointment, TResourceId>[];
  laidOutByResource: Map<TResourceId, SchedulerLayoutAppointment<TAppointment, TResourceId>[]>;
};

export type SchedulerMovePreview<TAppointment, TResourceId extends SchedulerId> = {
  appointment: SchedulerPresentationAppointment<TAppointment, TResourceId>;
  clientX: number;
  clientY: number;
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
};

export type UseSchedulerBaseDataArgs<
  TAppointment,
  TResource extends BaseSchedulerResource<TResourceId>,
  TResourceId extends SchedulerId,
> = Pick<
  SchedulerProps<TAppointment, TResource, TResourceId>,
  "adapter" | "appointments" | "resources" | "selectedDate" | "dayEnd" | "dayStart"
> & {
  dayEnd?: string;
  dayStart?: string;
};

export type UseSchedulerInteractionsArgs<
  TAppointment,
  TResource extends BaseSchedulerResource<TResourceId>,
  TResourceId extends SchedulerId,
> = Pick<
  SchedulerProps<TAppointment, TResource, TResourceId>,
  "onAppointmentChange" | "onPersistMoveResize" | "resources" | "selectedDate"
> & {
  appointmentMap: Map<SchedulerId, SchedulerPresentationAppointment<TAppointment, TResourceId>>;
  dayMinutes: number;
  dayStartAbs: number;
  renderAppts: SchedulerPresentationAppointment<TAppointment, TResourceId>[];
};

export type UseSchedulerPresentationDataArgs<
  TAppointment,
  TResource extends BaseSchedulerResource<TResourceId>,
  TResourceId extends SchedulerId,
> = Pick<
  SchedulerProps<TAppointment, TResource, TResourceId>,
  | "appointmentColorTokenClassMap"
  | "getResourceAppointmentAppearance"
  | "getResourceAppointmentBackground"
  | "getResourceAppointmentColorToken"
  | "resourceAppointmentClassMap"
  | "resources"
  | "selectedDate"
> & {
  dayStartAbs: number;
  drag: SchedulerDragState<TResourceId>;
  renderAppts: SchedulerPresentationAppointment<TAppointment, TResourceId>[];
};

export type SchedulerInteractions<TAppointment, TResourceId extends SchedulerId> = {
  colRefs: React.RefObject<Record<string, HTMLDivElement | null>>;
  drag: SchedulerDragState<TResourceId>;
  movePreview: SchedulerMovePreview<TAppointment, TResourceId> | null;
  onApptPointerDown: (
    event: React.PointerEvent,
    appointment: SchedulerPresentationAppointment<TAppointment, TResourceId>
  ) => void;
  onGlobalPointerMove: (event: React.PointerEvent<HTMLElement>) => void;
  onGlobalPointerUp: () => void;
  onResizePointerDown: (
    event: React.PointerEvent,
    appointment: SchedulerPresentationAppointment<TAppointment, TResourceId>
  ) => void;
  suppressClickRef: React.RefObject<boolean>;
};
