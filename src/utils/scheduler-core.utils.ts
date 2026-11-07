import { STEP_MIN } from "@components/constants";
import { format, startOfWeek } from "date-fns";

import type { LaidOut, NameLike, TimeBlockLike } from "@rfs-types/internal";
import type {
  SchedulerAppointmentColorToken,
  SchedulerView,
  SchedulerWeekStartsOn,
  SchedulerWeekday,
} from "@rfs-types/scheduler";

export function isNameLike(resource: unknown): resource is NameLike {
  if (!resource || typeof resource !== "object") {
    return false;
  }
  const maybe = resource as { firstName?: unknown; lastName?: unknown };
  return typeof maybe.firstName === "string" || typeof maybe.lastName === "string";
}

export function toInputDateValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function fromInputDateValue(value: string): Date | null {
  const [yearRaw, monthRaw, dayRaw] = value.split("-");
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  const day = Number(dayRaw);
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return null;
  }
  return new Date(year, month - 1, day);
}

// Prefixed so the classes ship in the packaged stylesheet (the `rfs:` Tailwind prefix).
export const DEFAULT_APPOINTMENT_COLOR_TOKEN_CLASS_MAP: Record<
  SchedulerAppointmentColorToken,
  string
> = {
  slate: "rfs:bg-slate-100 rfs:dark:bg-slate-900/40",
  gray: "rfs:bg-gray-100 rfs:dark:bg-gray-900/40",
  zinc: "rfs:bg-zinc-100 rfs:dark:bg-zinc-900/40",
  neutral: "rfs:bg-neutral-100 rfs:dark:bg-neutral-900/40",
  stone: "rfs:bg-stone-100 rfs:dark:bg-stone-900/40",
  red: "rfs:bg-red-100 rfs:dark:bg-red-950/40",
  orange: "rfs:bg-orange-100 rfs:dark:bg-orange-950/40",
  amber: "rfs:bg-amber-100 rfs:dark:bg-amber-950/40",
  yellow: "rfs:bg-yellow-100 rfs:dark:bg-yellow-950/40",
  lime: "rfs:bg-lime-100 rfs:dark:bg-lime-950/40",
  green: "rfs:bg-green-100 rfs:dark:bg-green-950/40",
  emerald: "rfs:bg-emerald-100 rfs:dark:bg-emerald-950/40",
  teal: "rfs:bg-teal-100 rfs:dark:bg-teal-950/40",
  cyan: "rfs:bg-cyan-100 rfs:dark:bg-cyan-950/40",
  sky: "rfs:bg-sky-100 rfs:dark:bg-sky-950/40",
  blue: "rfs:bg-blue-100 rfs:dark:bg-blue-950/40",
  indigo: "rfs:bg-indigo-100 rfs:dark:bg-indigo-950/40",
  violet: "rfs:bg-violet-100 rfs:dark:bg-violet-950/40",
  purple: "rfs:bg-purple-100 rfs:dark:bg-purple-950/40",
  fuchsia: "rfs:bg-fuchsia-100 rfs:dark:bg-fuchsia-950/40",
  pink: "rfs:bg-pink-100 rfs:dark:bg-pink-950/40",
  rose: "rfs:bg-rose-100 rfs:dark:bg-rose-950/40",
};

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function snap(mins: number, stepMin = STEP_MIN) {
  return Math.round(mins / stepMin) * stepMin;
}

export function parseHHMM(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function fullName<T extends NameLike>(resource: T) {
  return `${resource.firstName ?? ""} ${resource.lastName ?? ""}`.trim();
}

export function dayISO(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function shiftDays(date: Date, delta: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + delta);
}

/** The 7 days of the week containing `date`, at midnight. */
export function getWeekDays(date: Date, weekStartsOn: SchedulerWeekStartsOn = 1) {
  const first = startOfWeek(date, { weekStartsOn });
  return Array.from({ length: 7 }, (_, i) => shiftDays(first, i));
}

/**
 * Whether `date` is a working day. Without `workingDays` (or with an empty list) every day is
 * a working day.
 */
export function isSchedulerWorkingDay(date: Date, workingDays?: readonly SchedulerWeekday[]) {
  if (!workingDays || workingDays.length === 0) {
    return true;
  }
  return workingDays.includes(date.getDay() as SchedulerWeekday);
}

/**
 * The nearest working day before (`direction` -1) or after (`direction` 1) `date`.
 * Without working days it is simply the previous or next day.
 */
export function shiftWorkingDays(
  date: Date,
  direction: 1 | -1,
  workingDays?: readonly SchedulerWeekday[]
) {
  let next = shiftDays(date, direction);
  // At most 7 steps: any 7 consecutive days contain every weekday.
  for (let i = 0; i < 7 && !isSchedulerWorkingDay(next, workingDays); i++) {
    next = shiftDays(next, direction);
  }
  return next;
}

export type SchedulerVisibleDaysOptions = {
  weekStartsOn?: SchedulerWeekStartsOn;
  workingDays?: readonly SchedulerWeekday[];
};

/**
 * Days shown by a view: the working days of the week containing `selectedDate` for `"week"`,
 * otherwise only `selectedDate`.
 */
export function getSchedulerVisibleDays(
  view: SchedulerView,
  selectedDate: Date,
  { weekStartsOn = 1, workingDays }: SchedulerVisibleDaysOptions = {}
) {
  if (view !== "week") {
    return [shiftDays(selectedDate, 0)];
  }
  return getWeekDays(selectedDate, weekStartsOn).filter((day) =>
    isSchedulerWorkingDay(day, workingDays)
  );
}

export function dateAtMinute(selectedDate: Date, dayStartAbs: number, minuteFromStart: number) {
  const base = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate(),
    0,
    0,
    0,
    0
  );
  const abs = dayStartAbs + minuteFromStart;
  const hh = Math.floor(abs / 60);
  const mm = abs % 60;
  base.setHours(hh, mm, 0, 0);
  return base;
}

export function minutesFromDayStart(dayStartAbs: number, date: Date) {
  return date.getHours() * 60 + date.getMinutes() - dayStartAbs;
}

export function overlaps(a: TimeBlockLike, b: TimeBlockLike) {
  return a.startMin < b.endMin && b.startMin < a.endMin;
}

export function layoutOverlaps<T extends TimeBlockLike>(blocks: T[]): LaidOut<T>[] {
  const sorted = [...blocks].sort((a, b) => a.startMin - b.startMin || a.endMin - b.endMin);
  const groups: T[][] = [];
  let active: T[] = [];
  let current: T[] = [];

  for (const block of sorted) {
    active = active.filter((item) => item.endMin > block.startMin);
    const conflicts = active.some((item) => overlaps(item, block));

    if (!conflicts && current.length > 0) {
      groups.push(current);
      current = [];
    }
    current.push(block);
    active.push(block);
  }

  if (current.length) {
    groups.push(current);
  }

  const output: LaidOut<T>[] = [];

  for (const group of groups) {
    const sortedGroup = [...group].sort((a, b) => a.startMin - b.startMin || a.endMin - b.endMin);
    const laneEnd: number[] = [];
    const laneOf = new Map<T["id"], number>();

    for (const block of sortedGroup) {
      let placed = false;
      for (let i = 0; i < laneEnd.length; i++) {
        if (laneEnd[i] <= block.startMin) {
          laneEnd[i] = block.endMin;
          laneOf.set(block.id, i);
          placed = true;
          break;
        }
      }
      if (!placed) {
        laneEnd.push(block.endMin);
        laneOf.set(block.id, laneEnd.length - 1);
      }
    }

    const lanes = laneEnd.length;
    for (const block of sortedGroup) {
      output.push({ ...block, lane: laneOf.get(block.id) ?? 0, lanes });
    }
  }

  return output;
}
