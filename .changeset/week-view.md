---
"@marco.colia/react-fast-scheduler": minor
---

Add the `"week"` view: the 7 days of the week containing `selectedDate` as a table with one row per resource and one column per day; each cell lists that resource's appointments of the day, ordered by start time (`renderAgendaItem` and `onAppointmentClick` work as in the agenda). New props `weekStartsOn` (defaults to Monday) and `renderWeekDayHeader`; `renderToolbar` also receives `goToPrevious`, `goToNext` and `visibleDays`; new `getSchedulerVisibleDays(view, selectedDate, { weekStartsOn, workingDays })` helper. The day and agenda views are unchanged. TypeScript: `SchedulerView` now includes `"week"`, so an exhaustive `switch` or a complete `Record<SchedulerView, ...>` needs the new case.
