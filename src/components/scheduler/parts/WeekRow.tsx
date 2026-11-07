import { cn } from "@lib/cn";
import { dayISO } from "@utils/scheduler-core.utils";
import { format } from "date-fns";
import * as React from "react";

import type {
  BaseSchedulerResource,
  SchedulerAgendaItemRenderArgs,
  SchedulerAppointmentAppearance,
  SchedulerId,
  SchedulerPresentationAppointment,
} from "@rfs-types/scheduler";

type WeekRowProps<
  TAppointment,
  TResource extends BaseSchedulerResource<TResourceId>,
  TResourceId extends SchedulerId,
> = {
  resource: TResource;
  visibleDays: Date[];
  /** This resource's appointments in the visible days, in any order. */
  appointments: SchedulerPresentationAppointment<TAppointment, TResourceId>[];
  appointmentAppearance: SchedulerAppointmentAppearance | undefined;
  onAppointmentClick?: (appointment: TAppointment, event: React.MouseEvent<HTMLElement>) => void;
  renderHeader: (resource: TResource) => React.ReactNode;
  renderAgendaItem?: (
    args: SchedulerAgendaItemRenderArgs<TAppointment, TResource, TResourceId>
  ) => React.ReactNode;
};

const formatTime = (date: Date) => format(date, "HH:mm");

function DefaultWeekItem<TAppointment, TResourceId extends SchedulerId>({
  appointment,
}: {
  appointment: SchedulerPresentationAppointment<TAppointment, TResourceId>;
}) {
  return (
    <>
      <span className="rfs:block rfs:text-[11px] rfs:font-bold rfs:tabular-nums">
        {formatTime(appointment.start)}–{formatTime(appointment.end)}
      </span>
      <span className="rfs:block rfs:text-xs rfs:leading-snug rfs:font-semibold">
        {appointment.title}
      </span>
    </>
  );
}

/** One resource of the week view: its header cell and one cell per visible day. */
function WeekRowInner<
  TAppointment,
  TResource extends BaseSchedulerResource<TResourceId>,
  TResourceId extends SchedulerId,
>({
  resource,
  visibleDays,
  appointments,
  appointmentAppearance,
  onAppointmentClick,
  renderHeader,
  renderAgendaItem,
}: WeekRowProps<TAppointment, TResource, TResourceId>) {
  const byDay = new Map<string, SchedulerPresentationAppointment<TAppointment, TResourceId>[]>();
  for (const appointment of appointments) {
    const key = dayISO(appointment.start);
    const list = byDay.get(key) ?? [];
    list.push(appointment);
    byDay.set(key, list);
  }
  for (const list of byDay.values()) list.sort((a, b) => a.start.getTime() - b.start.getTime());

  const renderItem = (appointment: SchedulerPresentationAppointment<TAppointment, TResourceId>) => {
    const handleClick = onAppointmentClick
      ? (event: React.MouseEvent<HTMLElement>) => onAppointmentClick(appointment.raw, event)
      : undefined;

    if (renderAgendaItem) {
      return (
        <li
          key={appointment.renderKey}
          onClick={handleClick}
        >
          {renderAgendaItem({ appointment, resource, appointmentAppearance })}
        </li>
      );
    }

    const rowClassName = cn(
      "rfs:block rfs:w-full rfs:rounded-md rfs:px-2 rfs:py-1 rfs:text-left rfs:text-foreground",
      appointmentAppearance?.className ?? "rfs:bg-muted/40 rfs:dark:bg-muted/30"
    );

    return (
      <li key={appointment.renderKey}>
        {handleClick ? (
          <button
            type="button"
            className={cn(rowClassName, "rfs:cursor-pointer")}
            onClick={handleClick}
          >
            <DefaultWeekItem appointment={appointment} />
          </button>
        ) : (
          <div className={rowClassName}>
            <DefaultWeekItem appointment={appointment} />
          </div>
        )}
      </li>
    );
  };

  return (
    <>
      <div className="rfs-resource-header rfs:sticky rfs:left-0 rfs:z-10 rfs:border-b rfs:border-border rfs:bg-card rfs:text-foreground">
        {renderHeader(resource)}
      </div>
      {visibleDays.map((day) => (
        <ul
          key={dayISO(day)}
          aria-label={`${resource.label}, ${format(day, "EEE d")}`}
          className="rfs:flex rfs:min-h-12 rfs:flex-col rfs:gap-1 rfs:border-r rfs:border-b rfs:border-border rfs:p-1"
        >
          {(byDay.get(dayISO(day)) ?? []).map(renderItem)}
        </ul>
      ))}
    </>
  );
}

// Appointments are rebuilt as new objects whenever `appointments` changes, so compare what is
// shown instead of object identity: a row re-renders only when its own appointments changed.
const sameAppointments = <TAppointment, TResourceId extends SchedulerId>(
  a: SchedulerPresentationAppointment<TAppointment, TResourceId>[],
  b: SchedulerPresentationAppointment<TAppointment, TResourceId>[]
) =>
  a === b ||
  (a.length === b.length &&
    a.every((item, i) => {
      const other = b[i];
      return (
        item.raw === other.raw &&
        item.renderKey === other.renderKey &&
        item.title === other.title &&
        item.start.getTime() === other.start.getTime() &&
        item.end.getTime() === other.end.getTime()
      );
    }));

const areWeekRowsEqual = <
  TAppointment,
  TResource extends BaseSchedulerResource<TResourceId>,
  TResourceId extends SchedulerId,
>(
  prev: Readonly<WeekRowProps<TAppointment, TResource, TResourceId>>,
  next: Readonly<WeekRowProps<TAppointment, TResource, TResourceId>>
) =>
  prev.resource === next.resource &&
  prev.visibleDays === next.visibleDays &&
  prev.appointmentAppearance === next.appointmentAppearance &&
  prev.onAppointmentClick === next.onAppointmentClick &&
  prev.renderHeader === next.renderHeader &&
  prev.renderAgendaItem === next.renderAgendaItem &&
  sameAppointments(prev.appointments, next.appointments);

export const WeekRow = React.memo(WeekRowInner, areWeekRowsEqual) as typeof WeekRowInner;
