import {
  clamp,
  dateAtMinute,
  dayISO,
  layoutOverlaps,
  minutesFromDayStart,
} from "./scheduler-core.utils";

import type {
  BuildResourceMapOptions,
  NormalizeAppointmentsArgs,
  SchedulerLayoutAppointment,
} from "../types/internal";
import type {
  BaseSchedulerResource,
  SchedulerAppointmentAppearance,
  SchedulerDragState,
  SchedulerId,
  SchedulerPresentationAppointment,
} from "../types/scheduler";

export function buildResourceMap<TResource, TResourceId extends SchedulerId, TValue>({
  fallback,
  getValue,
  resources,
  toKey,
}: BuildResourceMapOptions<TResource, TResourceId, TValue>) {
  const map = new Map<TResourceId, TValue | undefined>();
  for (const resource of resources) {
    map.set(toKey(resource), getValue(resource) ?? fallback);
  }
  return map;
}

export function normalizeAppointments<TAppointment, TResourceId extends SchedulerId>({
  adapter,
  appointments,
  dayMinutes,
  dayStartAbs,
  selectedISO,
}: NormalizeAppointmentsArgs<TAppointment, TResourceId>) {
  return appointments
    .map((appointment) => {
      const start = new Date(adapter.getStart(appointment));
      const end = new Date(adapter.getEnd(appointment));
      return {
        raw: appointment,
        id: adapter.getId(appointment),
        resourceId: adapter.getResourceId(appointment),
        start,
        end,
        startMin: clamp(minutesFromDayStart(dayStartAbs, start), 0, dayMinutes),
        endMin: clamp(minutesFromDayStart(dayStartAbs, end), 0, dayMinutes),
        title: adapter.getTitle(appointment),
        renderKey: String(adapter.getId(appointment)),
        visualState: "normal" as const,
      };
    })
    .filter((appointment) => dayISO(appointment.start) === selectedISO);
}

export function buildAppointmentMap<TAppointment, TResourceId extends SchedulerId>(
  appointments: SchedulerPresentationAppointment<TAppointment, TResourceId>[]
) {
  return new Map(appointments.map((appointment) => [appointment.id, appointment]));
}

export function buildPresentationAppointments<TAppointment, TResourceId extends SchedulerId>(
  appointments: SchedulerPresentationAppointment<TAppointment, TResourceId>[],
  drag: SchedulerDragState<TResourceId>,
  selectedDate: Date,
  dayStartAbs: number
): SchedulerPresentationAppointment<TAppointment, TResourceId>[] {
  if (drag.kind === "none") {
    return appointments;
  }

  if (drag.kind === "move") {
    return appointments;
  }

  return appointments.map((appointment) => {
    if (appointment.id !== drag.appointmentId) {
      return appointment;
    }

    return {
      ...appointment,
      resourceId: drag.resourceId,
      startMin: drag.startMin,
      endMin: drag.endMin,
      start: dateAtMinute(selectedDate, dayStartAbs, drag.startMin),
      end: dateAtMinute(selectedDate, dayStartAbs, drag.endMin),
      visualState: "dragging" as const,
    };
  });
}

export function buildLaidOutByResource<
  TAppointment,
  TResource extends BaseSchedulerResource<TResourceId>,
  TResourceId extends SchedulerId,
>(
  resources: TResource[],
  appointments: SchedulerPresentationAppointment<TAppointment, TResourceId>[]
) {
  const appointmentsByResource = new Map<
    TResourceId,
    SchedulerPresentationAppointment<TAppointment, TResourceId>[]
  >();

  for (const appointment of appointments) {
    const current = appointmentsByResource.get(appointment.resourceId) ?? [];
    current.push(appointment);
    appointmentsByResource.set(appointment.resourceId, current);
  }

  const result = new Map<TResourceId, SchedulerLayoutAppointment<TAppointment, TResourceId>[]>();
  for (const resource of resources) {
    result.set(resource.id, buildLaidOutAppointments(appointmentsByResource.get(resource.id) ?? []));
  }
  return result;
}

export function buildLaidOutAppointments<TAppointment, TResourceId extends SchedulerId>(
  appointments: SchedulerPresentationAppointment<TAppointment, TResourceId>[]
) {
  return layoutOverlaps(
    appointments.map((appointment) => ({
      ...appointment,
      appointmentId: appointment.id,
      id: appointment.renderKey,
    }))
  ).map(({ appointmentId, ...appointment }) => ({
    ...appointment,
    id: appointmentId,
  }));
}

export function buildAppointmentAppearanceByResource<
  TResource extends BaseSchedulerResource<TResourceId>,
  TResourceId extends SchedulerId,
>(
  resources: TResource[],
  resourceAppointmentClassMap: Partial<Record<string, string>> | undefined,
  getResourceAppointmentAppearance:
    | ((resource: TResource) => SchedulerAppointmentAppearance | undefined)
    | undefined,
  appointmentColorTokenClassByResource: Map<TResourceId, string | undefined>,
  appointmentBgByResource: Map<TResourceId, string | undefined>
) {
  const map = new Map<TResourceId, SchedulerAppointmentAppearance | undefined>();

  for (const resource of resources) {
    const classFromIdMap = resourceAppointmentClassMap?.[String(resource.id)];
    if (classFromIdMap) {
      map.set(resource.id, { className: classFromIdMap });
      continue;
    }

    const appearance = getResourceAppointmentAppearance?.(resource);
    if (appearance) {
      map.set(resource.id, appearance);
      continue;
    }

    const tokenClass = appointmentColorTokenClassByResource.get(resource.id);
    if (tokenClass) {
      map.set(resource.id, { className: tokenClass });
      continue;
    }

    const legacyBackground = appointmentBgByResource.get(resource.id);
    map.set(resource.id, legacyBackground ? { className: legacyBackground } : undefined);
  }

  return map;
}
