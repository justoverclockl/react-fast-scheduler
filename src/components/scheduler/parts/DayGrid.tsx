import * as React from "react";

import { Gutter } from "./Gutter";
import { Header } from "./Header";
import { ResourceCol } from "./ResourceCol";

import type {
  SchedulerLayoutAppointment,
  SchedulerResourceColumnProps,
} from "@rfs-types/internal";
import type {
  BaseSchedulerResource,
  SchedulerAppointmentAppearance,
  SchedulerDragState,
  SchedulerId,
  SchedulerPresentationAppointment,
} from "@rfs-types/scheduler";

const IDLE_DRAG = { kind: "none" } as const;

type DayGridProps<
  TAppointment,
  TResource extends BaseSchedulerResource<TResourceId>,
  TResourceId extends SchedulerId,
> = {
  resources: TResource[];
  renderResourceHeader?: (resource: TResource) => React.ReactNode;
  gridMinWidth: number;
  laidOutByResource: Map<TResourceId, SchedulerLayoutAppointment<TAppointment, TResourceId>[]>;
  drag: SchedulerDragState<TResourceId>;
  colRefs: React.RefObject<Record<string, HTMLDivElement | null>>;
  dayMinutes: number;
  dayStartAbs: number;
  gridHeight: number;
  appointmentAppearanceByResource: Map<TResourceId, SchedulerAppointmentAppearance | undefined>;
  appointmentBgByResource: Map<TResourceId, string | undefined>;
  isDropInvalid: boolean;
  renderAppointment?: SchedulerResourceColumnProps<TAppointment, TResourceId>["renderAppointment"];
  onAppointmentClick?: (appointment: TAppointment, event: React.MouseEvent<HTMLElement>) => void;
  onApptPointerDown: (
    event: React.PointerEvent,
    appointment: SchedulerPresentationAppointment<TAppointment, TResourceId>
  ) => void;
  onResizePointerDown: (
    event: React.PointerEvent,
    appointment: SchedulerPresentationAppointment<TAppointment, TResourceId>
  ) => void;
  suppressClickRef: React.RefObject<boolean>;
};

/** Day view: the resource grid, one time-grid column per resource. */
export function DayGrid<
  TAppointment,
  TResource extends BaseSchedulerResource<TResourceId>,
  TResourceId extends SchedulerId,
>({
  resources,
  renderResourceHeader,
  gridMinWidth,
  laidOutByResource,
  drag,
  colRefs,
  dayMinutes,
  dayStartAbs,
  gridHeight,
  appointmentAppearanceByResource,
  appointmentBgByResource,
  isDropInvalid,
  renderAppointment,
  onAppointmentClick,
  onApptPointerDown,
  onResizePointerDown,
  suppressClickRef,
}: DayGridProps<TAppointment, TResource, TResourceId>) {
  return (
    <div className="rfs-shell rfs:border-border rfs:bg-card">
      <div style={{ minWidth: gridMinWidth }}>
        <Header
          resources={resources}
          renderResourceHeader={renderResourceHeader}
        />
        <div className="rfs-body">
          <Gutter
            dayMinutes={dayMinutes}
            dayStartAbs={dayStartAbs}
            gridHeight={gridHeight}
          />
          <div className="rfs-grid">
            {resources.map((resource) => (
              <ResourceCol
                key={String(resource.id)}
                resource={resource}
                colRefs={colRefs}
                gridHeight={gridHeight}
                dayMinutes={dayMinutes}
                appointments={laidOutByResource.get(resource.id) ?? []}
                appointmentAppearance={appointmentAppearanceByResource.get(resource.id)}
                appointmentBg={appointmentBgByResource.get(resource.id)}
                isDropInvalid={isDropInvalid}
                renderAppointment={renderAppointment}
                onAppointmentClick={onAppointmentClick}
                onApptPointerDown={onApptPointerDown}
                onResizePointerDown={onResizePointerDown}
                drag={drag.kind === "resize" && drag.resourceId === resource.id ? drag : IDLE_DRAG}
                suppressClickRef={suppressClickRef}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
