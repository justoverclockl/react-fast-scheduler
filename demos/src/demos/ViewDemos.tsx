import { Scheduler } from "@marco.colia/react-fast-scheduler";

import { ChangeLog } from "../components/ChangeLog";
import { CodeBlock } from "../components/CodeBlock";
import { DemoFrame } from "../components/DemoFrame";
import { Section } from "../components/Layout";
import { clinic, coworking, salon } from "../data/scenarios";
import { useScenario } from "../data/useScenario";

import { baseProps, pick } from "./shared";

const SALON_PAIR = pick(salon, ["giulia", "noor"]);
const ROOMS_PAIR = pick(coworking, ["harbour", "loft"]);

export function DayViewDemo() {
  const state = useScenario(salon);

  return (
    <Section
      id="day"
      title="Day: one column per resource"
      description={
        <p>
          Each stylist gets a column on a time grid. Drag a card to another time or another person,
          pull its bottom edge to change the duration. Drops that overlap another appointment of the
          same person are refused, and nothing changes until your handler updates the data.
        </p>
      }
    >
      <DemoFrame
        label={salon.name}
        hint="Open Tuesday to Saturday, 09:00 to 19:00"
        aside={
          <ChangeLog
            changes={state.changes}
            resourceById={state.resourceById}
          />
        }
      >
        <Scheduler
          {...baseProps(salon, state)}
          resources={SALON_PAIR}
        />
      </DemoFrame>
      <CodeBlock
        title="SalonDay.tsx"
        highlight={["onAppointmentChange="]}
        code={`
<Scheduler
  resources={stylists}
  appointments={appointments}
  selectedDate={date}
  onSelectedDateChange={setDate}
  dayStart="09:00"
  dayEnd="19:00"
  onAppointmentChange={(change) => {
    // change.kind: "move" | "resize"
    // change.previous / change.next: { resourceId, start, end }
    saveToApi(change.appointment.id, change.next);
    setAppointments((current) => applySchedulerAppointmentChange(current, change));
  }}
/>
`}
      />
    </Section>
  );
}

export function WeekViewDemo() {
  const state = useScenario(clinic);

  return (
    <Section
      id="week"
      title="Week: every resource, every working day"
      description={
        <p>
          One row per resource and one column per day. Each cell lists that day&rsquo;s appointments
          in order, so a busy week stays readable. Prev and Next move a whole week, and with{" "}
          <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">workingDays</code> the closed days disappear.
        </p>
      }
    >
      <DemoFrame
        label={clinic.name}
        hint="Click Prev or Next to change week"
      >
        <Scheduler
          {...baseProps(clinic, state)}
          views={["week"]}
        />
      </DemoFrame>
      <CodeBlock
        title="ClinicWeek.tsx"
        highlight={["views=", "workingDays="]}
        code={`
<Scheduler
  resources={doctors}
  appointments={appointmentsOfTheWeek}
  selectedDate={date}
  onSelectedDateChange={setDate}
  views={["week"]}
  workingDays={[1, 2, 3, 4, 5]} // Monday to Friday
  weekStartsOn={1}
/>
`}
      />
    </Section>
  );
}

export function AgendaViewDemo() {
  const state = useScenario(coworking);

  return (
    <Section
      id="agenda"
      title="Agenda: the day as a list"
      description={
        <p>
          The selected day without the time grid: each room lists its bookings one after the other
          with start and end times. Short or overlapping bookings never get squeezed.
        </p>
      }
    >
      <DemoFrame label={coworking.name}>
        <Scheduler
          {...baseProps(coworking, state)}
          resources={ROOMS_PAIR}
          views={["agenda"]}
          agendaEmptyState="No bookings on this day"
        />
      </DemoFrame>
      <CodeBlock
        title="RoomsAgenda.tsx"
        highlight={["views=", "agendaEmptyState="]}
        code={`
<Scheduler
  resources={rooms}
  appointments={bookings}
  selectedDate={date}
  onSelectedDateChange={setDate}
  views={["agenda"]}
  agendaEmptyState="No bookings on this day"
/>
`}
      />
    </Section>
  );
}
