import { applySchedulerAppointmentChange } from "@marco.colia/react-fast-scheduler";
import * as React from "react";

import { generateWeek, nextWorkingDay, weekKey } from "./generate";

import type { Appointment, Resource, Scenario } from "./scenarios";
import type { SchedulerAppointmentChangeEvent } from "@marco.colia/react-fast-scheduler";

export type ChangeEntry<T = Appointment> = {
  key: number;
  event: SchedulerAppointmentChangeEvent<T, string>;
};

type Store<T> = {
  weeks: Set<string>;
  items: T[];
};

type Options<T> = {
  /** Turns a generated appointment into the shape the demo's "app" stores. */
  map: (appointment: Appointment) => T;
  /** Writes a change back into that shape. */
  apply: (items: T[], event: SchedulerAppointmentChangeEvent<T, string>) => T[];
};

const defaultOptions: Options<Appointment> = {
  map: (appointment) => appointment,
  apply: (items, event) =>
    applySchedulerAppointmentChange(items, event, { dateValue: (date: Date) => date.toISOString() }),
};

/**
 * State for one demo: the selected date, the items (generated per week on first visit, then
 * kept with every edit), and the last changes reported by `onAppointmentChange`.
 */
export function useScenario<T = Appointment>(
  scenario: Scenario,
  options: Options<T> = defaultOptions as unknown as Options<T>
) {
  const { map, apply } = options;
  const withWeek = React.useCallback(
    (store: Store<T>, date: Date): Store<T> => {
      const key = weekKey(date);
      if (store.weeks.has(key)) {
        return store;
      }
      return {
        weeks: new Set(store.weeks).add(key),
        items: [...store.items, ...generateWeek(scenario, date).map(map)],
      };
    },
    [map, scenario]
  );

  const [selectedDate, setSelectedDate] = React.useState(() =>
    nextWorkingDay(scenario, new Date())
  );
  const [store, setStore] = React.useState<Store<T>>(() =>
    withWeek({ weeks: new Set(), items: [] }, selectedDate)
  );
  const [changes, setChanges] = React.useState<ChangeEntry<T>[]>([]);

  const onSelectedDateChange = React.useCallback(
    (date: Date) => {
      setSelectedDate(date);
      setStore((current) => withWeek(current, date));
    },
    [withWeek]
  );

  const onAppointmentChange = React.useCallback(
    (event: SchedulerAppointmentChangeEvent<T, string>) => {
      setStore((current) => ({ ...current, items: apply(current.items, event) }));
      setChanges((current) => [{ key: Date.now(), event }, ...current].slice(0, 4));
    },
    [apply]
  );

  const resourceById = React.useMemo(
    () => new Map<string, Resource>(scenario.resources.map((resource) => [resource.id, resource])),
    [scenario]
  );

  return {
    selectedDate,
    onSelectedDateChange,
    appointments: store.items,
    onAppointmentChange,
    changes,
    resourceById,
  };
}
