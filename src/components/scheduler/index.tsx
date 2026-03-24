import * as React from "react";

import { useSchedulerBaseData } from "../../hooks/useSchedulerBaseData";
import { useSchedulerInteractions } from "../../hooks/useSchedulerInteractions";
import { useSchedulerPresentationData } from "../../hooks/useSchedulerPresentationData";

import { Gutter } from "./parts/Gutter";
import { Header } from "./parts/Header";
import { ResourceCol } from "./parts/ResourceCol";
import { Toolbar } from "./parts/Toolbar";

import type { BaseSchedulerResource, SchedulerId, SchedulerProps } from "../../types";

export function Scheduler<
  TAppointment,
  TResource extends BaseSchedulerResource<TResourceId>,
  TResourceId extends SchedulerId,
>({
  resources,
  appointments,
  selectedDate,
  onSelectedDateChange,
  adapter,
  onPersistMoveResize,
  onAppointmentChange,
  renderResourceHeader,
  renderAppointment,
  resourceAppointmentClassMap,
  getResourceAppointmentAppearance,
  getResourceAppointmentColorToken,
  appointmentColorTokenClassMap,
  getResourceAppointmentBackground,
  renderToolbar,
  renderDatePicker,
  prevButtonLabel = "Prev",
  nextButtonLabel = "Next",
  dayStart = "09:00",
  dayEnd = "18:00",
}: SchedulerProps<TAppointment, TResource, TResourceId>) {
  const { appointmentMap, dayMinutes, dayStartAbs, gridHeight, gridMinWidth, renderAppts } =
    useSchedulerBaseData({ adapter, appointments, dayEnd, dayStart, resources, selectedDate });

  const {
    colRefs,
    drag,
    onApptPointerDown,
    onGlobalPointerMove,
    onGlobalPointerUp,
    onResizePointerDown,
    suppressClickRef,
  } = useSchedulerInteractions({
    appointmentMap,
    dayMinutes,
    dayStartAbs,
    onAppointmentChange,
    onPersistMoveResize,
    renderAppts,
    resources,
    selectedDate,
  });

  const { appointmentAppearanceByResource, appointmentBgByResource, laidOutByResource } =
    useSchedulerPresentationData({
      appointmentColorTokenClassMap,
      dayStartAbs,
      drag,
      getResourceAppointmentAppearance,
      getResourceAppointmentBackground,
      getResourceAppointmentColorToken,
      renderAppts,
      resourceAppointmentClassMap,
      resources,
      selectedDate,
    });

  return (
    <section
      className={`rfs-root rounded-lg bg-background text-foreground ${
        drag.kind === "move" ? "rfs-root--drag-move" : ""
      } ${drag.kind === "resize" ? "rfs-root--drag-resize" : ""}`}
      onPointerMove={onGlobalPointerMove}
      onPointerUp={onGlobalPointerUp}
      onPointerCancel={onGlobalPointerUp}
    >
      <Toolbar
        selectedDate={selectedDate}
        onSelectedDateChange={onSelectedDateChange}
        prevButtonLabel={prevButtonLabel}
        nextButtonLabel={nextButtonLabel}
        renderToolbar={renderToolbar}
        renderDatePicker={renderDatePicker}
      />

      <div className="rfs-shell border-border bg-card">
        <div style={{ minWidth: gridMinWidth }}>
          <Header resources={resources} renderResourceHeader={renderResourceHeader} />
          <div className="rfs-body">
            <Gutter dayMinutes={dayMinutes} dayStartAbs={dayStartAbs} gridHeight={gridHeight} />
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
                  renderAppointment={renderAppointment}
                  onApptPointerDown={onApptPointerDown}
                  onResizePointerDown={onResizePointerDown}
                  drag={drag}
                  suppressClickRef={suppressClickRef}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
