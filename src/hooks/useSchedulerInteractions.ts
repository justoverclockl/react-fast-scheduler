import * as React from "react";

import { MIN_EVENT_MIN, PX_PER_MIN, TOP_PAD } from "../components/constants";
import { clamp, dateAtMinute, overlaps, snap } from "../utils/scheduler-core.utils";

import type { SchedulerInteractions, UseSchedulerInteractionsArgs } from "./types";
import type {
  BaseSchedulerResource,
  SchedulerDragState,
  SchedulerEvent,
  SchedulerId,
} from "../types/scheduler";

export function useSchedulerInteractions<
  TAppointment,
  TResource extends BaseSchedulerResource<TResourceId>,
  TResourceId extends SchedulerId,
>({
  appointmentMap,
  dayMinutes,
  dayStartAbs,
  onAppointmentChange,
  onPersistMoveResize,
  renderAppts,
  resources,
  selectedDate,
}: UseSchedulerInteractionsArgs<TAppointment, TResource, TResourceId>): SchedulerInteractions<
  TAppointment,
  TResourceId
> {
  const [drag, setDrag] = React.useState<SchedulerDragState<TResourceId>>({ kind: "none" });
  const colRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
  const suppressClickRef = React.useRef(false);

  const pointerToMin = React.useCallback(
    (resourceId: TResourceId, clientY: number) => {
      const col = colRefs.current[String(resourceId)];
      if (!col) {
        return 0;
      }

      const y = clientY - col.getBoundingClientRect().top - TOP_PAD;
      return clamp(snap(y / PX_PER_MIN), 0, dayMinutes);
    },
    [dayMinutes]
  );

  const pointerToResourceId = React.useCallback(
    (clientX: number, fallbackResourceId: TResourceId) => {
      for (const resource of resources) {
        const col = colRefs.current[String(resource.id)];
        if (!col) {
          continue;
        }

        const rect = col.getBoundingClientRect();
        if (clientX >= rect.left && clientX <= rect.right) {
          return resource.id;
        }
      }

      return fallbackResourceId;
    },
    [resources]
  );

  const hasOverlap = React.useCallback(
    (appointmentId: SchedulerId, resourceId: TResourceId, startMin: number, endMin: number) => {
      const events = renderAppts.filter(
        (appointment) => appointment.resourceId === resourceId && appointment.id !== appointmentId
      );
      return events.some((appointment) =>
        overlaps(appointment, { id: appointmentId, startMin, endMin })
      );
    },
    [renderAppts]
  );

  const persistDrag = React.useCallback(
    async (state: Exclude<SchedulerDragState<TResourceId>, { kind: "none" }>) => {
      const target = appointmentMap.get(state.appointmentId);
      if (!target) {
        return;
      }

      if (hasOverlap(state.appointmentId, state.resourceId, state.startMin, state.endMin)) {
        return;
      }

      const next = {
        resourceId: state.resourceId,
        start: dateAtMinute(selectedDate, dayStartAbs, state.startMin),
        end: dateAtMinute(selectedDate, dayStartAbs, state.endMin),
      };

      if (onAppointmentChange) {
        await onAppointmentChange({
          kind: state.kind,
          appointment: target.raw,
          previous: {
            resourceId: target.resourceId,
            start: target.start,
            end: target.end,
          },
          next,
        });
        return;
      }

      if (onPersistMoveResize) {
        await onPersistMoveResize({
          appointment: target.raw,
          resourceId: next.resourceId,
          start: next.start,
          end: next.end,
        });
      }
    },
    [
      appointmentMap,
      dayStartAbs,
      hasOverlap,
      onAppointmentChange,
      onPersistMoveResize,
      selectedDate,
    ]
  );

  const onApptPointerDown = React.useCallback(
    (event: React.PointerEvent, appointment: SchedulerEvent<TAppointment, TResourceId>) => {
      if (event.button !== 0) {
        return;
      }

      event.stopPropagation();
      suppressClickRef.current = false;
      const pointerMin = pointerToMin(appointment.resourceId, event.clientY);
      setDrag({
        kind: "move",
        appointmentId: appointment.id,
        pointerId: event.pointerId,
        resourceId: appointment.resourceId,
        durationMin: Math.max(MIN_EVENT_MIN, appointment.endMin - appointment.startMin),
        offsetMin: pointerMin - appointment.startMin,
        startMin: appointment.startMin,
        endMin: appointment.endMin,
      });
    },
    [pointerToMin]
  );

  const onResizePointerDown = React.useCallback(
    (event: React.PointerEvent, appointment: SchedulerEvent<TAppointment, TResourceId>) => {
      if (event.button !== 0) {
        return;
      }

      event.stopPropagation();
      suppressClickRef.current = false;
      setDrag({
        kind: "resize",
        appointmentId: appointment.id,
        pointerId: event.pointerId,
        resourceId: appointment.resourceId,
        startMin: appointment.startMin,
        endMin: appointment.endMin,
      });
    },
    []
  );

  const onGlobalPointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (drag.kind === "none") {
        return;
      }

      if (drag.kind === "move") {
        const nextResourceId = pointerToResourceId(event.clientX, drag.resourceId);
        const pointerMin = pointerToMin(nextResourceId, event.clientY);
        const rawStart = pointerMin - drag.offsetMin;
        const nextStartMin = clamp(snap(rawStart), 0, dayMinutes - drag.durationMin);
        const nextEndMin = nextStartMin + drag.durationMin;

        if (
          nextStartMin !== drag.startMin ||
          nextEndMin !== drag.endMin ||
          nextResourceId !== drag.resourceId
        ) {
          suppressClickRef.current = true;
          setDrag({
            ...drag,
            resourceId: nextResourceId,
            startMin: nextStartMin,
            endMin: nextEndMin,
          });
        }
        return;
      }

      const pointerMin = pointerToMin(drag.resourceId, event.clientY);
      const nextEndMin = clamp(snap(pointerMin), drag.startMin + MIN_EVENT_MIN, dayMinutes);
      if (nextEndMin !== drag.endMin) {
        suppressClickRef.current = true;
        setDrag({
          ...drag,
          endMin: nextEndMin,
        });
      }
    },
    [dayMinutes, drag, pointerToMin, pointerToResourceId]
  );

  const onGlobalPointerUp = React.useCallback(() => {
    if (drag.kind === "none") {
      return;
    }

    const current = drag;
    setDrag({ kind: "none" });
    if (suppressClickRef.current) {
      void persistDrag(current);
    }
  }, [drag, persistDrag]);

  return {
    colRefs,
    drag,
    onApptPointerDown,
    onGlobalPointerMove,
    onGlobalPointerUp,
    onResizePointerDown,
    suppressClickRef,
  };
}
