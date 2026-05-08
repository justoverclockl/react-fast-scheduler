import type {
  SchedulerAppointmentAdapter,
  SchedulerAppointmentAdapterInput,
  SchedulerAppointmentField,
} from "@rfs-types";

const readAppointmentField = <TAppointment, TValue>(
  appointment: TAppointment,
  field: SchedulerAppointmentField<TAppointment, TValue>
): TValue => {
  if (typeof field === "function") {
    return field(appointment);
  }

  return appointment[field] as TValue;
};

export const resolveSchedulerAppointmentAdapter = <
  TAppointment,
  TResourceId extends string | number,
>(
  adapter: SchedulerAppointmentAdapterInput<TAppointment, TResourceId>
): SchedulerAppointmentAdapter<TAppointment, TResourceId> => {
  if ("getId" in adapter) {
    return adapter;
  }

  return {
    getEnd: (appointment) => readAppointmentField(appointment, adapter.end),
    getId: (appointment) => readAppointmentField(appointment, adapter.id),
    getResourceId: (appointment) => readAppointmentField(appointment, adapter.resourceId),
    getStart: (appointment) => readAppointmentField(appointment, adapter.start),
    getTitle: (appointment) => readAppointmentField(appointment, adapter.title),
  };
};
