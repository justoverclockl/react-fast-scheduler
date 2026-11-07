import { Scheduler, applySchedulerAppointmentChange } from "@marco.colia/react-fast-scheduler";
import { format } from "date-fns";
import { MousePointerClick } from "lucide-react";
import * as React from "react";

import { CodeBlock } from "../components/CodeBlock";
import { ControlGroup, Select } from "../components/Controls";
import { DemoFrame } from "../components/DemoFrame";
import { Section } from "../components/Layout";
import { clinic, coworking, salon } from "../data/scenarios";
import { useScenario } from "../data/useScenario";

import { baseProps, pick } from "./shared";

const ADAPTER_ROOMS = pick(coworking, ["harbour", "loft"]);
const DISPLAY_ROOMS = pick(coworking, ["pier", "deck"]);
const CUSTOM_DOCTORS = pick(clinic, ["okafor", "sato"]);

import type { Appointment, Resource } from "../data/scenarios";
import type { SchedulerCommonProps } from "@marco.colia/react-fast-scheduler";

const time = (date: Date) => format(date, "HH:mm");

/* ------------------------------------------------------------------ adapter */

/** An app whose bookings use their own field names and real Date objects. */
type Booking = {
  uid: string;
  room: string;
  from: Date;
  to: Date;
  label: string;
  bookedBy: string;
};

const BOOKING_FIELDS = { id: "uid", resourceId: "room", start: "from", end: "to" } as const;

const bookingOptions = {
  map: (appointment: Appointment): Booking => ({
    uid: appointment.id,
    room: appointment.resourceId,
    from: new Date(appointment.start),
    to: new Date(appointment.end),
    label: appointment.title,
    bookedBy: appointment.note,
  }),
  apply: (items: Booking[], event: Parameters<typeof applySchedulerAppointmentChange<Booking, string>>[1]) =>
    applySchedulerAppointmentChange(items, event, BOOKING_FIELDS),
};

const describeBooking = (booking: Booking) =>
  [
    "{",
    `  uid: "${booking.uid.split("-").slice(-2).join("-")}",`,
    `  room: "${booking.room}",`,
    `  from: ${format(booking.from, "EEE HH:mm")},`,
    `  to: ${format(booking.to, "EEE HH:mm")},`,
    `  label: "${booking.label}",`,
    `  bookedBy: "${booking.bookedBy}",`,
    "}",
  ].join("\n");

export function AdapterDemo() {
  const state = useScenario<Booking>(coworking, bookingOptions);
  const last = state.changes[0];
  const shown = last
    ? state.appointments.find((booking) => booking.uid === last.event.appointment.uid)
    : state.appointments.find(
        (booking) => format(booking.from, "yyyy-MM-dd") === format(state.selectedDate, "yyyy-MM-dd")
      );

  return (
    <Section
      id="adapter"
      title="Your data, as it already is"
      description={
        <p>
          No conversion step. The adapter tells the scheduler which fields hold the id, resource,
          start, end and title, by name or with a getter. Changes come back as your own object,
          and <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">applySchedulerAppointmentChange</code> writes
          them into the same fields. Move a booking and watch the object below the grid.
        </p>
      }
    >
      <DemoFrame
        label={coworking.name}
        hint="Bookings stored as { uid, room, from, to, label }"
        aside={
          <div className="p-4">
            <p className="text-xs font-medium text-muted-foreground">
              {last ? "Your booking object, after the last change" : "A booking object in your state"}
            </p>
            {shown ? (
              <pre
                key={last?.key ?? "initial"}
                className={`mt-3 w-fit max-w-full overflow-x-auto rounded-lg border border-border bg-muted/60 p-3 font-mono text-xs leading-5 ${
                  last ? "log-enter" : ""
                }`}
              >
                {describeBooking(shown)}
              </pre>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">No bookings on this day.</p>
            )}
          </div>
        }
      >
        <Scheduler
          resources={ADAPTER_ROOMS}
          appointments={state.appointments}
          selectedDate={state.selectedDate}
          onSelectedDateChange={state.onSelectedDateChange}
          onAppointmentChange={state.onAppointmentChange}
          getResourceAppointmentColorToken={(room) => room.color}
          workingDays={coworking.workingDays}
          dayStart={coworking.dayStart}
          dayEnd={coworking.dayEnd}
          adapter={{ ...BOOKING_FIELDS, title: "label" }}
        />
      </DemoFrame>
      <CodeBlock
        title="Bookings.tsx"
        highlight={["const fields", "adapter=", "onAppointmentChange="]}
        code={`
type Booking = { uid: string; room: string; from: Date; to: Date; label: string; bookedBy: string };

const fields = { id: "uid", resourceId: "room", start: "from", end: "to" } as const;

<Scheduler<Booking, Room, string>
  resources={rooms}
  appointments={bookings}
  adapter={{ ...fields, title: "label" }}
  selectedDate={date}
  onSelectedDateChange={setDate}
  onAppointmentChange={(change) =>
    setBookings((current) => applySchedulerAppointmentChange(current, change, fields))
  }
/>
`}
      />
    </Section>
  );
}

/* ------------------------------------------------------------------- colors */

const TOKENS = ["rose", "amber", "teal", "indigo", "sky", "emerald", "violet", "lime", "orange", "slate"];
const TOKEN_OPTIONS = TOKENS.map((token) => ({ value: token, label: token }));

export function ColorsDemo() {
  const state = useScenario(salon);
  const [tokens, setTokens] = React.useState<Record<string, string>>(() =>
    Object.fromEntries(salon.resources.map((stylist) => [stylist.id, stylist.color]))
  );
  const colorOf = React.useCallback((stylist: Resource) => tokens[stylist.id], [tokens]);

  const code = `
const colors = {
${salon.resources.map((stylist) => `  ${stylist.id}: "${tokens[stylist.id]}",`).join("\n")}
};

<Scheduler
  resources={stylists}
  appointments={appointments}
  selectedDate={date}
  onSelectedDateChange={setDate}
  views={["week"]}
  getResourceAppointmentColorToken={(stylist) => colors[stylist.id]}
/>
`;

  return (
    <Section
      id="colors"
      title="A color for each resource"
      description={
        <p>
          Pick a built-in color token per resource and every card, agenda row and week item of that
          resource uses it. For full control, map resources to your own classes with{" "}
          <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">resourceAppointmentClassMap</code> or{" "}
          <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">getResourceAppointmentAppearance</code>.
        </p>
      }
    >
      <div className="flex flex-wrap gap-x-6 gap-y-4 rounded-xl border border-border bg-card p-4">
        {salon.resources.map((stylist) => (
          <ControlGroup
            key={stylist.id}
            label={stylist.label}
          >
            <Select
              label={`Color for ${stylist.label}`}
              options={TOKEN_OPTIONS}
              value={tokens[stylist.id]}
              onChange={(token) => setTokens((current) => ({ ...current, [stylist.id]: token }))}
            />
          </ControlGroup>
        ))}
      </div>
      <DemoFrame label={salon.name}>
        <Scheduler
          {...baseProps(salon, state)}
          views={["week"]}
          getResourceAppointmentColorToken={colorOf}
        />
      </DemoFrame>
      <CodeBlock
        title="SalonColors.tsx"
        highlight={["getResourceAppointmentColorToken"]}
        code={code}
      />
    </Section>
  );
}

/* ------------------------------------------------------------ custom render */

type RenderAppointment = NonNullable<
  SchedulerCommonProps<Appointment, Resource, string>["renderAppointment"]
>;

const renderAppointment: RenderAppointment = ({
  appointment,
  isDropInvalid,
  onPointerDown,
  onResizePointerDown,
  appointmentAppearance,
}) => {
  const pending = appointment.raw.note === "Awaiting reply";
  const state =
    appointment.visualState === "ghost"
      ? "opacity-40"
      : appointment.visualState === "dragging"
        ? "opacity-90 shadow-lg"
        : "";

  return (
    <div
      onPointerDown={onPointerDown}
      className={`relative h-full cursor-grab overflow-hidden rounded-lg border border-black/5 px-2.5 py-1.5 text-zinc-900 dark:border-white/10 dark:text-zinc-50 ${
        appointmentAppearance?.className ?? ""
      } ${isDropInvalid ? "ring-2 ring-red-500" : ""} ${state}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] tabular-nums opacity-75">
          {time(appointment.start)}–{time(appointment.end)}
        </span>
        <span
          className={`rounded-full px-1.5 text-[10px] font-medium ${
            pending ? "bg-amber-500/20 text-amber-900 dark:text-amber-200" : "bg-black/5 dark:bg-white/10"
          }`}
        >
          {appointment.raw.note}
        </span>
      </div>
      <p className="mt-0.5 truncate text-[13px] font-semibold">{appointment.title}</p>
      <div
        onPointerDown={onResizePointerDown}
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-2 cursor-ns-resize"
      />
    </div>
  );
};

const renderResourceHeader = (doctor: Resource) => (
  <div className="flex items-center gap-2.5">
    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
      {doctor.initials}
    </span>
    <span className="min-w-0">
      <span className="block truncate text-sm font-semibold">{doctor.label}</span>
      <span className="block truncate text-xs font-normal text-muted-foreground">{doctor.role}</span>
    </span>
  </div>
);

export function CustomRenderDemo() {
  const state = useScenario(clinic);

  return (
    <Section
      id="custom-rendering"
      title="Render it your way"
      description={
        <p>
          Replace the card, the resource header, the agenda row, the week day header, the toolbar or
          the date picker. Your card receives the appointment, its color and the drag handlers, so
          move and resize keep working.
        </p>
      }
    >
      <DemoFrame
        label={clinic.name}
        hint="Custom cards and headers, still draggable"
      >
        <Scheduler
          {...baseProps(clinic, state)}
          resources={CUSTOM_DOCTORS}
          renderAppointment={renderAppointment}
          renderResourceHeader={renderResourceHeader}
        />
      </DemoFrame>
      <CodeBlock
        title="CustomCards.tsx"
        highlight={["renderResourceHeader=", "renderAppointment="]}
        code={`
<Scheduler
  {...props}
  renderResourceHeader={(doctor) => <DoctorHeader doctor={doctor} />}
  renderAppointment={({ appointment, onPointerDown, onResizePointerDown, appointmentAppearance }) => (
    <div onPointerDown={onPointerDown} className={appointmentAppearance?.className}>
      <span>{format(appointment.start, "HH:mm")}–{format(appointment.end, "HH:mm")}</span>
      <StatusBadge status={appointment.raw.note} />
      <strong>{appointment.title}</strong>
      <div onPointerDown={onResizePointerDown} className="resize-handle" />
    </div>
  )}
/>
`}
      />
    </Section>
  );
}

/* ---------------------------------------------------------------- read-only */

export function ReadOnlyDemo() {
  const state = useScenario(coworking);
  const [selected, setSelected] = React.useState<Appointment | null>(null);
  const room = selected ? state.resourceById.get(selected.resourceId) : undefined;

  return (
    <Section
      id="read-only"
      title="Read-only, with clicks"
      description={
        <p>
          Set <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">editable</code> to{" "}
          <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">false</code> for a display screen or a
          viewer role. <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">onAppointmentClick</code> still
          fires, so you can open details, and it never fires at the end of a drag.
        </p>
      }
    >
      <DemoFrame
        label={coworking.name}
        hint="Click a booking"
        aside={
          <div className="p-4">
            <p className="font-mono text-xs text-muted-foreground">onAppointmentClick</p>
            {selected ? (
              <div
                key={selected.id}
                className="log-enter mt-3 w-fit min-w-72 rounded-lg border border-border p-3"
              >
                <p className="font-medium">{selected.title}</p>
                <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
                  <dt className="text-muted-foreground">Room</dt>
                  <dd>{room?.label}</dd>
                  <dt className="text-muted-foreground">When</dt>
                  <dd className="tabular-nums">
                    {format(new Date(selected.start), "EEE d, HH:mm")}–{time(new Date(selected.end))}
                  </dd>
                  <dt className="text-muted-foreground">Booked by</dt>
                  <dd>{selected.note}</dd>
                </dl>
              </div>
            ) : (
              <div className="mt-3 flex items-center gap-3 rounded-lg border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
                <MousePointerClick className="size-5 shrink-0 text-accent-ink" />
                <p>Click any booking to open its details here.</p>
              </div>
            )}
          </div>
        }
      >
        <Scheduler
          {...baseProps(coworking, state)}
          resources={DISPLAY_ROOMS}
          editable={false}
          onAppointmentClick={(booking) => setSelected(booking)}
        />
      </DemoFrame>
      <CodeBlock
        title="RoomsDisplay.tsx"
        highlight={["editable=", "onAppointmentClick="]}
        code={`
<Scheduler
  resources={rooms}
  appointments={bookings}
  selectedDate={date}
  onSelectedDateChange={setDate}
  editable={false}
  onAppointmentClick={(booking) => openDetails(booking)}
/>
`}
      />
    </Section>
  );
}
