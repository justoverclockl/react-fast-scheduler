
import { DEFAULT_APPOINTMENT_COLOR_TOKEN_CLASS_MAP } from "@utils/scheduler-core.utils";
import {
  applyDragToAppointments,
  buildAppointmentAppearanceByResource,
  buildLaidOutByResource,
  buildResourceMap,
} from "@utils/scheduler-data.utils";
import * as React from "react";

import type { SchedulerPresentationData, UseSchedulerPresentationDataArgs } from "./types";
import type { BaseSchedulerResource, SchedulerId } from "@rfs-types/scheduler";

export function useSchedulerPresentationData<
  TAppointment,
  TResource extends BaseSchedulerResource<TResourceId>,
  TResourceId extends SchedulerId,
>({
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
}: UseSchedulerPresentationDataArgs<
  TAppointment,
  TResource,
  TResourceId
>): SchedulerPresentationData<TAppointment, TResourceId> {
  const effectiveAppts = React.useMemo(() => {
    return applyDragToAppointments(renderAppts, drag, selectedDate, dayStartAbs);
  }, [dayStartAbs, drag, renderAppts, selectedDate]);

  const laidOutByResource = React.useMemo(() => {
    return buildLaidOutByResource(resources, effectiveAppts);
  }, [effectiveAppts, resources]);

  const appointmentBgByResource = React.useMemo(() => {
    if (!getResourceAppointmentBackground) {
      return new Map<TResourceId, string | undefined>();
    }

    return buildResourceMap({
      fallback: undefined,
      getValue: getResourceAppointmentBackground,
      resources,
      toKey: (resource) => resource.id,
    });
  }, [getResourceAppointmentBackground, resources]);

  const appointmentColorTokenClassByResource = React.useMemo(() => {
    if (!getResourceAppointmentColorToken) {
      return new Map<TResourceId, string | undefined>();
    }

    const mergedClassMap = {
      ...DEFAULT_APPOINTMENT_COLOR_TOKEN_CLASS_MAP,
      ...(appointmentColorTokenClassMap ?? {}),
    };

    return buildResourceMap({
      fallback: undefined,
      getValue: (resource: TResource) => {
        const token = getResourceAppointmentColorToken(resource);
        return token ? mergedClassMap[token] : undefined;
      },
      resources,
      toKey: (resource) => resource.id,
    });
  }, [appointmentColorTokenClassMap, getResourceAppointmentColorToken, resources]);

  const appointmentAppearanceByResource = React.useMemo(() => {
    return buildAppointmentAppearanceByResource(
      resources,
      resourceAppointmentClassMap,
      getResourceAppointmentAppearance,
      appointmentColorTokenClassByResource,
      appointmentBgByResource
    );
  }, [
    appointmentBgByResource,
    appointmentColorTokenClassByResource,
    getResourceAppointmentAppearance,
    resourceAppointmentClassMap,
    resources,
  ]);

  return {
    appointmentAppearanceByResource,
    appointmentBgByResource,
    effectiveAppts,
    laidOutByResource,
  };
}
