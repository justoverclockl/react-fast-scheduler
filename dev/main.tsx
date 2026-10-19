import * as React from "react";
import { createRoot } from "react-dom/client";

import { Scheduler, applySchedulerAppointmentChange } from "../src";
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
    <div className="mx-auto my-6 px-4 font-sans">
      <h1 className="mb-4 text-2xl font-semibold tracking-tight">react-fast-scheduler demo</h1>
      <Scheduler<Appointment, Resource, number>
        resources={resources}
        appointments={appointments}
        selectedDate={selectedDate}
        onSelectedDateChange={setSelectedDate}
        adapter={{
          id: "id",
          resourceId: "resourceId",
          start: "start",
          end: "end",
          title: "title",
        }}
        renderToolbar={({
          selectedDate: value,
          onSelectedDateChange,
          goToPreviousDay,
          goToNextDay,
          defaultViewSwitcher,
        }) => (
          <div className="mb-4 flex flex-col gap-3 rounded-xl p-3 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm font-semibold text-foreground">Team schedule</div>
              <div className="text-xs text-muted-foreground">{value.toDateString()}</div>
            </div>
            <div className="flex items-center flex-wrap gap-2">
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
                    className="min-w-40 justify-start text-left font-normal"
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
              {defaultViewSwitcher}
            </div>
          </div>
        )}
        onAppointmentChange={(change) => {
          setAppointments((prev) =>
            applySchedulerAppointmentChange(prev, change, {
              id: "id",
              resourceId: "resourceId",
              start: "start",
              end: "end",
              dateValue: (date) => date.toISOString(),
            })
          );
        }}
        getResourceAppointmentBackground={(resource) => resource.appointmentColorClass}
        renderResourceHeader={(resource) => <strong className="text-sm">{resource.label}</strong>}
        views={["day", "agenda"]}
        viewLabels={{ day: "Giorno", agenda: "Agenda" }}
        agendaEmptyState="Nessun appuntamento"
      />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
