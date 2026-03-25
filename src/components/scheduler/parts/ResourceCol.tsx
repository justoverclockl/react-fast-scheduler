import * as React from "react";

import { ResourceColInner } from "./ResourceColInner";

import type { SchedulerResourceColumnProps } from "../../../types/internal";
import type { SchedulerId } from "../../../types/scheduler";

const areResourceColsEqual = <TAppointment, TResourceId extends SchedulerId>(
  prev: Readonly<SchedulerResourceColumnProps<TAppointment, TResourceId>>,
  next: Readonly<SchedulerResourceColumnProps<TAppointment, TResourceId>>
) =>
  [
    prev.resource === next.resource,
    prev.colRefs === next.colRefs,
    prev.gridHeight === next.gridHeight,
    prev.dayMinutes === next.dayMinutes,
    prev.appointments === next.appointments,
    prev.appointmentAppearance === next.appointmentAppearance,
    prev.appointmentBg === next.appointmentBg,
    prev.isDropInvalid === next.isDropInvalid,
    prev.renderAppointment === next.renderAppointment,
    prev.onApptPointerDown === next.onApptPointerDown,
    prev.onResizePointerDown === next.onResizePointerDown,
    prev.drag === next.drag,
    prev.suppressClickRef === next.suppressClickRef,
  ].every(Boolean);

export const ResourceCol: typeof ResourceColInner = React.memo(
  ResourceColInner,
  areResourceColsEqual
) as typeof ResourceColInner;
