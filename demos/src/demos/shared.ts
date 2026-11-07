import type { Appointment, Resource, Scenario } from "../data/scenarios";
import type { useScenario } from "../data/useScenario";

export const colorToken = (resource: Resource) => resource.color;

/** A subset of a scenario's resources: day grids show two columns so none is cut off. */
export const pick = (scenario: Scenario, ids: string[]) =>
  scenario.resources.filter((resource) => ids.includes(resource.id));

/** Props every demo passes to <Scheduler>: data, controlled date, change handler, hours. */
export function baseProps(
  scenario: Scenario,
  state: ReturnType<typeof useScenario<Appointment>>
) {
  return {
    resources: scenario.resources,
    appointments: state.appointments,
    selectedDate: state.selectedDate,
    onSelectedDateChange: state.onSelectedDateChange,
    onAppointmentChange: state.onAppointmentChange,
    getResourceAppointmentColorToken: colorToken,
    dayStart: scenario.dayStart,
    dayEnd: scenario.dayEnd,
    workingDays: scenario.workingDays,
  };
}
