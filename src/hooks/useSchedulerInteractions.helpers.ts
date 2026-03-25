import { MIN_EVENT_MIN } from "@components/constants";
import { clamp, snap } from "@utils/scheduler-core.utils";

import type { SchedulerDragState, SchedulerId, SchedulerPresentationAppointment } from "@rfs-types/scheduler";
import type * as React from "react";

export const DRAG_START_THRESHOLD_PX = 4;

export type MovePreview<TAppointment, TResourceId extends SchedulerId> = {
  appointment: SchedulerPresentationAppointment<TAppointment, TResourceId>;
  clientX: number;
  clientY: number;
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
};

export type PendingDrag<TAppointment, TResourceId extends SchedulerId> = {
  drag: Exclude<SchedulerDragState<TResourceId>, { kind: "none" }>;
  appointment: SchedulerPresentationAppointment<TAppointment, TResourceId>;
  startClientX: number;
  startClientY: number;
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
};

export type PointerSnapshot = {
  clientX: number;
  clientY: number;
  pointerId: number;
};

export const updateMovePreviewPosition = <TAppointment, TResourceId extends SchedulerId>(
  setMovePreview: React.Dispatch<React.SetStateAction<MovePreview<TAppointment, TResourceId> | null>>,
  pointer: PointerSnapshot
) => {
  setMovePreview((current) =>
    current
      ? {
          ...current,
          clientX: pointer.clientX,
          clientY: pointer.clientY,
        }
      : current
  );
};

export const startPendingDragIfThresholdPassed = <TAppointment, TResourceId extends SchedulerId>(
  args: {
    pointer: PointerSnapshot;
    pendingDragRef: { current: PendingDrag<TAppointment, TResourceId> | null };
    setDrag: React.Dispatch<React.SetStateAction<SchedulerDragState<TResourceId>>>;
    setMovePreview: React.Dispatch<React.SetStateAction<MovePreview<TAppointment, TResourceId> | null>>;
    dragRef: { current: SchedulerDragState<TResourceId> };
    suppressClickRef: { current: boolean };
  }
) => {
  const { dragRef, pendingDragRef, pointer, setDrag, setMovePreview, suppressClickRef } = args;
  const pending = pendingDragRef.current;
  if (!pending || pending.drag.pointerId !== pointer.pointerId) {
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
};

export const buildNextMoveDrag = <TResourceId extends SchedulerId>(
  drag: Extract<SchedulerDragState<TResourceId>, { kind: "move" }>,
  pointer: PointerSnapshot,
  dayMinutes: number,
  pointerToResourceId: (clientX: number, fallbackResourceId: TResourceId) => TResourceId,
  pointerToMin: (resourceId: TResourceId, clientY: number) => number
) => {
  const nextResourceId = pointerToResourceId(pointer.clientX, drag.resourceId);
  const pointerMin = pointerToMin(nextResourceId, pointer.clientY);
  const rawStart = pointerMin - drag.offsetMin;
  const nextStartMin = clamp(snap(rawStart), 0, dayMinutes - drag.durationMin);
  const nextEndMin = nextStartMin + drag.durationMin;

  if (
    nextStartMin === drag.startMin &&
    nextEndMin === drag.endMin &&
    nextResourceId === drag.resourceId
  ) {
    return null;
  }

  return {
    ...drag,
    resourceId: nextResourceId,
    startMin: nextStartMin,
    endMin: nextEndMin,
  };
};

export const buildNextResizeDrag = <TResourceId extends SchedulerId>(
  drag: Extract<SchedulerDragState<TResourceId>, { kind: "resize" }>,
  pointer: PointerSnapshot,
  dayMinutes: number,
  pointerToMin: (resourceId: TResourceId, clientY: number) => number
) => {
  const pointerMin = pointerToMin(drag.resourceId, pointer.clientY);
  const nextEndMin = clamp(snap(pointerMin), drag.startMin + MIN_EVENT_MIN, dayMinutes);
  if (nextEndMin === drag.endMin) {
    return null;
  }

  return {
    ...drag,
    endMin: nextEndMin,
  };
};

export const processPointerFrame = <TAppointment, TResourceId extends SchedulerId>(
  args: {
    dayMinutes: number;
    dragRef: { current: SchedulerDragState<TResourceId> };
    latestPointerRef: { current: PointerSnapshot | null };
    pendingDragRef: { current: PendingDrag<TAppointment, TResourceId> | null };
    pointerToMin: (resourceId: TResourceId, clientY: number) => number;
    pointerToResourceId: (clientX: number, fallbackResourceId: TResourceId) => TResourceId;
    setDrag: React.Dispatch<React.SetStateAction<SchedulerDragState<TResourceId>>>;
    setMovePreview: React.Dispatch<React.SetStateAction<MovePreview<TAppointment, TResourceId> | null>>;
    suppressClickRef: { current: boolean };
  }
) => {
  const {
    dayMinutes,
    dragRef,
    latestPointerRef,
    pendingDragRef,
    pointerToMin,
    pointerToResourceId,
    setDrag,
    setMovePreview,
    suppressClickRef,
  } = args;
  const pointer = latestPointerRef.current;
  if (!pointer) {
    return;
  }

  const currentDrag = dragRef.current;

  if (currentDrag.kind === "none" && pendingDragRef.current) {
    startPendingDragIfThresholdPassed({
      pointer,
      pendingDragRef,
      setDrag,
      setMovePreview,
      dragRef,
      suppressClickRef,
    });
    return;
  }

  if (currentDrag.kind === "none") {
    return;
  }

  if (currentDrag.kind === "move") {
    updateMovePreviewPosition(setMovePreview, pointer);
    const nextDrag = buildNextMoveDrag(
      currentDrag,
      pointer,
      dayMinutes,
      pointerToResourceId,
      pointerToMin
    );
    if (nextDrag) {
      suppressClickRef.current = true;
      dragRef.current = nextDrag;
      setDrag(nextDrag);
    }
    return;
  }

  const nextDrag = buildNextResizeDrag(currentDrag, pointer, dayMinutes, pointerToMin);
  if (nextDrag) {
    suppressClickRef.current = true;
    dragRef.current = nextDrag;
    setDrag(nextDrag);
  }
};

export const finishDrag = <TAppointment, TResourceId extends SchedulerId>(
  args: {
    dragRef: { current: SchedulerDragState<TResourceId> };
    frameRef: { current: number | null };
    latestPointerRef: { current: PointerSnapshot | null };
    pendingDragRef: { current: PendingDrag<TAppointment, TResourceId> | null };
    persistDrag: (state: Exclude<SchedulerDragState<TResourceId>, { kind: "none" }>) => Promise<void>;
    setDrag: React.Dispatch<React.SetStateAction<SchedulerDragState<TResourceId>>>;
    setMovePreview: React.Dispatch<React.SetStateAction<MovePreview<TAppointment, TResourceId> | null>>;
    suppressClickRef: { current: boolean };
  }
) => {
  const {
    dragRef,
    frameRef,
    latestPointerRef,
    pendingDragRef,
    persistDrag,
    setDrag,
    setMovePreview,
    suppressClickRef,
  } = args;
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
};
