import type * as React from "react";
import type {
  BaseSchedulerResource,
  SchedulerAppointmentAppearance,
  SchedulerDragState,
  SchedulerEvent,
  SchedulerId,
  SchedulerProps
} from "../types/scheduler";
import type { SchedulerLayoutAppointment } from "../types/internal";

export type SchedulerMetrics = {
  dayStartAbs: number;
  dayEndAbs: number;
  dayMinutes: number;
  gridHeight: number;
  gridMinWidth: number;
};

export type SchedulerBaseData<TAppointment, TResourceId extends SchedulerId> = SchedulerMetrics & {
  appointmentMap: Map<SchedulerId, SchedulerEvent<TAppointment, TResourceId>>;
  renderAppts: SchedulerEvent<TAppointment, TResourceId>[];
};

export type SchedulerPresentationData<TAppointment, TResourceId extends SchedulerId> = {
  appointmentAppearanceByResource: Map<TResourceId, SchedulerAppointmentAppearance | undefined>;
  appointmentBgByResource: Map<TResourceId, string | undefined>;
  effectiveAppts: SchedulerEvent<TAppointment, TResourceId>[];
  laidOutByResource: Map<TResourceId, SchedulerLayoutAppointment<TAppointment, TResourceId>[]>;
};

export type UseSchedulerBaseDataArgs<
  TAppointment,
  TResource extends BaseSchedulerResource<TResourceId>,
  TResourceId extends SchedulerId
> = Pick<SchedulerProps<TAppointment, TResource, TResourceId>, "adapter" | "appointments" | "resources" | "selectedDate" | "dayEnd" | "dayStart"> & {
  dayEnd?: string;
  dayStart?: string;
};

export type UseSchedulerInteractionsArgs<
  TAppointment,
  TResource extends BaseSchedulerResource<TResourceId>,
  TResourceId extends SchedulerId
> = Pick<SchedulerProps<TAppointment, TResource, TResourceId>, "onAppointmentChange" | "onPersistMoveResize" | "resources" | "selectedDate"> & {
  appointmentMap: Map<SchedulerId, SchedulerEvent<TAppointment, TResourceId>>;
  dayMinutes: number;
  dayStartAbs: number;
  renderAppts: SchedulerEvent<TAppointment, TResourceId>[];
};

export type UseSchedulerPresentationDataArgs<
  TAppointment,
  TResource extends BaseSchedulerResource<TResourceId>,
  TResourceId extends SchedulerId
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
  renderAppts: SchedulerEvent<TAppointment, TResourceId>[];
};

export type SchedulerInteractions<TAppointment, TResourceId extends SchedulerId> = {
  colRefs: React.RefObject<Record<string, HTMLDivElement | null>>;
  drag: SchedulerDragState<TResourceId>;
  onApptPointerDown: (event: React.PointerEvent, appointment: SchedulerEvent<TAppointment, TResourceId>) => void;
  onGlobalPointerMove: (event: React.PointerEvent<HTMLElement>) => void;
  onGlobalPointerUp: () => void;
  onResizePointerDown: (event: React.PointerEvent, appointment: SchedulerEvent<TAppointment, TResourceId>) => void;
  suppressClickRef: React.RefObject<boolean>;
};
