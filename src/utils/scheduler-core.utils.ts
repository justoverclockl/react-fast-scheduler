import { format } from "date-fns";

import { STEP_MIN } from "../components/constants";

import type { LaidOut, NameLike, TimeBlockLike } from "../types/internal";
import type { SchedulerAppointmentColorToken } from "../types/scheduler";

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

export const DEFAULT_APPOINTMENT_COLOR_TOKEN_CLASS_MAP: Record<
  SchedulerAppointmentColorToken,
  string
> = {
  slate: "bg-slate-100 dark:bg-slate-900/40",
  gray: "bg-gray-100 dark:bg-gray-900/40",
  zinc: "bg-zinc-100 dark:bg-zinc-900/40",
  neutral: "bg-neutral-100 dark:bg-neutral-900/40",
  stone: "bg-stone-100 dark:bg-stone-900/40",
  red: "bg-red-100 dark:bg-red-950/40",
  orange: "bg-orange-100 dark:bg-orange-950/40",
  amber: "bg-amber-100 dark:bg-amber-950/40",
  yellow: "bg-yellow-100 dark:bg-yellow-950/40",
  lime: "bg-lime-100 dark:bg-lime-950/40",
  green: "bg-green-100 dark:bg-green-950/40",
  emerald: "bg-emerald-100 dark:bg-emerald-950/40",
  teal: "bg-teal-100 dark:bg-teal-950/40",
  cyan: "bg-cyan-100 dark:bg-cyan-950/40",
  sky: "bg-sky-100 dark:bg-sky-950/40",
  blue: "bg-blue-100 dark:bg-blue-950/40",
  indigo: "bg-indigo-100 dark:bg-indigo-950/40",
  violet: "bg-violet-100 dark:bg-violet-950/40",
  purple: "bg-purple-100 dark:bg-purple-950/40",
  fuchsia: "bg-fuchsia-100 dark:bg-fuchsia-950/40",
  pink: "bg-pink-100 dark:bg-pink-950/40",
  rose: "bg-rose-100 dark:bg-rose-950/40",
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
