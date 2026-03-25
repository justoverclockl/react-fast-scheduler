import * as React from "react";

import { MIN_EVENT_MIN, PX_PER_MIN, RESOURCE_MIN_W, STEP_MIN, TOP_PAD } from "../../constants";
import { defaultRenderAppointment } from "../../defaultRenderAppointment";

import type { SchedulerResourceColumnProps } from "../../../types/internal";
import type { SchedulerId } from "../../../types/scheduler";

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
  onApptPointerDown,
  onResizePointerDown,
  drag,
  suppressClickRef,
}: SchedulerResourceColumnProps<TAppointment, TResourceId>) => {
  return (
    <div
      className="rfs-col border-border bg-card"
      style={{ minWidth: RESOURCE_MIN_W, flex: 1 }}
    >
      <div
        ref={(el) => {
          colRefs.current[String(resource.id)] = el;
        }}
        className="rfs-col-inner bg-card"
        style={{ height: gridHeight }}
      >
        {Array.from({ length: Math.floor(dayMinutes / 60) + 1 }).map((_, i) => (
          <div
            key={`major-${i}`}
            className="rfs-hour-line border-border/70"
            style={{ top: TOP_PAD + i * 60 * PX_PER_MIN }}
          />
        ))}
        {Array.from({ length: Math.floor(dayMinutes / STEP_MIN) + 1 }).map((_, i) => (
          <div
            key={`minor-${i}`}
            className="rfs-slot-line border-border/50"
            style={{ top: TOP_PAD + i * STEP_MIN * PX_PER_MIN }}
          />
        ))}
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
