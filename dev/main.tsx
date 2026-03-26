import * as React from "react";
import { createRoot } from "react-dom/client";

import { Scheduler } from "../src";
import "../src/global.css";
import { Button } from "../src/components/ui/button";
import { Calendar } from "../src/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../src/components/ui/popover";

import { createTodayAppointments, resources } from "./const";
import "./styles.css";

import type { Appointment, Resource } from "./const";

function App() {
  const [selectedDate, setSelectedDate] = React.useState(() => new Date());
  const [appointments, setAppointments] = React.useState<Appointment[]>(() =>
    createTodayAppointments(new Date())
  );

  return (
    <div className="min-h-screen w-full px-6 py-6">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
        <header className="rounded-2xl border border-border/70 bg-card/90 p-5 shadow-sm backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Scheduler Studio
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                Premium booking overview
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage Room A–J with a calm, high-clarity timeline experience.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-2 text-xs font-medium text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Live preview
            </div>
          </div>
        </header>
        <section className="flex-1">
          <Scheduler<Appointment, Resource, number>
            resources={resources}
            appointments={appointments}
            selectedDate={selectedDate}
            onSelectedDateChange={setSelectedDate}
            adapter={{
              getId: (item) => item.id,
              getResourceId: (item) => item.resourceId,
              getStart: (item) => item.start,
              getEnd: (item) => item.end,
              getTitle: (item) => item.title,
            }}
            renderToolbar={({
              selectedDate: value,
              onSelectedDateChange,
              goToPreviousDay,
              goToNextDay,
            }) => (
              <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-border/70 bg-card/90 p-4 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-sm font-semibold text-foreground">Room availability</div>
                  <div className="text-xs text-muted-foreground">{value.toDateString()}</div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousDay}
                  >
                    Indietro
                  </Button>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="min-w-44 justify-start text-left font-normal"
                      >
                        {value.toDateString()}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-2"
                      align="center"
                    >
                      <Calendar
                        selected={value}
                        onSelect={onSelectedDateChange}
                      />
                    </PopoverContent>
                  </Popover>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextDay}
                  >
                    Avanti
                  </Button>
                </div>
              </div>
            )}
            onAppointmentChange={async ({ next, appointment }) => {
              setAppointments((prev) =>
                prev.map((item) =>
                  item.id === appointment.id
                    ? {
                        ...item,
                        resourceId: next.resourceId,
                        start: next.start.toISOString(),
                        end: next.end.toISOString(),
                      }
                    : item
                )
              );
            }}
            getResourceAppointmentBackground={(resource) => resource.appointmentColorClass}
            renderResourceHeader={(resource) => <strong className="text-sm">{resource.label}</strong>}
            renderAppointment={({
              appointment,
              isDropInvalid,
              onPointerDown,
              onResizePointerDown,
              appointmentBackgroundColor,
            }) => (
              <div
                onPointerDown={onPointerDown}
                className={`relative h-full overflow-hidden rounded-2xl border p-2.5 pb-4 text-foreground shadow-sm transition ${
                  appointment.visualState === "dragging" ? "cursor-grabbing" : "cursor-grab"
                } ${
                  appointment.visualState === "ghost" ? "border-dashed opacity-60" : "border-border/70"
                } ${
                  isDropInvalid
                    ? "border-red-500 bg-red-100/80 ring-1 ring-red-500/60"
                    : (appointmentBackgroundColor ?? "bg-card")
                }`}
              >
                {isDropInvalid ? (
                  <div className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                    X
                  </div>
                ) : null}
                <div className="flex items-start justify-between gap-2">
                  <div className="text-[11px] font-semibold leading-tight">{appointment.title}</div>
                  <span className="rounded-full border border-border/60 bg-background/70 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                    {appointment.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                {appointment.raw.description ? (
                  <div className="mt-1 text-[10px] font-medium leading-snug text-muted-foreground">
                    {appointment.raw.description}
                  </div>
                ) : null}
                <div
                  role="button"
                  aria-label="Resize appointment"
                  className="absolute inset-x-2 bottom-1.5 h-1.5 cursor-ns-resize rounded-full bg-border/80 transition-colors hover:bg-border"
                  onPointerDown={(event) => {
                    if (appointment.visualState === "ghost") {
                      return;
                    }
                    event.stopPropagation();
                    onResizePointerDown(event);
                  }}
                />
              </div>
            )}
          />
        </section>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
