---
"@marco.colia/react-fast-scheduler": minor
---

Add `workingDays` to set the days the schedule is open (`0` is Sunday, `6` is Saturday). The week view shows only working days, Prev/Next in the day and agenda views skip the others, and the default date picker disables them. `renderToolbar` and `renderDatePicker` receive `isWorkingDay`; new `isSchedulerWorkingDay` helper. Without `workingDays` every day is a working day, as before.
