import { Scheduler } from "@marco.colia/react-fast-scheduler";
import * as React from "react";

import { CodeBlock } from "../components/CodeBlock";
import { ControlGroup, Segmented, Select, ToggleChips } from "../components/Controls";
import { DemoFrame } from "../components/DemoFrame";
import { Section } from "../components/Layout";
import { clinic } from "../data/scenarios";
import { useScenario } from "../data/useScenario";

import { baseProps, pick } from "./shared";

const DOCTORS_PAIR = pick(clinic, ["okafor", "ferri"]);

import type { SchedulerWeekday } from "@marco.colia/react-fast-scheduler";

const WEEKDAYS: { value: SchedulerWeekday; label: string }[] = [
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
  { value: 0, label: "Sun" },
];

const hours = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => {
    const value = `${String(from + i).padStart(2, "0")}:00`;
    return { value, label: value };
  });

const START_OPTIONS = hours(6, 11);
const END_OPTIONS = hours(15, 21);

export function WorkingDaysDemo() {
  const state = useScenario(clinic);
  const [workingDays, setWorkingDays] = React.useState<SchedulerWeekday[]>([1, 2, 3, 4, 5]);
  const [weekStartsOn, setWeekStartsOn] = React.useState<SchedulerWeekday>(1);
  const [dayStart, setDayStart] = React.useState("08:00");
  const [dayEnd, setDayEnd] = React.useState("18:00");

  // Keep the chips in calendar order whatever order they were clicked in.
  const sortedDays = WEEKDAYS.map((day) => day.value).filter((day) => workingDays.includes(day));

  const code = `
<Scheduler
  resources={doctors}
  appointments={appointments}
  selectedDate={date}
  onSelectedDateChange={setDate}
  views={["week", "day"]}
  workingDays={[${sortedDays.join(", ")}]}${sortedDays.length === 0 ? " // empty: every day is a working day" : ""}
  weekStartsOn={${weekStartsOn}}
  dayStart="${dayStart}"
  dayEnd="${dayEnd}"
/>
`;

  return (
    <Section
      id="working-days"
      title="Working days and opening hours"
      description={
        <p>
          <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">workingDays</code> hides closed days from the week,
          makes Prev/Next skip them in the day view and greys them out in the date picker.{" "}
          <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">dayStart</code> and{" "}
          <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">dayEnd</code> set the hours of the grid. Leave
          them out and every day, 09:00 to 18:00, is open as before. Change the settings and watch
          the code follow.
        </p>
      }
    >
      <div className="flex flex-wrap gap-x-8 gap-y-4 rounded-xl border border-border bg-card p-4">
        <ControlGroup label="Working days">
          <ToggleChips
            options={WEEKDAYS}
            value={workingDays}
            onChange={setWorkingDays}
          />
        </ControlGroup>
        <ControlGroup label="Week starts on">
          <Segmented
            options={[
              { value: 1 as SchedulerWeekday, label: "Monday" },
              { value: 0 as SchedulerWeekday, label: "Sunday" },
            ]}
            value={weekStartsOn}
            onChange={setWeekStartsOn}
          />
        </ControlGroup>
        <ControlGroup label="Opening hours">
          <div className="flex items-center gap-2">
            <Select
              label="Day starts at"
              options={START_OPTIONS}
              value={dayStart}
              onChange={setDayStart}
            />
            <span className="text-muted-foreground">to</span>
            <Select
              label="Day ends at"
              options={END_OPTIONS}
              value={dayEnd}
              onChange={setDayEnd}
            />
          </div>
        </ControlGroup>
      </div>
      <DemoFrame
        label={clinic.name}
        hint="Switch to Day to see the hours"
      >
        <Scheduler
          {...baseProps(clinic, state)}
          resources={DOCTORS_PAIR}
          views={["week", "day"]}
          workingDays={sortedDays}
          weekStartsOn={weekStartsOn}
          dayStart={dayStart}
          dayEnd={dayEnd}
        />
      </DemoFrame>
      <CodeBlock
        title="OpeningHours.tsx"
        highlight={["workingDays=", "weekStartsOn=", "dayStart=", "dayEnd="]}
        code={code}
      />
    </Section>
  );
}
