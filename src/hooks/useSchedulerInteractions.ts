import * as React from "react";

import { MIN_EVENT_MIN, PX_PER_MIN, TOP_PAD } from "../components/constants";
import { clamp, dateAtMinute, overlaps, snap } from "../utils/scheduler-core.utils";

import type { SchedulerInteractions, UseSchedulerInteractionsArgs } from "./types";
import type {
  BaseSchedulerResource,
  SchedulerDragState,
  SchedulerId,
  SchedulerPresentationAppointment,
} from "../types/scheduler";

const DRAG_START_THRESHOLD_PX = 4;

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
  const [movePreview, setMovePreview] = React.useState<{
    appointment: SchedulerPresentationAppointment<TAppointment, TResourceId>;
    clientX: number;
    clientY: number;
    width: number;
    height: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const colRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
  const suppressClickRef = React.useRef(false);
  const dragRef = React.useRef<SchedulerDragState<TResourceId>>({ kind: "none" });
  const pendingDragRef = React.useRef<{
    drag: Exclude<SchedulerDragState<TResourceId>, { kind: "none" }>;
    appointment: SchedulerPresentationAppointment<TAppointment, TResourceId>;
    startClientX: number;
    startClientY: number;
    width: number;
    height: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const latestPointerRef = React.useRef<{ clientX: number; clientY: number; pointerId: number } | null>(
    null
  );
  const frameRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    dragRef.current = drag;
  }, [drag]);

  React.useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

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
    (
      event: React.PointerEvent,
      appointment: SchedulerPresentationAppointment<TAppointment, TResourceId>
    ) => {
      if (event.button !== 0) {
        return;
      }

      event.stopPropagation();
      suppressClickRef.current = false;
      const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
      const pointerMin = pointerToMin(appointment.resourceId, event.clientY);
      pendingDragRef.current = {
        drag: {
          kind: "move",
          appointmentId: appointment.id,
          pointerId: event.pointerId,
          resourceId: appointment.resourceId,
          durationMin: Math.max(MIN_EVENT_MIN, appointment.endMin - appointment.startMin),
          offsetMin: pointerMin - appointment.startMin,
          startMin: appointment.startMin,
          endMin: appointment.endMin,
        },
        appointment,
        startClientX: event.clientX,
        startClientY: event.clientY,
        width: rect.width,
        height: rect.height,
        offsetX: event.clientX - rect.left,
        offsetY: event.clientY - rect.top,
      };
    },
    [pointerToMin]
  );

  const onResizePointerDown = React.useCallback(
    (
      event: React.PointerEvent,
      appointment: SchedulerPresentationAppointment<TAppointment, TResourceId>
    ) => {
      if (event.button !== 0) {
        return;
      }

      event.stopPropagation();
      suppressClickRef.current = false;
      pendingDragRef.current = {
        drag: {
          kind: "resize",
          appointmentId: appointment.id,
          pointerId: event.pointerId,
          resourceId: appointment.resourceId,
          startMin: appointment.startMin,
          endMin: appointment.endMin,
        },
        appointment,
        startClientX: event.clientX,
        startClientY: event.clientY,
        width: 0,
        height: 0,
        offsetX: 0,
        offsetY: 0,
      };
    },
    []
  );

  const onGlobalPointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      latestPointerRef.current = {
        clientX: event.clientX,
        clientY: event.clientY,
        pointerId: event.pointerId,
      };

      if (frameRef.current !== null) {
        return;
      }

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        const pointer = latestPointerRef.current;
        if (!pointer) {
          return;
        }

        const currentDrag = dragRef.current;

        if (currentDrag.kind === "none" && pendingDragRef.current) {
          const pending = pendingDragRef.current;
          if (pending.drag.pointerId !== pointer.pointerId) {
            return;
          }

          const deltaX = pointer.clientX - pending.startClientX;
          const deltaY = pointer.clientY - pending.startClientY;
          if (Math.hypot(deltaX, deltaY) < DRAG_START_THRESHOLD_PX) {
            return;
          }

          suppressClickRef.current = true;
          dragRef.current = pending.drag;
          setDrag(pending.drag);
          if (pending.drag.kind === "move") {
            setMovePreview({
              appointment: pending.appointment,
              clientX: pointer.clientX,
              clientY: pointer.clientY,
              width: pending.width,
              height: pending.height,
              offsetX: pending.offsetX,
              offsetY: pending.offsetY,
            });
          }
          pendingDragRef.current = null;
          return;
        }

        if (currentDrag.kind === "none") {
          return;
        }

        if (currentDrag.kind === "move") {
          setMovePreview((current) =>
            current
              ? {
                  ...current,
                  clientX: pointer.clientX,
                  clientY: pointer.clientY,
                }
              : current
          );
          const nextResourceId = pointerToResourceId(pointer.clientX, currentDrag.resourceId);
          const pointerMin = pointerToMin(nextResourceId, pointer.clientY);
          const rawStart = pointerMin - currentDrag.offsetMin;
          const nextStartMin = clamp(snap(rawStart), 0, dayMinutes - currentDrag.durationMin);
          const nextEndMin = nextStartMin + currentDrag.durationMin;

          if (
            nextStartMin !== currentDrag.startMin ||
            nextEndMin !== currentDrag.endMin ||
            nextResourceId !== currentDrag.resourceId
          ) {
            suppressClickRef.current = true;
            const nextDrag = {
              ...currentDrag,
              resourceId: nextResourceId,
              startMin: nextStartMin,
              endMin: nextEndMin,
            };
            dragRef.current = nextDrag;
            setDrag(nextDrag);
          }
          return;
        }

        const pointerMin = pointerToMin(currentDrag.resourceId, pointer.clientY);
        const nextEndMin = clamp(snap(pointerMin), currentDrag.startMin + MIN_EVENT_MIN, dayMinutes);
        if (nextEndMin !== currentDrag.endMin) {
          suppressClickRef.current = true;
          const nextDrag = {
            ...currentDrag,
            endMin: nextEndMin,
          };
          dragRef.current = nextDrag;
          setDrag(nextDrag);
        }
      });
    },
    [dayMinutes, pointerToMin, pointerToResourceId]
  );

  const onGlobalPointerUp = React.useCallback(() => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    latestPointerRef.current = null;
    pendingDragRef.current = null;
    setMovePreview(null);
    const current = dragRef.current;
    if (current.kind === "none") {
      return;
    }

    setDrag({ kind: "none" });
    dragRef.current = { kind: "none" };
    if (suppressClickRef.current) {
      void persistDrag(current);
    }
  }, [persistDrag]);

  return {
    colRefs,
    drag,
    movePreview,
    onApptPointerDown,
    onGlobalPointerMove,
    onGlobalPointerUp,
    onResizePointerDown,
    suppressClickRef,
  };
}
