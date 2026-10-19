import type {
  SchedulerAppointmentAdapter,
  SchedulerAppointmentAdapterInput,
  SchedulerAppointmentAdapterOption,
  SchedulerAppointmentField,
  SchedulerAppointmentFieldAdapter,
} from "@rfs-types";

const DEFAULT_ADAPTER_FIELDS = {
  id: "id",
  resourceId: "resourceId",
  start: "start",
  end: "end",
  title: "title",
} as const;

const readAppointmentField = <TAppointment, TValue>(
  appointment: TAppointment,
  field: SchedulerAppointmentField<TAppointment, TValue>
): TValue => {
  if (typeof field === "function") {
    return field(appointment);
  }

  return appointment[field] as TValue;
};

/**
 * Normalizes any adapter shape to the key/function form, filling in default field names.
 * Each returned field is a primitive key or the user's function, so it is safe to use as a memo dependency.
 */
export const toSchedulerAppointmentFields = <TAppointment, TResourceId extends string | number>(
  adapter?:
    | SchedulerAppointmentAdapterInput<TAppointment, TResourceId>
    | SchedulerAppointmentAdapterOption<TAppointment, TResourceId>
): SchedulerAppointmentFieldAdapter<TAppointment, TResourceId> => {
  if (adapter && "getId" in adapter) {
    return {
      id: adapter.getId,
      resourceId: adapter.getResourceId,
      start: adapter.getStart,
      end: adapter.getEnd,
      title: adapter.getTitle,
    };
  }

  return {
    ...DEFAULT_ADAPTER_FIELDS,
    ...adapter,
  } as SchedulerAppointmentFieldAdapter<TAppointment, TResourceId>;
};

export const resolveSchedulerAppointmentAdapter = <
  TAppointment,
  TResourceId extends string | number,
>(
  adapter?:
    | SchedulerAppointmentAdapterInput<TAppointment, TResourceId>
    | SchedulerAppointmentAdapterOption<TAppointment, TResourceId>
): SchedulerAppointmentAdapter<TAppointment, TResourceId> => {
  if (adapter && "getId" in adapter) {
    return adapter;
  }

  const fields = toSchedulerAppointmentFields(adapter);

  return {
    getEnd: (appointment) => readAppointmentField(appointment, fields.end),
    getId: (appointment) => readAppointmentField(appointment, fields.id),
    getResourceId: (appointment) => readAppointmentField(appointment, fields.resourceId),
    getStart: (appointment) => readAppointmentField(appointment, fields.start),
    getTitle: (appointment) => readAppointmentField(appointment, fields.title),
  };
};
