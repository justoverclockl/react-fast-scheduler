import type {
  SchedulerAppointmentChangeArgs,
  SchedulerAppointmentField,
  SchedulerId,
} from "@rfs-types";

export type ApplySchedulerAppointmentChangeOptions<
  TAppointment,
  TResourceId extends SchedulerId,
> = {
  getId: (appointment: TAppointment) => SchedulerId;
  setResourceId: (appointment: TAppointment, resourceId: TResourceId) => TAppointment;
  setStart: (appointment: TAppointment, start: Date) => TAppointment;
  setEnd: (appointment: TAppointment, end: Date) => TAppointment;
};

export type ApplySchedulerAppointmentChangeFieldOptions<TAppointment> = {
  id: SchedulerAppointmentField<TAppointment, SchedulerId>;
  resourceId: Extract<keyof TAppointment, string | number>;
  start: Extract<keyof TAppointment, string | number>;
  end: Extract<keyof TAppointment, string | number>;
  dateValue?: (date: Date) => unknown;
};

export type ApplySchedulerAppointmentChangeInput<TAppointment, TResourceId extends SchedulerId> =
  | ApplySchedulerAppointmentChangeOptions<TAppointment, TResourceId>
  | ApplySchedulerAppointmentChangeFieldOptions<TAppointment>;

const readAppointmentId = <TAppointment>(
  appointment: TAppointment,
  id: SchedulerAppointmentField<TAppointment, SchedulerId>
) => {
  if (typeof id === "function") {
    return id(appointment);
  }

  return appointment[id] as SchedulerId;
};

const isFieldOptions = <TAppointment, TResourceId extends SchedulerId>(
  options: ApplySchedulerAppointmentChangeInput<TAppointment, TResourceId>
): options is ApplySchedulerAppointmentChangeFieldOptions<TAppointment> => {
  return "id" in options;
};

const getNextAppointmentChange = <TAppointment, TResourceId extends SchedulerId>(
  change: SchedulerAppointmentChangeArgs<TAppointment, TResourceId>
) => {
  return {
    resourceId: change.resourceId ?? change.next.resourceId,
    start: change.start ?? change.next.start,
    end: change.end ?? change.next.end,
  };
};

export const applySchedulerAppointmentChange = <
  TAppointment,
  TResourceId extends SchedulerId,
>(
  appointments: TAppointment[],
  change: SchedulerAppointmentChangeArgs<TAppointment, TResourceId>,
  options: ApplySchedulerAppointmentChangeInput<TAppointment, TResourceId>
): TAppointment[] => {
  const next = getNextAppointmentChange(change);

  return appointments.map((item) => {
    if (isFieldOptions(options)) {
      if (readAppointmentId(item, options.id) !== readAppointmentId(change.appointment, options.id)) {
        return item;
      }

      const dateValue = options.dateValue ?? ((date: Date) => date);
      return {
        ...item,
        [options.resourceId]: next.resourceId,
        [options.start]: dateValue(next.start),
        [options.end]: dateValue(next.end),
      };
    }

    if (options.getId(item) !== options.getId(change.appointment)) {
      return item;
    }

    const withResource = options.setResourceId(item, next.resourceId);
    const withStart = options.setStart(withResource, next.start);
    return options.setEnd(withStart, next.end);
  });
};
