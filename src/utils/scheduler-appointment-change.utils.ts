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

type AppointmentKey<TAppointment> = Extract<keyof TAppointment, string | number>;

type ChangeFields<TAppointment> = {
  id: SchedulerAppointmentField<TAppointment, SchedulerId>;
  resourceId: AppointmentKey<TAppointment>;
  start: AppointmentKey<TAppointment>;
  end: AppointmentKey<TAppointment>;
};

/** Default field names the appointment actually has; those can be omitted from the options. */
type DefaultedChangeField<TAppointment> = Extract<keyof ChangeFields<TAppointment>, keyof TAppointment>;

/**
 * Key-based options. `id`, `resourceId`, `start` and `end` default to the fields with the same name,
 * so they are optional when the appointment has them.
 */
export type ApplySchedulerAppointmentChangeFieldOptions<TAppointment> = Omit<
  ChangeFields<TAppointment>,
  DefaultedChangeField<TAppointment>
> &
  Partial<Pick<ChangeFields<TAppointment>, DefaultedChangeField<TAppointment>>> & {
    dateValue?: (date: Date) => unknown;
  };

export type ApplySchedulerAppointmentChangeInput<TAppointment, TResourceId extends SchedulerId> =
  | ApplySchedulerAppointmentChangeOptions<TAppointment, TResourceId>
  | ApplySchedulerAppointmentChangeFieldOptions<TAppointment>;

const DEFAULT_CHANGE_FIELDS = {
  id: "id",
  resourceId: "resourceId",
  start: "start",
  end: "end",
} as const;

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
  return !("getId" in options);
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
  // `options` can be left out when the appointment uses the default field names.
  ...[options = {} as ApplySchedulerAppointmentChangeInput<TAppointment, TResourceId>]: [
    Exclude<keyof ChangeFields<TAppointment>, DefaultedChangeField<TAppointment>>,
  ] extends [never]
    ? [options?: ApplySchedulerAppointmentChangeInput<TAppointment, TResourceId>]
    : [options: ApplySchedulerAppointmentChangeInput<TAppointment, TResourceId>]
): TAppointment[] => {
  const next = getNextAppointmentChange(change);

  return appointments.map((item) => {
    if (isFieldOptions(options)) {
      const fields = { ...DEFAULT_CHANGE_FIELDS, ...options } as ChangeFields<TAppointment>;
      if (readAppointmentId(item, fields.id) !== readAppointmentId(change.appointment, fields.id)) {
        return item;
      }

      const dateValue = options.dateValue ?? ((date: Date) => date);
      return {
        ...item,
        [fields.resourceId]: next.resourceId,
        [fields.start]: dateValue(next.start),
        [fields.end]: dateValue(next.end),
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
