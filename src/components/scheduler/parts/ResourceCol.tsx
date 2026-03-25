import * as React from "react";

import { ResourceColInner } from "./ResourceColInner";

export const ResourceCol = React.memo(ResourceColInner, (prev, next) => {
  return (
    prev.resource === next.resource &&
    prev.colRefs === next.colRefs &&
    prev.gridHeight === next.gridHeight &&
    prev.dayMinutes === next.dayMinutes &&
    prev.appointments === next.appointments &&
    prev.appointmentAppearance === next.appointmentAppearance &&
    prev.appointmentBg === next.appointmentBg &&
    prev.renderAppointment === next.renderAppointment &&
    prev.onApptPointerDown === next.onApptPointerDown &&
    prev.onResizePointerDown === next.onResizePointerDown &&
    prev.drag === next.drag &&
    prev.suppressClickRef === next.suppressClickRef
  );
}) as typeof ResourceColInner;
