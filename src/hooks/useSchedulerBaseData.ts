
import { BOTTOM_PAD, GUTTER_W, PX_PER_MIN, RESOURCE_MIN_W, TOP_PAD } from "@components/constants";
import { resolveSchedulerAppointmentAdapter } from "@utils/scheduler-adapter.utils";
import { dayISO, parseHHMM } from "@utils/scheduler-core.utils";
import { buildAppointmentMap, normalizeAppointments } from "@utils/scheduler-data.utils";
import * as React from "react";

import type { SchedulerBaseData, UseSchedulerBaseDataArgs } from "./types";
import type { BaseSchedulerResource, SchedulerId } from "@rfs-types/scheduler";

export function useSchedulerBaseData<
  TAppointment,
  TResource extends BaseSchedulerResource<TResourceId>,
  TResourceId extends SchedulerId,
>({
  adapter,
  appointments,
  dayEnd = "18:00",
  dayStart = "09:00",
  resources,
  selectedDate,
}: UseSchedulerBaseDataArgs<TAppointment, TResource, TResourceId>): SchedulerBaseData<
  TAppointment,
  TResourceId
> {
  const dayStartAbs = React.useMemo(() => parseHHMM(dayStart), [dayStart]);
  const dayEndAbs = React.useMemo(() => parseHHMM(dayEnd), [dayEnd]);
  const dayMinutes = React.useMemo(
    () => Math.max(0, dayEndAbs - dayStartAbs),
    [dayEndAbs, dayStartAbs]
  );
  const gridHeight = React.useMemo(
    () => TOP_PAD + dayMinutes * PX_PER_MIN + BOTTOM_PAD,
    [dayMinutes]
  );
  const gridMinWidth = React.useMemo(
    () => GUTTER_W + Math.max(resources.length, 1) * RESOURCE_MIN_W,
    [resources.length]
  );
  const resolvedAdapter = React.useMemo(
    () => resolveSchedulerAppointmentAdapter(adapter),
    [adapter]
  );
  const selectedISO = React.useMemo(() => dayISO(selectedDate), [selectedDate]);

  const renderAppts = React.useMemo(() => {
    return normalizeAppointments({
      adapter: resolvedAdapter,
      appointments,
      dayMinutes,
      dayStartAbs,
      selectedISO,
    });
  }, [appointments, dayMinutes, dayStartAbs, resolvedAdapter, selectedISO]);

  const appointmentMap = React.useMemo(() => buildAppointmentMap(renderAppts), [renderAppts]);

  return {
    appointmentMap,
    dayEndAbs,
    dayMinutes,
    dayStartAbs,
    gridHeight,
    gridMinWidth,
    renderAppts,
  };
}
