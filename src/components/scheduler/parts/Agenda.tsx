import { RESOURCE_MIN_W } from "@components/constants";
import { cn } from "@lib/cn";
import { format } from "date-fns";
import * as React from "react";

import { Header } from "./Header";

import type {
  BaseSchedulerResource,
  SchedulerAgendaItemRenderArgs,
  SchedulerAppointmentAppearance,
  SchedulerId,
  SchedulerPresentationAppointment,
} from "@rfs-types/scheduler";

type AgendaProps<
  TAppointment,
  TResource extends BaseSchedulerResource<TResourceId>,
  TResourceId extends SchedulerId,
> = {
  appointments: SchedulerPresentationAppointment<TAppointment, TResourceId>[];
  resources: TResource[];
  appointmentAppearanceByResource: Map<TResourceId, SchedulerAppointmentAppearance | undefined>;
  onAppointmentClick?: (appointment: TAppointment, event: React.MouseEvent<HTMLElement>) => void;
  renderResourceHeader?: (resource: TResource) => React.ReactNode;
  renderAgendaItem?: (
    args: SchedulerAgendaItemRenderArgs<TAppointment, TResource, TResourceId>
  ) => React.ReactNode;
  emptyState?: React.ReactNode;
};

const formatTime = (date: Date) => format(date, "HH:mm");

function DefaultAgendaItem<TAppointment, TResourceId extends SchedulerId>({
  appointment,
}: {
  appointment: SchedulerPresentationAppointment<TAppointment, TResourceId>;
}) {
  const rawMaybe = appointment.raw as { description?: unknown };
  const description = typeof rawMaybe.description === "string" ? rawMaybe.description : undefined;

  return (
    <>
      <span className="rfs:block rfs:text-sm rfs:font-bold rfs:tabular-nums">
        {formatTime(appointment.start)}–{formatTime(appointment.end)}
      </span>
      <span className="rfs:mt-0.5 rfs:block rfs:text-base rfs:leading-snug rfs:font-semibold">
        {appointment.title}
      </span>
      {description && (
        <span className="rfs:mt-0.5 rfs:block rfs:text-xs rfs:font-medium rfs:opacity-80">{description}</span>
      )}
    </>
  );
}

export function Agenda<
  TAppointment,
  TResource extends BaseSchedulerResource<TResourceId>,
  TResourceId extends SchedulerId,
>({
  appointments,
  resources,
  appointmentAppearanceByResource,
  onAppointmentClick,
  renderResourceHeader,
  renderAgendaItem,
  emptyState = "No appointments",
}: AgendaProps<TAppointment, TResource, TResourceId>) {
  // One column per resource, listing its appointments by start time with no empty slots.
  // Appointments without a matching resource are not shown, like in the grid.
  const byResource = React.useMemo(() => {
    const map = new Map<TResourceId, SchedulerPresentationAppointment<TAppointment, TResourceId>[]>(
      resources.map((resource) => [resource.id, []])
    );
    for (const appointment of appointments) map.get(appointment.resourceId)?.push(appointment);
    for (const list of map.values()) list.sort((a, b) => a.start.getTime() - b.start.getTime());
    return map;
  }, [appointments, resources]);

  const hasAppointments = [...byResource.values()].some((list) => list.length > 0);

  if (!hasAppointments) {
    return (
      <div className="rfs-agenda rfs:rounded-lg rfs:border rfs:border-border rfs:bg-card rfs:p-6 rfs:text-center rfs:text-sm rfs:text-muted-foreground">
        {emptyState}
      </div>
    );
  }

  const renderItem = (
    appointment: SchedulerPresentationAppointment<TAppointment, TResourceId>,
    resource: TResource
  ) => {
    const appointmentAppearance = appointmentAppearanceByResource.get(resource.id);
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
      "rfs:block rfs:w-full rfs:rounded-md rfs:px-3 rfs:py-2 rfs:text-left rfs:text-foreground",
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
            <DefaultAgendaItem appointment={appointment} />
          </button>
        ) : (
          <div className={rowClassName}>
            <DefaultAgendaItem appointment={appointment} />
          </div>
        )}
      </li>
    );
  };

  return (
    <div className="rfs-agenda rfs-shell rfs:border-border rfs:bg-card">
      <div style={{ minWidth: Math.max(resources.length, 1) * RESOURCE_MIN_W }}>
        <Header
          resources={resources}
          renderResourceHeader={renderResourceHeader}
          showGutter={false}
        />
        <div className="rfs:flex">
          {resources.map((resource) => (
            <ul
              key={String(resource.id)}
              aria-label={resource.label}
              className="rfs-col rfs:flex rfs:flex-col rfs:gap-1 rfs:p-1"
              style={{ minWidth: RESOURCE_MIN_W, flex: 1 }}
            >
              {(byResource.get(resource.id) ?? []).map((appointment) => renderItem(appointment, resource))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
