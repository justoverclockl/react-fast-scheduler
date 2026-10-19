# react-fast-scheduler

A lightweight React day scheduler for resource-based booking UIs.

`react-fast-scheduler` gives you a controlled day view with:

- resource columns for staff, rooms, or assets
- drag and resize interactions
- date navigation with a built-in toolbar and date picker
- customizable appointment rendering
- a simple field adapter layer for your backend data

![Scheduler demo](https://res.cloudinary.com/dt74zb1rv/image/upload/v1774457086/Video_del_2026-03-25_17-35-51_kuflee.gif)

## Agenda views:
![Scheduler demo](https://i.ibb.co/yFkM7fGF/agenda.png)

## Install

```bash
npm install @marco.colia/react-fast-scheduler
```

Peer dependencies:

- `react` `^18 || ^19`
- `react-dom` `^18 || ^19`

Import the packaged styles once in your app:

```tsx
import "@marco.colia/react-fast-scheduler/styles.css";
```

The packaged stylesheet is scoped to the scheduler wrapper, so it does not write theme tokens to your app `:root` or reuse unprefixed Tailwind utility names.

When you pass your own class strings through props like `resourceAppointmentClassMap`, `appointmentColorTokenClassMap`, or a custom `renderAppointment`, those classes belong to your app and can use your own Tailwind setup.

## Quick Start

If your appointments already use the field names `id`, `resourceId`, `start`, `end`, and `title`, you do not need an adapter:

```tsx
import { useState } from "react";
import { Scheduler, applySchedulerAppointmentChange } from "@marco.colia/react-fast-scheduler";
import "@marco.colia/react-fast-scheduler/styles.css";

const resources = [
  { id: 1, label: "Alice" },
  { id: 2, label: "Bob" },
];

export const MinimalScheduler = () => {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [appointments, setAppointments] = useState([
    { id: 1, resourceId: 1, title: "Haircut", start: "2026-03-27T09:00:00", end: "2026-03-27T10:00:00" },
  ]);

  return (
    <Scheduler
      resources={resources}
      appointments={appointments}
      selectedDate={selectedDate}
      onSelectedDateChange={setSelectedDate}
      onAppointmentChange={(change) =>
        setAppointments((prev) =>
          applySchedulerAppointmentChange(prev, change, {
            dateValue: (date) => date.toISOString(),
          })
        )
      }
      onAppointmentClick={(appointment) => console.log("clicked", appointment)}
    />
  );
};
```

### Full example with a backend

The scheduler is a controlled component:

- your app owns `selectedDate`
- your app fetches appointments for that date
- the scheduler calls `onSelectedDateChange` when the user navigates
- your app updates `appointments` and passes the new data back in

```tsx
import { useEffect, useState } from "react";
import {
  Scheduler,
  applySchedulerAppointmentChange,
  type BaseSchedulerResource,
  type SchedulerAppointmentChangeEvent,
} from "@marco.colia/react-fast-scheduler";
import "@marco.colia/react-fast-scheduler/styles.css";

type Staff = BaseSchedulerResource<number> & {
  firstName: string;
  lastName: string;
};

type Appointment = {
  id: number;
  staffId: number;
  customerName: string;
  title: string;
  description?: string;
  start: string;
  end: string;
};

const formatLocalDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const SchedulerExample = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const loadStaff = async () => {
    const response = await fetch("/api/staff");
    const data = (await response.json()) as Staff[];
    setStaff(data);
  };

  const loadAppointments = async (date: Date) => {
    const response = await fetch(`/api/appointments?date=${formatLocalDate(date)}`);
    const data = (await response.json()) as Appointment[];
    setAppointments(data);
  };

  const persistAppointment = async (
    appointmentId: number,
    nextAppointment: Appointment
  ) => {
    await fetch(`/api/appointments/${appointmentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextAppointment),
    });
  };

  const handleAppointmentChange = async (
    change: SchedulerAppointmentChangeEvent<Appointment, number>
  ) => {
    // `id`, `start`, and `end` use the default names, so only `resourceId` needs mapping.
    const optimisticAppointments = applySchedulerAppointmentChange(appointments, change, {
      resourceId: "staffId",
      dateValue: (date) => date.toISOString(),
    });

    setAppointments(optimisticAppointments);

    const nextAppointment = optimisticAppointments.find(
      (item) => item.id === change.appointment.id
    );

    if (!nextAppointment) {
      return;
    }

    try {
      await persistAppointment(change.appointment.id, nextAppointment);
    } catch {
      await loadAppointments(selectedDate);
    }
  };

  useEffect(() => {
    void loadStaff();
  }, []);

  useEffect(() => {
    void loadAppointments(selectedDate);
  }, [selectedDate]);

  return (
    <Scheduler<Appointment, Staff, number>
      resources={staff}
      appointments={appointments}
      selectedDate={selectedDate}
      onSelectedDateChange={setSelectedDate}
      adapter={{
        resourceId: "staffId",
        title: (item) => `${item.customerName} - ${item.title}`,
      }}
      onAppointmentChange={handleAppointmentChange}
      dayStart="09:00"
      dayEnd="18:00"
    />
  );
};
```

## How Data Flow Works

When the user changes the day from the built-in toolbar or date picker:

1. the scheduler calls `onSelectedDateChange(nextDate)`
2. your state updates `selectedDate`
3. your `useEffect` runs again
4. your app fetches appointments for the new date
5. you pass the fetched appointments back into `appointments`

This is the intended integration pattern:

```tsx
useEffect(() => {
  void loadAppointments(selectedDate);
}, [selectedDate]);

<Scheduler
  selectedDate={selectedDate}
  onSelectedDateChange={setSelectedDate}
  appointments={appointments}
  resources={resources}
  adapter={adapter}
/>
```

## Core Concepts

### `resources`

Each column in the scheduler is a resource. A resource must have at least:

```ts
type BaseSchedulerResource<TId> = {
  id: TId;
  label: string;
};
```

Typical resources:

- staff members
- rooms
- desks
- service stations

### `appointments`

Appointments stay in your own shape. The scheduler reads them through the `adapter`.

### `adapter`

The adapter tells the scheduler which appointment fields to read. Every field has a default:

| Field        | Default        | Expected value      |
| ------------ | -------------- | ------------------- |
| `id`         | `"id"`         | `string \| number`  |
| `resourceId` | `"resourceId"` | the resource `id`   |
| `start`      | `"start"`      | `Date \| string`    |
| `end`        | `"end"`        | `Date \| string`    |
| `title`      | `"title"`      | `string`            |

If your appointments already use those names, omit `adapter` entirely. Otherwise map only the fields that differ:

```tsx
adapter={{ resourceId: "staffId" }}
```

TypeScript checks this: `adapter` (or a single field) is only optional when your appointment type has a matching field under the default name. Otherwise you get a compile error instead of empty cards at runtime.

You can still map every field by key:

```tsx
adapter={{
  id: "id",
  resourceId: "staffId",
  start: "start",
  end: "end",
  title: "title",
}}
```

Each field can also be a function when you need to derive a value:

```tsx
adapter={{
  id: "id",
  resourceId: "staffId",
  start: "start",
  end: "end",
  title: (item) => `${item.customerName} - ${item.title}`,
}}
```

Start and end fields can resolve to either a `Date` or a date string.

Key-based adapters can be written inline: the scheduler compares the field values, not the object identity, so an inline `adapter={{ ... }}` does not trigger extra recalculations. If you use function fields, keep them stable (define them outside the component or with `useCallback`).

The older getter adapter is still supported:

```tsx
adapter={{
  getId: (item) => item.id,
  getResourceId: (item) => item.staffId,
  getStart: (item) => item.start,
  getEnd: (item) => item.end,
  getTitle: (item) => item.title,
}}
```

## Drag, Resize, and Persistence

Use `onAppointmentChange` as the main integration point for move and resize operations.

It receives:

- `appointment`: the original raw appointment
- `resourceId`, `start`, and `end`: the new values after drop
- `previousResourceId`, `previousStart`, and `previousEnd`: the values before drag or resize
- `previous`: the previous resource and time range
- `next`: the new resource and time range after drop
- `kind`: `"move"` or `"resize"`

Example:

```tsx
<Scheduler
  // ...other props
  onAppointmentChange={async ({ appointment, resourceId, start, end }) => {
    const nextAppointment = {
      ...appointment,
      staffId: resourceId,
      start: start.toISOString(),
      end: end.toISOString(),
    };

    await fetch(`/api/appointments/${appointment.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextAppointment),
    });
  }}
/>
```

If you want a small helper for optimistic local state updates, use `applySchedulerAppointmentChange`. Like the adapter, it defaults to the `id`, `resourceId`, `start`, and `end` fields, so you only map what differs:

```tsx
// Appointments with the default field names, stored as Date objects
const nextAppointments = applySchedulerAppointmentChange(appointments, change);

// Different resource field, dates stored as ISO strings
const nextAppointments = applySchedulerAppointmentChange(appointments, change, {
  resourceId: "staffId",
  dateValue: (date) => date.toISOString(),
});
```

Without `dateValue`, `start` and `end` are written as `Date` objects. Pass `dateValue` when your data stores dates as strings.

Drops that would overlap another appointment on the same resource are rejected: the card is shown in red while dragging and `onAppointmentChange` is not called.

The previous setter-based helper options are still supported for non-object data or custom immutable updates.

`onPersistMoveResize` is still available as a legacy callback, but `onAppointmentChange` is the recommended API.

If you want to render the scheduler in read-only mode, use `editable={false}`:

```tsx
<Scheduler
  // ...other props
  editable={false}
/>
```

When `editable` is `false`, move and resize interactions are disabled.

## Clicking Appointments

Use `onAppointmentClick` to open a detail view or an edit form:

```tsx
<Scheduler
  // ...other props
  onAppointmentClick={(appointment, event) => {
    setSelectedAppointment(appointment);
  }}
/>
```

It receives your original appointment object and the click event. It is not called at the end of a drag or resize, and it works with both the built-in card and a custom `renderAppointment`. It also works when `editable` is `false`.

## Views

Besides the default resource grid (`"day"`), the scheduler has an `"agenda"` view: a compact view of the selected day with one column per resource. Each column lists that resource's appointments one after the other, ordered by start time, with no empty slots between them; each card shows its start and end time.

Unlike the grid, cards are not sized by duration, so overlapping or short appointments stay readable.

Enable it with `views`. When more than one view is listed, the built-in toolbar shows a view switcher:

```tsx
<Scheduler
  // ...other props
  views={["day", "agenda"]}
/>
```

Without `views`, only the grid is available and no switcher is shown, exactly as before.

The agenda uses the same data as the grid, so your data loading does not change: the toolbar still moves one day at a time and calls `onSelectedDateChange`.

In the agenda:

- column headers use the same `renderResourceHeader` as the grid
- each column is a plain list: free time is not shown, so cards in different columns are not aligned by time
- rows use the same colors as the grid cards (see [Styling](#styling))
- `onAppointmentClick` works on each row
- move and resize are not available
- appointments whose `resourceId` does not match a resource are not shown, like in the grid
- when the whole day has no appointments, `agendaEmptyState` is shown instead of the columns

### Controlling the view

By default the scheduler keeps the current view in its own state. Use `defaultView` to choose the initial view, or `view` + `onViewChange` to control it from your app (for example to save it in the URL):

```tsx
const [view, setView] = useState<SchedulerView>("agenda");

<Scheduler
  // ...other props
  views={["day", "agenda"]}
  view={view}
  onViewChange={setView}
/>
```

### Labels and empty state

```tsx
<Scheduler
  // ...other props
  views={["day", "agenda"]}
  viewLabels={{ day: "Giorno", agenda: "Agenda" }}
  agendaEmptyState="Nessun appuntamento"
/>
```

### Custom agenda rows

Use `renderAgendaItem` to replace the content of each agenda row. It receives the normalized `appointment` (with `title`, `start`, `end`, and your original object in `raw`), the `resource` of its column, and the resolved `appointmentAppearance`:

```tsx
<Scheduler
  // ...other props
  views={["day", "agenda"]}
  renderAgendaItem={({ appointment, appointmentAppearance }) => (
    <div className={`flex gap-3 rounded-md p-2 ${appointmentAppearance?.className ?? ""}`}>
      <span>{appointment.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
      <strong>{appointment.title}</strong>
    </div>
  )}
/>
```

With a custom row, `onAppointmentClick` is still called when the row is clicked. If the row should be reachable by keyboard, render a `<button>` inside it.

## Styling

The package ships precompiled CSS:

```tsx
import "@marco.colia/react-fast-scheduler/styles.css";
```

You can override the exposed CSS variables on the scheduler wrapper:

```css
.rfs-root {
  --rfs-bg: #f8fafc;
  --rfs-surface: #ffffff;
  --rfs-border: #e2e8f0;
  --rfs-text: #0f172a;
  --rfs-muted: #64748b;
}
```

If you want a dark override, target `.dark .rfs-root`.

### Resource-based colors

The simplest option is `resourceAppointmentClassMap`:

```tsx
<Scheduler
  // ...other props
  resourceAppointmentClassMap={{
    "1": "bg-amber-100 dark:bg-amber-950/40",
    "2": "bg-blue-100 dark:bg-blue-950/40",
  }}
/>
```

Those class names are consumer-provided and are expected to come from your app stylesheet or Tailwind build.

If you want semantic mapping, use `getResourceAppointmentColorToken` plus `appointmentColorTokenClassMap`:

```tsx
<Scheduler
  // ...other props
  getResourceAppointmentColorToken={(resource) => resource.category}
  appointmentColorTokenClassMap={{
    vip: "bg-yellow-100 dark:bg-yellow-950/40",
    urgent: "bg-rose-100 dark:bg-rose-950/40",
  }}
/>
```

Built-in tokens (`slate`, `gray`, `zinc`, `neutral`, `stone`, `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose`) ship with the packaged stylesheet, so they work without Tailwind in your app:

```tsx
<Scheduler
  // ...other props
  getResourceAppointmentColorToken={(resource) => (resource.id === 1 ? "blue" : "rose")}
/>
```

For full control, use `getResourceAppointmentAppearance`.

When a resource matches more than one option, the first match wins:

1. `resourceAppointmentClassMap`
2. `getResourceAppointmentAppearance`
3. `getResourceAppointmentColorToken` (+ `appointmentColorTokenClassMap`)
4. `getResourceAppointmentBackground` (legacy)
5. the built-in neutral background

## Custom Rendering

### Custom appointment card

`renderAppointment` lets you fully replace the built-in card.

The appointment passed to your renderer also includes:

- `visualState`: `"normal" | "ghost" | "dragging"`
- `renderKey`: an internal render key

The renderer also receives:

- `isDropInvalid`: `true` when the current drag position overlaps another appointment
- `onPointerDown`: attach this to your appointment root for move interactions
- `onResizePointerDown`: attach this to your resize handle; it already stops propagation, so the move handler does not fire

```tsx
<Scheduler
  // ...other props
  renderAppointment={({
    appointment,
    isDropInvalid,
    onPointerDown,
    onResizePointerDown,
    appointmentAppearance,
    appointmentBackgroundColor,
  }) => (
    <div
      onPointerDown={onPointerDown}
      className={`relative h-full overflow-hidden rounded-md p-2 pb-5 ${
        appointment.visualState === "ghost"
          ? "cursor-grab opacity-55"
          : appointment.visualState === "dragging"
            ? "cursor-grabbing opacity-55 shadow-sm"
            : "cursor-grab"
      } ${
        isDropInvalid
          ? "bg-red-100/80 text-red-950"
          : appointmentAppearance?.className ?? appointmentBackgroundColor ?? "bg-slate-100"
      }`}
    >
      <div className="text-xs font-semibold">{appointment.title}</div>
      {appointment.raw.description ? (
        <div className="mt-1 text-[10px] font-medium text-slate-500">
          {appointment.raw.description}
        </div>
      ) : null}
      <div
        role="button"
        aria-label="Resize appointment"
        onPointerDown={onResizePointerDown}
        className="absolute inset-x-1 bottom-1 h-2 cursor-ns-resize rounded-full bg-slate-300/90 hover:bg-slate-400"
      />
    </div>
  )}
/>
```

### Custom toolbar

If you omit `renderToolbar`, the scheduler renders a built-in toolbar with previous/next navigation and a date picker.

Use `renderToolbar` when you want to replace the whole header:

```tsx
<Scheduler
  // ...other props
  renderToolbar={({ selectedDate, goToPreviousDay, goToNextDay, defaultDatePicker }) => (
    <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3">
      <div>
        <div className="text-sm font-medium">{selectedDate.toDateString()}</div>
        <div className="text-xs text-muted-foreground">Team schedule</div>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" className="rounded-md border px-3 py-2 text-sm" onClick={goToPreviousDay}>
          Previous
        </button>
        {defaultDatePicker}
        <button type="button" className="rounded-md border px-3 py-2 text-sm" onClick={goToNextDay}>
          Next
        </button>
      </div>
    </div>
  )}
/>
```

`renderToolbar` also receives `view`, `views`, `onViewChange`, and `defaultViewSwitcher` (the built-in switcher, or `null` when fewer than two views are enabled). Render `{defaultViewSwitcher}` in your toolbar to keep the view switch, or build your own with `views` and `onViewChange`.

### Custom date picker slot

If you want to keep the default toolbar but swap the date picker UI, use `renderDatePicker`.

```tsx
<Scheduler
  // ...other props
  renderDatePicker={({ selectedDate, onSelectedDateChange }) => (
    <button type="button" onClick={() => onSelectedDateChange(new Date())}>
      {selectedDate.toDateString()}
    </button>
  )}
/>
```

## Props Reference

### Required props

- `resources`: array of resource objects
- `appointments`: array of raw appointment objects
- `selectedDate`: currently visible day
- `onSelectedDateChange`: controlled date change handler
- `adapter`: key-based or getter-based mapper between your appointment shape and scheduler fields; optional when your appointments use the default field names (see [`adapter`](#adapter))

### Common optional props

- `onAppointmentChange`: async or sync handler for move and resize persistence; receives both flat next values and the nested `previous`/`next` objects
- `onAppointmentClick`: called with the raw appointment and the click event on a plain click (not after a drag or resize)
- `editable`: enables or disables move and resize interactions, defaults to `true`
- `renderToolbar`: replace the full toolbar
- `renderDatePicker`: replace only the date picker slot used by the default toolbar
- `renderResourceHeader`: custom resource header renderer
- `renderAppointment`: custom appointment renderer
- `resourceAppointmentClassMap`: per-resource class names
- `getResourceAppointmentColorToken`: semantic color token selector
- `appointmentColorTokenClassMap`: token-to-class map
- `getResourceAppointmentAppearance`: low-level class name appearance mapping
- `getResourceAppointmentBackground`: legacy background string hook
- `prevButtonLabel`: custom previous button label
- `nextButtonLabel`: custom next button label
- `dayStart`: visible schedule start time, for example `"09:00"`
- `dayEnd`: visible schedule end time, for example `"18:00"`
- `views`: views offered by the switcher, for example `["day", "agenda"]`; defaults to `["day"]` (no switcher)
- `view`: controlled current view (`"day"` or `"agenda"`)
- `defaultView`: initial view when `view` is not controlled; defaults to the first entry of `views`
- `onViewChange`: called when the user picks a view in the switcher
- `viewLabels`: switcher labels, for example `{ day: "Giorno", agenda: "Agenda" }`
- `renderAgendaItem`: custom agenda row content
- `agendaEmptyState`: content shown in the agenda when the day has no appointments, defaults to `"No appointments"`

## Production Notes

- Keep `selectedDate` in application state and fetch data when it changes.
- Prefer formatting dates in local time for day-based API queries. `toISOString().slice(0, 10)` can shift the day around midnight because it uses UTC.
- If persistence fails after a drag or resize, either roll back local state or refetch the visible day.
- For large schedules, keep `resources`, `appointments`, adapter function fields, and render/click callbacks stable when their data has not changed so React can reuse scheduler calculations. Key-based adapters can stay inline.
- Import the package CSS once at app startup.

## Development

Repo-specific development notes, local demo usage, and release workflow are in [DEVELOPMENT.md](./DEVELOPMENT.md).
