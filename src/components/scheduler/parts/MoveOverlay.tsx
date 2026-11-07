import { defaultRenderAppointment } from "@components/defaultRenderAppointment";
import * as React from "react";

import type { SchedulerMovePreview } from "@hooks/types";
import type { SchedulerResourceColumnProps } from "@rfs-types/internal";
import type {
  SchedulerAppointmentAppearance,
  SchedulerDragState,
  SchedulerId,
} from "@rfs-types/scheduler";

type MoveOverlayProps<TAppointment, TResourceId extends SchedulerId> = {
  drag: SchedulerDragState<TResourceId>;
  movePreview: SchedulerMovePreview<TAppointment, TResourceId> | null;
  appointmentAppearanceByResource: Map<TResourceId, SchedulerAppointmentAppearance | undefined>;
  appointmentBgByResource: Map<TResourceId, string | undefined>;
  isDropInvalid: boolean;
  renderAppointment?: SchedulerResourceColumnProps<TAppointment, TResourceId>["renderAppointment"];
  suppressClickRef: React.RefObject<boolean>;
};

/** Card that follows the pointer while an appointment is being moved. */
export function MoveOverlay<TAppointment, TResourceId extends SchedulerId>({
  drag,
  movePreview,
  appointmentAppearanceByResource,
  appointmentBgByResource,
  isDropInvalid,
  renderAppointment,
  suppressClickRef,
}: MoveOverlayProps<TAppointment, TResourceId>) {
  const moveOverlay = React.useMemo(() => {
    if (drag.kind !== "move" || !movePreview) {
      return null;
    }

    return {
      appointment: {
        ...movePreview.appointment,
        resourceId: drag.resourceId,
        startMin: drag.startMin,
        endMin: drag.endMin,
        visualState: "ghost" as const,
        renderKey: `${movePreview.appointment.renderKey}-overlay`,
        lane: 0,
        lanes: 1,
      },
      appearance: appointmentAppearanceByResource.get(drag.resourceId),
      background: appointmentBgByResource.get(drag.resourceId),
      left: movePreview.clientX - movePreview.offsetX,
      top: movePreview.clientY - movePreview.offsetY,
      width: movePreview.width,
      height: movePreview.height,
    };
  }, [appointmentAppearanceByResource, appointmentBgByResource, drag, movePreview]);

  if (!moveOverlay) {
    return null;
  }

  return (
    <div
      className="rfs-drag-overlay"
      style={{
        left: moveOverlay.left,
        top: moveOverlay.top,
        width: moveOverlay.width,
        height: moveOverlay.height,
      }}
    >
      {(renderAppointment ?? defaultRenderAppointment)({
        appointment: moveOverlay.appointment,
        isDropInvalid,
        onPointerDown: () => undefined,
        onResizePointerDown: () => undefined,
        appointmentAppearance: moveOverlay.appearance,
        appointmentBackgroundColor: moveOverlay.background,
        drag,
        suppressClickRef,
      })}
    </div>
  );
}
