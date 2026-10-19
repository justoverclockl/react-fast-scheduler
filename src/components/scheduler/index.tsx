
import { defaultRenderAppointment } from "@components/defaultRenderAppointment";
import { useSchedulerBaseData } from "@hooks/useSchedulerBaseData";
import { useSchedulerInteractions } from "@hooks/useSchedulerInteractions";
import { useSchedulerPresentationData } from "@hooks/useSchedulerPresentationData";
import { useSchedulerView } from "@hooks/useSchedulerView";
import * as React from "react";

import { Agenda } from "./parts/Agenda";
import { Gutter } from "./parts/Gutter";
import { Header } from "./parts/Header";
import { ResourceCol } from "./parts/ResourceCol";
import { Toolbar } from "./parts/Toolbar";

import type {
  BaseSchedulerResource,
  SchedulerId,
  SchedulerProps,
  SchedulerView,
} from "@rfs-types";

const IDLE_DRAG = { kind: "none" } as const;
const DEFAULT_VIEWS: SchedulerView[] = ["day"];

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
  onAppointmentClick,
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
  editable = true,
  views = DEFAULT_VIEWS,
  view: controlledView,
  defaultView,
  onViewChange,
  viewLabels,
  renderAgendaItem,
  agendaEmptyState,
}: SchedulerProps<TAppointment, TResource, TResourceId>) {
  const [view, handleViewChange] = useSchedulerView({
    views,
    view: controlledView,
    defaultView,
    onViewChange,
  });

  const { appointmentMap, dayEndAbs, dayMinutes, dayStartAbs, gridHeight, gridMinWidth, renderAppts } =
    useSchedulerBaseData({ adapter, appointments, dayEnd, dayStart, resources, selectedDate });

  const {
    colRefs,
    drag,
    isDropInvalid,
    movePreview,
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
    editable
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

  return (
    <section
      className={`rfs-root rfs:rounded-lg rfs:text-foreground ${
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
        view={view}
        views={views}
        onViewChange={handleViewChange}
        viewLabels={viewLabels}
      />

      {view === "agenda" ? (
        <Agenda
          appointments={renderAppts}
          resources={resources}
          appointmentAppearanceByResource={appointmentAppearanceByResource}
          dayStartAbs={dayStartAbs}
          dayEndAbs={dayEndAbs}
          onAppointmentClick={onAppointmentClick}
          renderResourceHeader={renderResourceHeader}
          renderAgendaItem={renderAgendaItem}
          emptyState={agendaEmptyState}
        />
      ) : (
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
      )}
      {moveOverlay ? (
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
      ) : null}
    </section>
  );
}
