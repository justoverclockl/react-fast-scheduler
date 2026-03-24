import type { SchedulerAppointmentAdapter, SchedulerEvent, SchedulerId } from "./scheduler";

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
> = SchedulerEvent<TAppointment, TResourceId> & {
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
