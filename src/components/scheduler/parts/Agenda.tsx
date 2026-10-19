import { GUTTER_W, RESOURCE_MIN_W, STEP_MIN } from "@components/constants";
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
  dayStartAbs: number;
  dayEndAbs: number;
  onAppointmentClick?: (appointment: TAppointment, event: React.MouseEvent<HTMLElement>) => void;
  renderResourceHeader?: (resource: TResource) => React.ReactNode;
  renderAgendaItem?: (
    args: SchedulerAgendaItemRenderArgs<TAppointment, TResource, TResourceId>
  ) => React.ReactNode;
  emptyState?: React.ReactNode;
};

const formatTime = (date: Date) => format(date, "HH:mm");
const pad = (value: number) => String(value).padStart(2, "0");
const formatSlot = (minute: number) => `${pad(Math.floor(minute / 60))}:${pad(minute % 60)}`;
/** Start of the slot (minutes from midnight) that contains the given date. */
const slotOf = (date: Date) => Math.floor((date.getHours() * 60 + date.getMinutes()) / STEP_MIN) * STEP_MIN;
const cellKey = (slot: number, resourceId: SchedulerId) => `${slot}|${String(resourceId)}`;

function DefaultAgendaItem<TAppointment, TResourceId extends SchedulerId>({
  appointment,
}: {
  appointment: SchedulerPresentationAppointment<TAppointment, TResourceId>;
}) {
  const rawMaybe = appointment.raw as { description?: unknown };
  const description = typeof rawMaybe.description === "string" ? rawMaybe.description : undefined;

  return (
    <>
      <span className="rfs:block rfs:text-xs rfs:font-medium rfs:tabular-nums">
        {formatTime(appointment.start)}–{formatTime(appointment.end)}
      </span>
      <span className="rfs:block rfs:text-xs rfs:font-semibold">{appointment.title}</span>
      {description && <span className="rfs:block rfs:text-[10px] rfs:font-medium">{description}</span>}
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
  dayStartAbs,
  dayEndAbs,
  onAppointmentClick,
  renderResourceHeader,
  renderAgendaItem,
  emptyState = "No appointments",
}: AgendaProps<TAppointment, TResource, TResourceId>) {
  // One row per STEP_MIN slot, one cell per resource; each cell lists the appointments starting in that slot.
  // Appointments without a matching resource are not shown, like in the grid.
  const { slots, cells } = React.useMemo(() => {
    const resourceIds = new Set(resources.map((resource) => resource.id));
    const visible = appointments
      .filter((appointment) => resourceIds.has(appointment.resourceId))
      .sort((a, b) => a.start.getTime() - b.start.getTime());

    const map = new Map<string, SchedulerPresentationAppointment<TAppointment, TResourceId>[]>();
    for (const appointment of visible) {
      const key = cellKey(slotOf(appointment.start), appointment.resourceId);
      const cell = map.get(key) ?? [];
      cell.push(appointment);
      map.set(key, cell);
    }

    // Always show dayStart..dayEnd, extended if an appointment falls outside it.
    const startSlots = visible.map((appointment) => slotOf(appointment.start));
    const firstSlot = Math.min(Math.floor(dayStartAbs / STEP_MIN) * STEP_MIN, ...startSlots);
    const lastSlot = Math.max(Math.ceil(dayEndAbs / STEP_MIN) * STEP_MIN - STEP_MIN, ...startSlots);
    const slotList = Array.from(
      { length: Math.max(0, (lastSlot - firstSlot) / STEP_MIN + 1) },
      (_, index) => firstSlot + index * STEP_MIN
    );

    return { slots: slotList, cells: map };
  }, [appointments, resources, dayStartAbs, dayEndAbs]);

  const hasAppointments = cells.size > 0;

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
      <div style={{ minWidth: GUTTER_W + Math.max(resources.length, 1) * RESOURCE_MIN_W }}>
        <Header
          resources={resources}
          renderResourceHeader={renderResourceHeader}
        />
        {slots.map((slot) => {
          const isHourStart = slot % 60 === 0;
          // Solid line at the end of each hour, lighter line between quarters (like the grid).
          // Inline because `.rfs-col` / `.rfs-gutter` set their own border color.
          const borderBottomColor =
            (slot + STEP_MIN) % 60 === 0
              ? "var(--rfs-border)"
              : "color-mix(in oklab, var(--rfs-border) 40%, transparent)";

          return (
            <div
              key={slot}
              className="rfs:flex"
            >
              <div
                className={cn(
                  "rfs-gutter rfs:border-b rfs:px-2 rfs:py-1 rfs:text-xs rfs:tabular-nums",
                  isHourStart ? "rfs:text-foreground" : "rfs:text-muted-foreground/70"
                )}
                style={{ width: GUTTER_W, borderBottomColor }}
              >
                {formatSlot(slot)}
              </div>
              {resources.map((resource) => (
                <ul
                  key={String(resource.id)}
                  aria-label={resource.label}
                  className="rfs-col rfs:flex rfs:min-h-7 rfs:flex-col rfs:gap-1 rfs:border-b rfs:p-1"
                  style={{ minWidth: RESOURCE_MIN_W, flex: 1, borderBottomColor }}
                >
                  {(cells.get(cellKey(slot, resource.id)) ?? []).map((appointment) =>
                    renderItem(appointment, resource)
                  )}
                </ul>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
