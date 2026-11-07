import { Scheduler } from "@marco.colia/react-fast-scheduler";

import { ChangeLog } from "../components/ChangeLog";
import { CodeBlock } from "../components/CodeBlock";
import { DemoFrame } from "../components/DemoFrame";
import { clinic } from "../data/scenarios";
import { useScenario } from "../data/useScenario";

import { baseProps, pick } from "./shared";

const code = `
import { Scheduler, applySchedulerAppointmentChange } from "@marco.colia/react-fast-scheduler";
import "@marco.colia/react-fast-scheduler/styles.css";

export function ClinicSchedule() {
  const [date, setDate] = useState(new Date());
  const [appointments, setAppointments] = useState(initialAppointments);

  return (
    <Scheduler
      resources={doctors}
      appointments={appointments}
      selectedDate={date}
      onSelectedDateChange={setDate}
      onAppointmentChange={(change) =>
        setAppointments((current) => applySchedulerAppointmentChange(current, change))
      }
      views={["day", "week", "agenda"]}
      workingDays={[1, 2, 3, 4, 5]}
      dayStart="08:00"
      dayEnd="18:00"
      getResourceAppointmentColorToken={(doctor) => doctor.color}
    />
  );
}
`;

// A person and a piece of equipment, side by side.
const HERO_RESOURCES = pick(clinic, ["okafor", "imaging"]);

export function HeroDemo() {
  const state = useScenario(clinic);

  return (
    <div className="flex flex-col gap-4">
      <DemoFrame
        label={clinic.name}
        hint="Drag, resize, switch views"
        aside={
          <ChangeLog
            changes={state.changes}
            resourceById={state.resourceById}
          />
        }
      >
        <Scheduler
          {...baseProps(clinic, state)}
          resources={HERO_RESOURCES}
          views={["day", "week", "agenda"]}
        />
      </DemoFrame>
      <CodeBlock
        code={code}
        title="ClinicSchedule.tsx"
        highlight={["onAppointmentChange=", "views="]}
      />
    </div>
  );
}
