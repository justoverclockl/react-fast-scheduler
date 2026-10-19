import React, { RefObject } from "react";

export type SchedulerAppointmentAdapter<TAppointment, TResourceId extends string | number> = {
  getId: (item: TAppointment) => number | string;
  getResourceId: (item: TAppointment) => TResourceId;
  getStart: (item: TAppointment) => Date | string;
  getEnd: (item: TAppointment) => Date | string;
  getTitle: (item: TAppointment) => string;
};

export type SchedulerAppointmentField<TAppointment, TValue> =
  | Extract<keyof TAppointment, string | number>
  | ((item: TAppointment) => TValue);

export type SchedulerAppointmentFieldAdapter<
  TAppointment,
  TResourceId extends string | number,
> = {
  id: SchedulerAppointmentField<TAppointment, number | string>;
  resourceId: SchedulerAppointmentField<TAppointment, TResourceId>;
  start: SchedulerAppointmentField<TAppointment, Date | string>;
  end: SchedulerAppointmentField<TAppointment, Date | string>;
  title: SchedulerAppointmentField<TAppointment, string>;
};

export type SchedulerAppointmentAdapterInput<
  TAppointment,
  TResourceId extends string | number,
> =
  | SchedulerAppointmentAdapter<TAppointment, TResourceId>
  | SchedulerAppointmentFieldAdapter<TAppointment, TResourceId>;

export type SchedulerId = string | number;

type SchedulerDefaultFieldValues<TResourceId extends SchedulerId> = {
  id: SchedulerId;
  resourceId: TResourceId;
  start: Date | string;
  end: Date | string;
  title: string;
};

/** Adapter fields the appointment already exposes under the default name with a compatible type. */
export type SchedulerDefaultedAppointmentField<TAppointment, TResourceId extends SchedulerId> = {
  [K in keyof SchedulerDefaultFieldValues<TResourceId>]: K extends keyof TAppointment
    ? TAppointment[K] extends SchedulerDefaultFieldValues<TResourceId>[K]
      ? K
      : never
    : never;
}[keyof SchedulerDefaultFieldValues<TResourceId>];

/**
 * Key-based adapter where fields matching the default names
 * (`id`, `resourceId`, `start`, `end`, `title`) can be omitted.
 */
export type SchedulerAppointmentPartialFieldAdapter<
  TAppointment,
  TResourceId extends SchedulerId,
> = Omit<
  SchedulerAppointmentFieldAdapter<TAppointment, TResourceId>,
  SchedulerDefaultedAppointmentField<TAppointment, TResourceId>
> &
  Partial<
    Pick<
      SchedulerAppointmentFieldAdapter<TAppointment, TResourceId>,
      SchedulerDefaultedAppointmentField<TAppointment, TResourceId>
    >
  >;

export type SchedulerAppointmentAdapterOption<TAppointment, TResourceId extends SchedulerId> =
  | SchedulerAppointmentAdapter<TAppointment, TResourceId>
  | SchedulerAppointmentPartialFieldAdapter<TAppointment, TResourceId>;

export type BaseSchedulerResource<TId extends SchedulerId = number> = {
  id: TId;
  label: string;
};

export type SchedulerEvent<TAppointment, TResourceId extends SchedulerId> = {
  raw: TAppointment;
  id: SchedulerId;
  resourceId: TResourceId;
  start: Date;
  end: Date;
  startMin: number;
  endMin: number;
  title: string;
};

export type SchedulerAppointmentVisualState = "normal" | "ghost" | "dragging";

export type SchedulerPresentationAppointment<
  TAppointment,
  TResourceId extends SchedulerId,
> = SchedulerEvent<TAppointment, TResourceId> & {
  renderKey: string;
  visualState: SchedulerAppointmentVisualState;
};

export type SchedulerDragState<TResourceId extends SchedulerId> =
  | { kind: "none" }
  | {
      kind: "move";
      appointmentId: SchedulerId;
      pointerId: number;
      resourceId: TResourceId;
      offsetMin: number;
      durationMin: number;
      startMin: number;
      endMin: number;
    }
  | {
      kind: "resize";
      appointmentId: SchedulerId;
      pointerId: number;
      resourceId: TResourceId;
      startMin: number;
      endMin: number;
    };

export type RenderSchedulerAppt<TAppointment, TResourceId extends SchedulerId> = SchedulerEvent<
  TAppointment,
  TResourceId
>;

export type SchedulerAppointmentChangeArgs<TAppointment, TResourceId extends SchedulerId> = {
  kind: "move" | "resize";
  appointment: TAppointment;
  resourceId?: TResourceId;
  start?: Date;
  end?: Date;
  previousResourceId?: TResourceId;
  previousStart?: Date;
  previousEnd?: Date;
  previous: {
    resourceId: TResourceId;
    start: Date;
    end: Date;
  };
  next: {
    resourceId: TResourceId;
    start: Date;
    end: Date;
  };
};

export type SchedulerAppointmentChangeEvent<
  TAppointment,
  TResourceId extends SchedulerId,
> = SchedulerAppointmentChangeArgs<TAppointment, TResourceId> & {
  resourceId: TResourceId;
  start: Date;
  end: Date;
  previousResourceId: TResourceId;
  previousStart: Date;
  previousEnd: Date;
};

export type SchedulerAppointmentAppearance = {
  className?: string;
};

export type SchedulerAppointmentColorToken = string;
export type SchedulerResourceClassMap = Partial<Record<string, string>>;

/** `"day"` is the resource grid; `"agenda"` is a time-ordered list of the selected day. */
export type SchedulerView = "day" | "agenda";

export type SchedulerAgendaItemRenderArgs<
  TAppointment,
  TResource extends BaseSchedulerResource<TResourceId>,
  TResourceId extends SchedulerId,
> = {
  appointment: SchedulerEvent<TAppointment, TResourceId>;
  resource: TResource;
  appointmentAppearance?: SchedulerAppointmentAppearance;
};

export type SchedulerToolbarRenderArgs = {
  selectedDate: Date;
  onSelectedDateChange: (date: Date) => void;
  goToPreviousDay: () => void;
  goToNextDay: () => void;
  defaultDatePicker: React.ReactNode;
  view: SchedulerView;
  views: SchedulerView[];
  onViewChange: (view: SchedulerView) => void;
  /** Built-in view switcher, or `null` when fewer than two views are enabled. */
  defaultViewSwitcher: React.ReactNode;
};

/** `adapter` is optional only when every field can fall back to its default name. */
export type SchedulerAdapterProp<TAppointment, TResourceId extends SchedulerId> = [
  Exclude<
    keyof SchedulerDefaultFieldValues<TResourceId>,
    SchedulerDefaultedAppointmentField<TAppointment, TResourceId>
  >,
] extends [never]
  ? { adapter?: SchedulerAppointmentAdapterOption<TAppointment, TResourceId> }
  : { adapter: SchedulerAppointmentAdapterOption<TAppointment, TResourceId> };

export type SchedulerProps<
  TAppointment,
  TResource extends BaseSchedulerResource<TResourceId>,
  TResourceId extends SchedulerId,
> = SchedulerCommonProps<TAppointment, TResource, TResourceId> &
  SchedulerAdapterProp<TAppointment, TResourceId>;

export type SchedulerCommonProps<
  TAppointment,
  TResource extends BaseSchedulerResource<TResourceId>,
  TResourceId extends SchedulerId,
> = {
  resources: TResource[];
  appointments: TAppointment[];
  selectedDate: Date;
  onSelectedDateChange: (date: Date) => void;
  /** Called on a plain click (not after a drag or resize). */
  onAppointmentClick?: (appointment: TAppointment, event: React.MouseEvent<HTMLElement>) => void;
  onPersistMoveResize?: (args: {
    appointment: TAppointment;
    resourceId: TResourceId;
    start: Date;
    end: Date;
  }) => Promise<void> | void;
  onAppointmentChange?: (
    args: SchedulerAppointmentChangeEvent<TAppointment, TResourceId>
  ) => Promise<void> | void;
  renderResourceHeader?: (resource: TResource) => React.ReactNode;
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
    suppressClickRef: RefObject<boolean>;
  }) => React.ReactNode;
  resourceAppointmentClassMap?: SchedulerResourceClassMap;
  getResourceAppointmentAppearance?: (
    resource: TResource
  ) => SchedulerAppointmentAppearance | undefined;
  getResourceAppointmentColorToken?: (
    resource: TResource
  ) => SchedulerAppointmentColorToken | undefined;
  appointmentColorTokenClassMap?: Record<SchedulerAppointmentColorToken, string>;
  getResourceAppointmentBackground?: (resource: TResource) => string | undefined;
  renderToolbar?: (args: SchedulerToolbarRenderArgs) => React.ReactNode;
  renderDatePicker?: (args: {
    selectedDate: Date;
    onSelectedDateChange: (date: Date) => void;
  }) => React.ReactNode;
  prevButtonLabel?: React.ReactNode;
  nextButtonLabel?: React.ReactNode;
  dayStart?: string;
  dayEnd?: string;
  editable?: boolean;
  /** Views offered by the built-in switcher. Defaults to `["day"]` (no switcher). */
  views?: SchedulerView[];
  /** Controlled view. */
  view?: SchedulerView;
  /** Initial view when `view` is not controlled. Defaults to the first entry of `views`. */
  defaultView?: SchedulerView;
  onViewChange?: (view: SchedulerView) => void;
  viewLabels?: Partial<Record<SchedulerView, React.ReactNode>>;
  renderAgendaItem?: (
    args: SchedulerAgendaItemRenderArgs<TAppointment, TResource, TResourceId>
  ) => React.ReactNode;
  /** Shown in the agenda view when the selected day has no appointments. */
  agendaEmptyState?: React.ReactNode;
};
