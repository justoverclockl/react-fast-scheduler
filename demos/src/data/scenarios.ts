import type { BaseSchedulerResource, SchedulerWeekday } from "@marco.colia/react-fast-scheduler";

/** Every name, place and appointment on the site is fictional. */

export type Appointment = {
  id: string;
  resourceId: string;
  title: string;
  start: string;
  end: string;
  note: string;
};

export type Resource = BaseSchedulerResource<string> & {
  role: string;
  /** Services this resource offers; falls back to the scenario titles. */
  titles?: string[];
  initials: string;
  /** One of the scheduler's built-in color tokens. */
  color: string;
};

export type Scenario = {
  id: string;
  name: string;
  resources: Resource[];
  titles: string[];
  notes: string[];
  durations: number[];
  workingDays: SchedulerWeekday[];
  dayStart: string;
  dayEnd: string;
};

export const clinic: Scenario = {
  id: "clinic",
  name: "Northside Clinic",
  resources: [
    {
      id: "okafor",
      label: "Dr. Amara Okafor",
      role: "General practice",
      initials: "AO",
      color: "sky",
      titles: ["New patient intake", "Follow-up visit", "Vaccination", "Blood test review", "Allergy consult"],
    },
    {
      id: "ferri",
      label: "Dr. Luca Ferri",
      role: "Physiotherapy",
      initials: "LF",
      color: "emerald",
      titles: ["Physio session", "Back pain assessment", "Post-op rehab", "Sports injury check"],
    },
    {
      id: "sato",
      label: "Dr. Hana Sato",
      role: "Dermatology",
      initials: "HS",
      color: "violet",
      titles: ["Skin check", "Mole mapping", "Acne follow-up", "Post-op check"],
    },
    {
      id: "imaging",
      label: "Imaging room",
      role: "Ultrasound and X-ray",
      initials: "IR",
      color: "amber",
      titles: ["Abdominal ultrasound", "Chest X-ray", "Knee X-ray", "Thyroid ultrasound"],
    },
  ],
  titles: [
    "New patient intake",
    "Follow-up visit",
    "Physio session",
    "Skin check",
    "Ultrasound",
    "Vaccination",
    "Blood test review",
    "Post-op check",
    "Back pain assessment",
    "Allergy consult",
  ],
  notes: ["Confirmed", "Confirmed", "Confirmed", "Awaiting reply", "First visit"],
  durations: [30, 30, 45, 45, 60, 90],
  workingDays: [1, 2, 3, 4, 5],
  dayStart: "08:00",
  dayEnd: "18:00",
};

export const salon: Scenario = {
  id: "salon",
  name: "Studio Lume",
  resources: [
    { id: "giulia", label: "Giulia", role: "Senior stylist", initials: "GI", color: "rose" },
    { id: "noor", label: "Noor", role: "Colourist", initials: "NO", color: "amber" },
    { id: "theo", label: "Theo", role: "Barber", initials: "TH", color: "teal" },
    { id: "mei", label: "Mei", role: "Stylist", initials: "ME", color: "indigo" },
  ],
  titles: [
    "Cut & blow-dry",
    "Balayage",
    "Colour retouch",
    "Beard trim",
    "Bridal trial",
    "Wash & style",
    "Fringe trim",
    "Gloss treatment",
  ],
  notes: ["Regular client", "Confirmed", "Deposit paid", "New client"],
  durations: [30, 45, 60, 60, 90, 120],
  workingDays: [2, 3, 4, 5, 6],
  dayStart: "09:00",
  dayEnd: "19:00",
};

export const coworking: Scenario = {
  id: "coworking",
  name: "Dock 7 Coworking",
  resources: [
    { id: "harbour", label: "Harbour room", role: "8 seats", initials: "HR", color: "sky" },
    { id: "pier", label: "Pier booth", role: "2 seats", initials: "PB", color: "lime" },
    { id: "loft", label: "Studio loft", role: "Recording", initials: "SL", color: "fuchsia" },
    { id: "deck", label: "Deck table", role: "12 seats", initials: "DT", color: "orange" },
  ],
  titles: [
    "Team standup",
    "Client pitch",
    "Podcast recording",
    "Design review",
    "Interview",
    "Workshop",
    "Investor call",
    "Sprint planning",
  ],
  notes: ["Acme Labs", "Fernweh", "Kite & Co", "Internal"],
  durations: [30, 45, 60, 60, 90],
  workingDays: [1, 2, 3, 4, 5],
  dayStart: "08:00",
  dayEnd: "18:00",
};
