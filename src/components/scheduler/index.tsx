
import { useSchedulerBaseData } from "@hooks/useSchedulerBaseData";
import { useSchedulerInteractions } from "@hooks/useSchedulerInteractions";
import { useSchedulerPresentationData } from "@hooks/useSchedulerPresentationData";
import { useSchedulerView } from "@hooks/useSchedulerView";
import { useSchedulerVisibleDays } from "@hooks/useSchedulerVisibleDays";

import { Agenda } from "./parts/Agenda";
import { DayGrid } from "./parts/DayGrid";
import { MoveOverlay } from "./parts/MoveOverlay";
import { Toolbar } from "./parts/Toolbar";
import { Week } from "./parts/Week";

import type {
  BaseSchedulerResource,
  SchedulerId,
  SchedulerProps,
  SchedulerView,
} from "@rfs-types";

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
  weekStartsOn,
  workingDays,
  renderWeekDayHeader,
}: SchedulerProps<TAppointment, TResource, TResourceId>) {
  const [view, handleViewChange] = useSchedulerView({
    views,
    view: controlledView,
    defaultView,
    onViewChange,
  });

  const { visibleDays, weekDays } = useSchedulerVisibleDays(
    view,
    selectedDate,
    weekStartsOn,
    workingDays
  );

  const { appointmentMap, dayMinutes, dayStartAbs, gridHeight, gridMinWidth, renderAppts } =
    useSchedulerBaseData({
      adapter,
      appointments,
      dayEnd,
      dayStart,
      resources,
      selectedDate,
      visibleDays: weekDays,
    });

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
    editable,
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
        visibleDays={visibleDays}
        workingDays={workingDays}
      />

      {view === "week" ? (
        <Week
          visibleDays={visibleDays}
          appointments={renderAppts}
          resources={resources}
          appointmentAppearanceByResource={appointmentAppearanceByResource}
          onAppointmentClick={onAppointmentClick}
          renderResourceHeader={renderResourceHeader}
          renderWeekDayHeader={renderWeekDayHeader}
          renderAgendaItem={renderAgendaItem}
        />
      ) : view === "agenda" ? (
        <Agenda
          appointments={renderAppts}
          resources={resources}
          appointmentAppearanceByResource={appointmentAppearanceByResource}
          onAppointmentClick={onAppointmentClick}
          renderResourceHeader={renderResourceHeader}
          renderAgendaItem={renderAgendaItem}
          emptyState={agendaEmptyState}
        />
      ) : (
        <DayGrid
          resources={resources}
          renderResourceHeader={renderResourceHeader}
          gridMinWidth={gridMinWidth}
          laidOutByResource={laidOutByResource}
          drag={drag}
          colRefs={colRefs}
          dayMinutes={dayMinutes}
          dayStartAbs={dayStartAbs}
          gridHeight={gridHeight}
          appointmentAppearanceByResource={appointmentAppearanceByResource}
          appointmentBgByResource={appointmentBgByResource}
          isDropInvalid={isDropInvalid}
          renderAppointment={renderAppointment}
          onAppointmentClick={onAppointmentClick}
          onApptPointerDown={onApptPointerDown}
          onResizePointerDown={onResizePointerDown}
          suppressClickRef={suppressClickRef}
        />
      )}
      <MoveOverlay
        drag={drag}
        movePreview={movePreview}
        appointmentAppearanceByResource={appointmentAppearanceByResource}
        appointmentBgByResource={appointmentBgByResource}
        isDropInvalid={isDropInvalid}
        renderAppointment={renderAppointment}
        suppressClickRef={suppressClickRef}
      />
    </section>
  );
}
