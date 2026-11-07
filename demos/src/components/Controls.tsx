import { ChevronDown } from "lucide-react";
import * as React from "react";

type Option<T extends string | number> = { value: T; label: string };

export function ControlGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex flex-col gap-2"
    >
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

/** Toggle buttons; several can be on at once. */
export function ToggleChips<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: Option<T>[];
  value: T[];
  onChange: (next: T[]) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => {
        const on = value.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={on}
            onClick={() =>
              onChange(on ? value.filter((item) => item !== option.value) : [...value, option.value])
            }
            className={`h-8 min-w-11 rounded-md border px-2.5 text-sm font-medium transition-colors duration-150 ${
              on
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/** One of a few options, shown as a segmented control. */
export function Segmented<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: Option<T>[];
  value: T;
  onChange: (next: T) => void;
}) {
  return (
    <div className="inline-flex w-fit rounded-lg border border-border bg-muted p-0.5">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
          className={`h-7 rounded-md px-3 text-sm font-medium transition-colors duration-150 ${
            option.value === value
              ? "bg-card text-foreground shadow-[0_1px_2px_rgb(0_0_0/0.08)]"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function Select<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (next: T) => void;
}) {
  return (
    <label className="relative inline-flex w-fit items-center">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="h-8 appearance-none rounded-md border border-border bg-card pr-8 pl-2.5 font-mono text-sm tabular-nums text-foreground transition-colors duration-150 hover:bg-muted"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 size-4 text-muted-foreground" />
    </label>
  );
}
