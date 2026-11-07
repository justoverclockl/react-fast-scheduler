import { WEEK_DAY_MIN_W, WEEK_RESOURCE_W } from "@components/constants";
import { defaultRenderResourceHeader } from "@components/defaultRenderResourceHeader";
import { cn } from "@lib/cn";
import { dayISO } from "@utils/scheduler-core.utils";
import { format } from "date-fns";
import * as React from "react";

import { WeekRow } from "./WeekRow";

import type {
  BaseSchedulerResource,
  SchedulerAgendaItemRenderArgs,
  SchedulerAppointmentAppearance,
  SchedulerId,
  SchedulerPresentationAppointment,
} from "@rfs-types/scheduler";

type WeekProps<
  TAppointment,
  TResource extends BaseSchedulerResource<TResourceId>,
  TResourceId extends SchedulerId,
> = {
  visibleDays: Date[];
  appointments: SchedulerPresentationAppointment<TAppointment, TResourceId>[];
  resources: TResource[];
  appointmentAppearanceByResource: Map<TResourceId, SchedulerAppointmentAppearance | undefined>;
  onAppointmentClick?: (appointment: TAppointment, event: React.MouseEvent<HTMLElement>) => void;
  renderResourceHeader?: (resource: TResource) => React.ReactNode;
  renderWeekDayHeader?: (date: Date) => React.ReactNode;
  renderAgendaItem?: (
    args: SchedulerAgendaItemRenderArgs<TAppointment, TResource, TResourceId>
  ) => React.ReactNode;
};

const NO_APPOINTMENTS: never[] = [];

const defaultRenderWeekDayHeader = (date: Date) => <strong>{format(date, "EEE d")}</strong>;

/**
 * Week view: one row per resource and one column per day. Each cell lists that resource's
 * appointments of that day, ordered by start time.
 */
export function Week<
  TAppointment,
  TResource extends BaseSchedulerResource<TResourceId>,
  TResourceId extends SchedulerId,
>({
  visibleDays,
  appointments,
  resources,
  appointmentAppearanceByResource,
  onAppointmentClick,
  renderResourceHeader,
  renderWeekDayHeader = defaultRenderWeekDayHeader,
  renderAgendaItem,
}: WeekProps<TAppointment, TResource, TResourceId>) {
  // Appointments of each resource. Like the other views, appointments without a matching
  // resource are not shown.
  const byResource = React.useMemo(() => {
    const map = new Map<TResourceId, SchedulerPresentationAppointment<TAppointment, TResourceId>[]>();
    for (const appointment of appointments) {
      const list = map.get(appointment.resourceId) ?? [];
      list.push(appointment);
      map.set(appointment.resourceId, list);
    }
    return map;
  }, [appointments]);

  // Stable across renders, so it does not defeat the memoized rows.
  const renderHeader = React.useMemo(
    () =>
      renderResourceHeader ?? ((resource: TResource) => defaultRenderResourceHeader({ resource })),
    [renderResourceHeader]
  );

  const todayISO = dayISO(new Date());
  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `${WEEK_RESOURCE_W}px repeat(${visibleDays.length}, minmax(${WEEK_DAY_MIN_W}px, 1fr))`,
    minWidth: WEEK_RESOURCE_W + visibleDays.length * WEEK_DAY_MIN_W,
  };

  return (
    <div className="rfs-week rfs-shell rfs:border-border rfs:bg-card">
      <div style={gridStyle}>
        <div className="rfs-week-corner rfs:sticky rfs:left-0 rfs:z-20 rfs:border-r rfs:border-b rfs:border-border rfs:bg-card" />
        {visibleDays.map((day) => {
          const isToday = dayISO(day) === todayISO;
          return (
            <div
              key={dayISO(day)}
              className={cn(
                "rfs:border-r rfs:border-b rfs:border-border rfs:bg-card rfs:px-2 rfs:py-2",
                isToday ? "rfs:text-primary" : "rfs:text-foreground"
              )}
              aria-current={isToday ? "date" : undefined}
            >
              {renderWeekDayHeader(day)}
            </div>
          );
        })}

        {resources.map((resource) => (
          <WeekRow
            key={String(resource.id)}
            resource={resource}
            visibleDays={visibleDays}
            appointments={byResource.get(resource.id) ?? NO_APPOINTMENTS}
            appointmentAppearance={appointmentAppearanceByResource.get(resource.id)}
            onAppointmentClick={onAppointmentClick}
            renderHeader={renderHeader}
            renderAgendaItem={renderAgendaItem}
          />
        ))}
      </div>
    </div>
  );
}
