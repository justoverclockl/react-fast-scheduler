import { addDays, format, startOfWeek } from "date-fns";

import type { Appointment, Scenario } from "./scenarios";

/** Small seeded generator, so a given day always gets the same mock appointments. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

const atMinute = (day: Date, minute: number) =>
  new Date(day.getFullYear(), day.getMonth(), day.getDate(), Math.floor(minute / 60), minute % 60);

const GAPS = [0, 0, 15, 15, 30, 45, 60, 90];

function generateDay(scenario: Scenario, day: Date): Appointment[] {
  if (!scenario.workingDays.includes(day.getDay() as Scenario["workingDays"][number])) {
    return [];
  }

  const iso = format(day, "yyyy-MM-dd");
  const dayStart = toMinutes(scenario.dayStart);
  const dayEnd = toMinutes(scenario.dayEnd);
  const result: Appointment[] = [];

  for (const resource of scenario.resources) {
    const random = mulberry32(hash(`${scenario.id}|${iso}|${resource.id}`));
    const pick = <T,>(list: T[]) => list[Math.floor(random() * list.length)];
    let minute = dayStart + pick([0, 15, 30, 60]);
    let index = 0;

    while (minute < dayEnd - 30 && index < 7) {
      const duration = pick(scenario.durations);
      if (minute + duration > dayEnd) {
        break;
      }
      result.push({
        id: `${scenario.id}-${iso}-${resource.id}-${index}`,
        resourceId: resource.id,
        title: pick(resource.titles ?? scenario.titles),
        note: pick(scenario.notes),
        start: atMinute(day, minute).toISOString(),
        end: atMinute(day, minute + duration).toISOString(),
      });
      minute += duration + pick(GAPS);
      index++;
    }
  }

  return result;
}

export const weekKey = (date: Date) => format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd");

/** Mock appointments for the 7 days of the week that contains `date`. */
export function generateWeek(scenario: Scenario, date: Date): Appointment[] {
  const first = startOfWeek(date, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) => generateDay(scenario, addDays(first, i))).flat();
}

/** The given day, or the next working day of the scenario. */
export function nextWorkingDay(scenario: Scenario, date: Date) {
  let day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  for (let i = 0; i < 7; i++) {
    if (scenario.workingDays.includes(day.getDay() as Scenario["workingDays"][number])) {
      return day;
    }
    day = addDays(day, 1);
  }
  return day;
}
