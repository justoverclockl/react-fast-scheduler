import type { BaseSchedulerResource } from "../src";

export type Resource = BaseSchedulerResource<number> & {
  appointmentColorClass?: string;
};

export type Appointment = {
  id: number;
  resourceId: number;
  description?: string;
  title: string;
  start: string;
  end: string;
};

export const resources: Resource[] = [
  { id: 1, label: "Room A", appointmentColorClass: "bg-amber-100 dark:bg-amber-950/40" },
  { id: 2, label: "Room B", appointmentColorClass: "bg-blue-100 dark:bg-blue-950/40" },
  { id: 3, label: "Room C", appointmentColorClass: "bg-emerald-100 dark:bg-emerald-950/40" },
  { id: 4, label: "Room D", appointmentColorClass: "bg-rose-100 dark:bg-rose-950/40" },
  { id: 5, label: "Room E", appointmentColorClass: "bg-cyan-100 dark:bg-cyan-950/40" },
  { id: 6, label: "Room F", appointmentColorClass: "bg-lime-100 dark:bg-lime-950/40" },
  { id: 7, label: "Room G", appointmentColorClass: "bg-violet-100 dark:bg-violet-950/40" },
  { id: 8, label: "Room H", appointmentColorClass: "bg-orange-100 dark:bg-orange-950/40" },
  { id: 9, label: "Room I", appointmentColorClass: "bg-pink-100 dark:bg-pink-950/40" },
  { id: 10, label: "Room J", appointmentColorClass: "bg-teal-100 dark:bg-teal-950/40" },
];

const buildDateAtTime = (baseDate: Date, time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
    hours,
    minutes,
    0,
    0
  );
};

const createAppointment = (
  id: number,
  resourceId: number,
  title: string,
  description: string,
  start: string,
  end: string,
  baseDate: Date
  // eslint-disable-next-line max-params
): Appointment => ({
  id,
  resourceId,
  title,
  description,
  start: buildDateAtTime(baseDate, start).toISOString(),
  end: buildDateAtTime(baseDate, end).toISOString(),
});

const appointmentTemplates = [
  {
    resourceId: 1,
    entries: [
      ["Morning Intake", "New patient onboarding and history review", "09:00", "09:45"],
      ["Treatment Plan", "Discuss goals, constraints, and next steps", "10:00", "10:45"],
      ["Follow-up Visit", "Progress review with updated notes", "11:15", "12:00"],
      ["Quick Check-in", "Short assessment before lunch", "12:15", "12:45"],
      ["Afternoon Session", "Extended one-on-one appointment", "14:00", "15:00"],
      ["Review Call", "Phone review and adjustments", "15:30", "16:00"],
      ["Late Consultation", "Focused consultation with recap", "16:15", "17:00"],
      ["Wrap-up", "End-of-day notes and client handoff", "17:15", "17:45"],
    ],
  },
  {
    resourceId: 2,
    entries: [
      ["Evaluation", "Initial room B evaluation", "09:15", "10:00"],
      ["Deep Session", "Longer session with detailed reporting", "10:15", "11:30"],
      ["Coordination", "Resource coordination and planning", "11:45", "12:30"],
      ["Lunch Follow-up", "Short midday follow-up", "13:15", "13:45"],
      ["Procedure Block", "Reserved treatment/procedure window", "14:00", "15:15"],
      ["Status Review", "Progress updates and documentation", "15:45", "16:30"],
      ["Consultation", "Customer consultation with action items", "16:45", "17:30"],
    ],
  },
  {
    resourceId: 3,
    entries: [
      ["Diagnostics", "Initial diagnostics and baseline capture", "09:00", "09:30"],
      ["Planning Session", "Care plan alignment with the team", "10:00", "10:45"],
      ["Therapy Slot", "Guided treatment session", "11:00", "11:45"],
      ["Case Review", "Review notes and treatment responses", "13:00", "13:45"],
      ["Therapy Slot", "Second treatment block", "14:15", "15:00"],
      ["Documentation", "Clinical documentation and summary", "15:30", "16:00"],
      ["Final Check", "End-of-day room closeout", "16:30", "17:15"],
    ],
  },
  {
    resourceId: 4,
    entries: [
      ["Walk-in Intake", "Short intake for same-day booking", "09:30", "10:00"],
      ["Assessment", "Functional assessment and notes", "10:15", "11:00"],
      ["Treatment", "Hands-on treatment block", "11:30", "12:15"],
      ["Review", "Midday review and adjustments", "13:30", "14:00"],
      ["Procedure", "Reserved room procedure time", "14:15", "15:00"],
      ["Consultation", "Follow-up consultation and plan", "15:30", "16:15"],
      ["Handoff", "Patient handoff and closeout", "16:45", "17:15"],
    ],
  },
  {
    resourceId: 5,
    entries: [
      ["Prep Session", "Room prep and first customer briefing", "09:00", "09:30"],
      ["Extended Review", "Detailed review with intake updates", "09:45", "10:45"],
      ["Focused Session", "Targeted intervention session", "11:15", "12:00"],
      ["Progress Notes", "Update notes between visits", "13:15", "13:45"],
      ["Treatment", "Afternoon treatment block", "14:00", "14:45"],
      ["Check-up", "Short progress check", "15:15", "15:45"],
      ["Wrap-up", "Summary and next appointment planning", "16:15", "17:00"],
    ],
  },
  {
    resourceId: 6,
    entries: [
      ["Opening Visit", "First scheduled visit of the day", "09:15", "10:00"],
      ["Plan Review", "Review objectives and constraints", "10:30", "11:00"],
      ["Treatment Block", "Longer hands-on session", "11:15", "12:15"],
      ["Follow-up", "Short follow-up after lunch", "13:30", "14:00"],
      ["Case Work", "Deeper case work and annotation", "14:30", "15:30"],
      ["Notes", "Document updates and closing remarks", "16:00", "16:30"],
      ["Consultation", "Late consultation slot", "16:45", "17:30"],
    ],
  },
  {
    resourceId: 7,
    entries: [
      ["Morning Review", "Morning readiness and customer review", "09:00", "09:45"],
      ["Session A", "Structured treatment session", "10:15", "11:00"],
      ["Session B", "Back-to-back mid-morning slot", "11:15", "12:00"],
      ["Admin Gap Fill", "Documentation and room reset", "12:30", "13:00"],
      ["Session C", "Afternoon appointment window", "13:30", "14:15"],
      ["Session D", "Long-form appointment block", "14:45", "15:45"],
      ["Closing Review", "Closeout and notes", "16:15", "17:00"],
    ],
  },
  {
    resourceId: 8,
    entries: [
      ["Arrival Intake", "Arrival, consent, and intake", "09:30", "10:00"],
      ["Primary Session", "Main morning session", "10:15", "11:15"],
      ["Quick Review", "Short post-session review", "11:30", "12:00"],
      ["Afternoon Start", "First afternoon appointment", "13:15", "14:00"],
      ["Procedure", "Reserved equipment/procedure slot", "14:30", "15:15"],
      ["Follow-up Call", "Remote follow-up and notes", "15:45", "16:15"],
      ["Final Slot", "Last booked slot of the day", "16:30", "17:15"],
    ],
  },
  {
    resourceId: 9,
    entries: [
      ["Consult Start", "Initial consult with overview", "09:00", "09:30"],
      ["Detailed Intake", "Collect details and requirements", "09:45", "10:30"],
      ["Treatment", "Morning treatment block", "11:00", "11:45"],
      ["Midday Follow-up", "Brief midday follow-up", "12:15", "12:45"],
      ["Review Session", "Review progress and next steps", "14:00", "14:45"],
      ["Treatment", "Second treatment block", "15:15", "16:00"],
      ["Documentation", "Finalize notes and release", "16:30", "17:00"],
    ],
  },
  {
    resourceId: 10,
    entries: [
      ["Opening Consult", "Kickoff consult and setup", "09:15", "10:00"],
      ["Care Planning", "Define plan and milestones", "10:15", "11:00"],
      ["Session Block", "Longer mid-morning engagement", "11:30", "12:30"],
      ["Short Check-in", "Post-lunch check-in", "13:30", "14:00"],
      ["Procedure Review", "Review procedure outcome and updates", "14:15", "15:00"],
      ["Late Session", "Late afternoon booked session", "15:30", "16:15"],
      ["Closeout", "Final notes and room closeout", "16:45", "17:30"],
    ],
  },
] as const;

export const createTodayAppointments = (baseDate: Date): Appointment[] => {
  let nextId = 1;

  return appointmentTemplates.flatMap(({ resourceId, entries }) =>
    entries.map(([title, description, start, end]) =>
      createAppointment(nextId++, resourceId, title, description, start, end, baseDate)
    )
  );
};
