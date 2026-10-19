# react-fast-scheduler

## 4.1.0

### Minor Changes

- [`9c5489c`](https://github.com/justoverclockl/react-fast-scheduler/commit/9c5489cb4321ab3692dceafd73556be14a8f38f4) Thanks [@justoverclockl](https://github.com/justoverclockl)! - Refactor of Agenda views for more readability

### Patch Changes

- [`9c5489c`](https://github.com/justoverclockl/react-fast-scheduler/commit/9c5489cb4321ab3692dceafd73556be14a8f38f4) Thanks [@justoverclockl](https://github.com/justoverclockl)! - Agenda view: each resource column is now a compact list of its appointments ordered by start time, instead of a 15-minute grid. Empty slots and the time sidebar are gone; each card still shows its start and end time (exact minutes, e.g. `10:15–11:48`).

## 4.0.0

### Major Changes

- [`46a01c6`](https://github.com/justoverclockl/react-fast-scheduler/commit/46a01c6b411b8db82695e28c08982c5e358c6ac6) Thanks [@justoverclockl](https://github.com/justoverclockl)! - Introducing "Agenda views" and refactor code to improve performance and types.

### Minor Changes

- [`46a01c6`](https://github.com/justoverclockl/react-fast-scheduler/commit/46a01c6b411b8db82695e28c08982c5e358c6ac6) Thanks [@justoverclockl](https://github.com/justoverclockl)! - Add an optional agenda view: a compact table of the selected day with one row every 15 minutes (times in a sticky left sidebar) and one column per resource; each cell lists the appointments starting in that slot.
  - Enable it with `views={["day", "agenda"]}`; the built-in toolbar then shows a view switcher. Without `views` nothing changes.
  - Control the view with `view` + `onViewChange`, or set the initial one with `defaultView`.
  - Customize it with `viewLabels`, `renderAgendaItem`, and `agendaEmptyState`.
  - `renderToolbar` now also receives `view`, `views`, `onViewChange`, and `defaultViewSwitcher`.

- [`46a01c6`](https://github.com/justoverclockl/react-fast-scheduler/commit/46a01c6b411b8db82695e28c08982c5e358c6ac6) Thanks [@justoverclockl](https://github.com/justoverclockl)! - Make the scheduler easier to set up, without breaking existing code:
  - `adapter` is now optional when appointments use the default field names (`id`, `resourceId`, `start`, `end`, `title`), and a key-based adapter only needs the fields that differ (for example `adapter={{ resourceId: "staffId" }}`). TypeScript still requires every field that has no matching default.
  - Inline key-based adapters no longer trigger recalculation on every render.
  - `applySchedulerAppointmentChange` uses the same defaults, so `options` can be omitted or reduced to the fields that differ.
  - New `onAppointmentClick` prop, called on plain clicks only (not after a drag or resize).
  - Fix: the built-in color tokens (`blue`, `rose`, ...) for `getResourceAppointmentColorToken` now ship in the packaged stylesheet and work without Tailwind in the host app.

## 3.2.0

### Minor Changes

- [#38](https://github.com/justoverclockl/react-fast-scheduler/pull/38) [`8801308`](https://github.com/justoverclockl/react-fast-scheduler/commit/8801308386a80694e4c3fbb9fc29b0d8bd909ec9) Thanks [@justoverclockl](https://github.com/justoverclockl)! - Add key-based appointment adapters and optimistic appointment change helpers while preserving the existing getter and setter APIs.

## 3.1.0

### Minor Changes

- [#36](https://github.com/justoverclockl/react-fast-scheduler/pull/36) [`67627bf`](https://github.com/justoverclockl/react-fast-scheduler/commit/67627bf6abf210da7c441816a6cc5bd30a7c2334) Thanks [@justoverclockl](https://github.com/justoverclockl)! - Added global "isEditable" props to make the sheduler read-only based on a boolean flag (useful for RBAC)

## 3.0.0

### Major Changes

- [#34](https://github.com/justoverclockl/react-fast-scheduler/pull/34) [`1cf5c3f`](https://github.com/justoverclockl/react-fast-scheduler/commit/1cf5c3f59755dae78926c7b647696a8a6e9c7b4a) Thanks [@justoverclockl](https://github.com/justoverclockl)! - Add prefix to tailwind styles anb scope styles for the component

## 2.2.2

### Patch Changes

- [#28](https://github.com/justoverclockl/react-fast-scheduler/pull/28) [`a8efd95`](https://github.com/justoverclockl/react-fast-scheduler/commit/a8efd953c5d12411b8eec95b2e60032767fce0cd) Thanks [@justoverclockl](https://github.com/justoverclockl)! - Better final bundle size

## 2.2.1

### Patch Changes

- [#25](https://github.com/justoverclockl/react-fast-scheduler/pull/25) [`cc94fd3`](https://github.com/justoverclockl/react-fast-scheduler/commit/cc94fd389838471c222276af62857a23a438ffeb) Thanks [@justoverclockl](https://github.com/justoverclockl)! - Improve documentation

## 2.2.0

### Minor Changes

- [#21](https://github.com/justoverclockl/react-fast-scheduler/pull/21) [`fbcef4a`](https://github.com/justoverclockl/react-fast-scheduler/commit/fbcef4a37a017d84dd23f365014b998ebb4daa5d) Thanks [@justoverclockl](https://github.com/justoverclockl)! - Add more formatting rules with related CI to push formatted code. Splitted also the grid into smaller components (SlotLine and HourLine). Add alias for all paths.

- [#23](https://github.com/justoverclockl/react-fast-scheduler/pull/23) [`82dd115`](https://github.com/justoverclockl/react-fast-scheduler/commit/82dd115af8f49b387121015dc8e5b54add02c1ba) Thanks [@justoverclockl](https://github.com/justoverclockl)! - Ghost card dragging implemented, rendering optimizations for large appointments dataset, fixes and improvements. Updated docs.

### Patch Changes

- [#17](https://github.com/justoverclockl/react-fast-scheduler/pull/17) [`2718d57`](https://github.com/justoverclockl/react-fast-scheduler/commit/2718d570c28f65e08cf0fc0ba9ca71a920519277) Thanks [@MDub3y](https://github.com/MDub3y)! - Refactor the scheduler internals by extracting toolbar, header, gutter, and resource column components, and move internal scheduler types into a dedicated internal types module. This change does not alter the public API.

- [#19](https://github.com/justoverclockl/react-fast-scheduler/pull/19) [`fef0231`](https://github.com/justoverclockl/react-fast-scheduler/commit/fef023191b924e0eec9f38c1465648f9a5355fae) Thanks [@justoverclockl](https://github.com/justoverclockl)! - Enforce code quality rules for development and add a CI workflow

## 2.1.1

### Patch Changes

- [#14](https://github.com/justoverclockl/react-fast-scheduler/pull/14) [`90f41f7`](https://github.com/justoverclockl/react-fast-scheduler/commit/90f41f758940c917a8c0a545edbb00acfc113e64) Thanks [@justoverclockl](https://github.com/justoverclockl)! - customizable toolbar and sticky column in mobile

## 2.1.0

### Minor Changes

- [#11](https://github.com/justoverclockl/react-fast-scheduler/pull/11) [`3ef5560`](https://github.com/justoverclockl/react-fast-scheduler/commit/3ef55602d74f8aef75ce3d743f0a81d3a422d960) Thanks [@justoverclockl](https://github.com/justoverclockl)! - Folder organization improved

## 2.0.0

### Major Changes

- [#7](https://github.com/justoverclockl/react-fast-scheduler/pull/7) [`5961511`](https://github.com/justoverclockl/react-fast-scheduler/commit/59615113c559d1194f7e575bbf69437e20e486c8) Thanks [@justoverclockl](https://github.com/justoverclockl)! - Enhance scheduler component

## 1.0.2

### Patch Changes

- [#5](https://github.com/justoverclockl/react-fast-scheduler/pull/5) [`88a18fd`](https://github.com/justoverclockl/react-fast-scheduler/commit/88a18fda3680912050716fa5ec7b0376b2cd6cde) Thanks [@justoverclockl](https://github.com/justoverclockl)! - patch readme

## 1.0.1

### Patch Changes

- [`7fca7a4`](https://github.com/justoverclockl/react-fast-scheduler/commit/7fca7a4c18d1181793953714c8e6e4c1d7bbfda5) Thanks [@justoverclockl](https://github.com/justoverclockl)! - Align package metadata and README usage to scoped npm package name.

## 1.0.0

### Major Changes

- [#1](https://github.com/justoverclockl/react-fast-scheduler/pull/1) [`88d69b8`](https://github.com/justoverclockl/react-fast-scheduler/commit/88d69b8d493a907f1a754462ef3f989a362a3022) Thanks [@justoverclockl](https://github.com/justoverclockl)! - Initial library POC version
