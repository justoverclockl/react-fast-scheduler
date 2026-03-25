import type {
  BaseSchedulerResource,
  SchedulerAppointmentAppearance,
  SchedulerAppointmentAdapter,
  SchedulerDragState,
  SchedulerId,
  SchedulerPresentationAppointment,
} from "./scheduler";
import type * as React from "react";

export type NameLike = {
  firstName?: string | null;
  lastName?: string | null;
};

export type TimeBlockLike<TId extends string | number = string | number> = {
  id: TId;
  startMin: number;
  endMin: number;
};

export type LaidOut<T extends TimeBlockLike> = T & {
  lane: number;
  lanes: number;
};

export type SchedulerLayoutAppointment<
  TAppointment,
  TResourceId extends SchedulerId,
> = SchedulerPresentationAppointment<TAppointment, TResourceId> & {
  lane: number;
  lanes: number;
};

export type BuildResourceMapOptions<TResource, TResourceId extends SchedulerId, TValue> = {
  fallback?: TValue;
  getValue: (resource: TResource) => TValue;
  resources: TResource[];
  toKey: (resource: TResource) => TResourceId;
};

export type NormalizeAppointmentsArgs<TAppointment, TResourceId extends SchedulerId> = {
  adapter: SchedulerAppointmentAdapter<TAppointment, TResourceId>;
  appointments: TAppointment[];
  dayMinutes: number;
  dayStartAbs: number;
  selectedISO: string;
};

export type SchedulerResourceColumnProps<TAppointment, TResourceId extends SchedulerId> = {
  resource: BaseSchedulerResource<TResourceId>;
  colRefs: React.RefObject<Record<string, HTMLDivElement | null>>;
  gridHeight: number;
  dayMinutes: number;
  appointments: SchedulerLayoutAppointment<TAppointment, TResourceId>[];
  appointmentAppearance: SchedulerAppointmentAppearance | undefined;
  appointmentBg: string | undefined;
  isDropInvalid: boolean;
  renderAppointment?: (args: {
    appointment: SchedulerPresentationAppointment<TAppointment, TResourceId> & {
      lane: number;
      lanes: number;
    };
    isDropInvalid: boolean;
    onPointerDown: (e: React.PointerEvent) => void;
    onResizePointerDown: (e: React.PointerEvent) => void;
    appointmentAppearance?: SchedulerAppointmentAppearance;
    appointmentBackgroundColor?: string;
    drag: SchedulerDragState<TResourceId>;
    suppressClickRef: React.RefObject<boolean>;
  }) => React.ReactNode;
  onApptPointerDown: (
    event: React.PointerEvent,
    appointment: SchedulerPresentationAppointment<TAppointment, TResourceId>
  ) => void;
  onResizePointerDown: (
    event: React.PointerEvent,
    appointment: SchedulerPresentationAppointment<TAppointment, TResourceId>
  ) => void;
  drag: SchedulerDragState<TResourceId>;
  suppressClickRef: React.RefObject<boolean>;
};
