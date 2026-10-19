---
"@marco.colia/react-fast-scheduler": minor
---

Make the scheduler easier to set up, without breaking existing code:

- `adapter` is now optional when appointments use the default field names (`id`, `resourceId`, `start`, `end`, `title`), and a key-based adapter only needs the fields that differ (for example `adapter={{ resourceId: "staffId" }}`). TypeScript still requires every field that has no matching default.
- Inline key-based adapters no longer trigger recalculation on every render.
- `applySchedulerAppointmentChange` uses the same defaults, so `options` can be omitted or reduced to the fields that differ.
- New `onAppointmentClick` prop, called on plain clicks only (not after a drag or resize).
- Fix: the built-in color tokens (`blue`, `rose`, ...) for `getResourceAppointmentColorToken` now ship in the packaged stylesheet and work without Tailwind in the host app.
