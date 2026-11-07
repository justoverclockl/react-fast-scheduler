import * as React from "react";

import { MIN_EVENT_MIN, PX_PER_MIN, RESOURCE_MIN_W, STEP_MIN, TOP_PAD } from "../../constants";
import { defaultRenderAppointment } from "../../defaultRenderAppointment";

import type { SchedulerResourceColumnProps } from "../../../types/internal";
import type { SchedulerId } from "../../../types/scheduler";

/**
 * One dotted line every `stepMin` minutes, from the start to the end of the day. The element is
 * one pixel taller than the last line so that line is painted too.
 */
function GridLines({
  className,
  stepMin,
  dayMinutes,
}: {
  className: string;
  stepMin: number;
  dayMinutes: number;
}) {
  const stepPx = stepMin * PX_PER_MIN;
  return (
    <div
      aria-hidden="true"
      className={`rfs-grid-lines ${className}`}
      style={{
        top: TOP_PAD,
        height: Math.floor(dayMinutes / stepMin) * stepPx + 1,
        backgroundSize: `2px ${stepPx}px`,
      }}
    />
  );
}

export const ResourceColInner = <TAppointment, TResourceId extends SchedulerId>({
  resource,
  colRefs,
  gridHeight,
  dayMinutes,
  appointments,
  appointmentAppearance,
  appointmentBg,
  isDropInvalid,
  renderAppointment,
  onAppointmentClick,
  onApptPointerDown,
  onResizePointerDown,
  drag,
  suppressClickRef,
}: SchedulerResourceColumnProps<TAppointment, TResourceId>) => {
  return (
    <div
      className="rfs-col rfs:border-border rfs:bg-card"
      style={{ minWidth: RESOURCE_MIN_W, flex: 1 }}
    >
      <div
        ref={(el) => {
          colRefs.current[String(resource.id)] = el;
        }}
        className="rfs-col-inner rfs:bg-card"
        style={{ height: gridHeight }}
      >
        {/* Grid lines drawn as a repeated background: two elements instead of one per line. */}
        <GridLines
          className="rfs-hour-lines"
          stepMin={60}
          dayMinutes={dayMinutes}
        />
        <GridLines
          className="rfs-slot-lines"
          stepMin={STEP_MIN}
          dayMinutes={dayMinutes}
        />
        {appointments.map((appointment) => {
          const laneWidthPct = 100 / appointment.lanes;
          const top = TOP_PAD + appointment.startMin * PX_PER_MIN;
          const height = Math.max(
            MIN_EVENT_MIN * PX_PER_MIN,
            (appointment.endMin - appointment.startMin) * PX_PER_MIN
          );
          return (
            <div
              key={appointment.renderKey}
              className={`rfs-card-slot ${
                appointment.visualState === "ghost" ? "rfs-card-slot--ghost" : ""
              } ${appointment.visualState === "dragging" ? "rfs-card-slot--dragging" : ""}`}
              style={{
                top,
                left: `${laneWidthPct * appointment.lane}%`,
                width: `${laneWidthPct}%`,
                height,
              }}
              onClick={
                onAppointmentClick
                  ? (event) => {
                      // A drag or resize that just ended also fires a click: ignore it.
                      if (suppressClickRef.current) {
                        return;
                      }
                      onAppointmentClick(appointment.raw, event);
                    }
                  : undefined
              }
            >
              {(renderAppointment ?? defaultRenderAppointment)({
                appointment,
                isDropInvalid:
                  isDropInvalid &&
                  drag.kind === "resize" &&
                  appointment.id === drag.appointmentId,
                onPointerDown: (event) => onApptPointerDown(event, appointment),
                onResizePointerDown: (event) => onResizePointerDown(event, appointment),
                appointmentAppearance,
                appointmentBackgroundColor: appointmentBg,
                drag,
                suppressClickRef,
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
