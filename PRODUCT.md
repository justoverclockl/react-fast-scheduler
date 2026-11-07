# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Library: React component package (`@marco.colia/react-fast-scheduler`), TypeScript, Tailwind v4 with a scoped, `rfs:`-prefixed stylesheet, built with tsup.

Showcase site: React + Vite app in `demos/`, deployed on Vercel, using mocked data only. It renders the library from the repo source so it always shows the current version, including unreleased features.

## Users

React developers who find the library on npm or GitHub and want to decide, in a few minutes, whether it fits their booking or resource-planning UI. They read the README, then open the showcase to see and touch every view before installing. The site is in English, like the README.

## Product Purpose

A lightweight React scheduler for resource-based booking UIs: staff, rooms, or assets as columns or rows, with appointments placed in time. Success for the showcase: a developer sees every view and feature working with realistic data, understands how little integration it needs, and installs it.

## Positioning

- **Lightweight and controlled.** The scheduler is a controlled component: `selectedDate`, `appointments`, and the view live in the host app; changes come back through callbacks (`onSelectedDateChange`, `onAppointmentChange`). No hidden data store.
- **Works with your data.** An adapter maps the app's own appointment objects (keys or getter functions), so there is no conversion step; `applySchedulerAppointmentChange` writes changes back into the same shape.
- **Built for resource planning.** Per-resource agendas (people, rooms, equipment) with drag-to-move across resources and drag-to-resize.

## Operating Context

Developers evaluate it next to the README and their own codebase, usually on desktop. They care about what the integration code looks like as much as the UI. The showcase is linked from the README.

## Capabilities and Constraints

Views:
- `day`: time grid, one column per resource; drag to move (time and resource), drag to resize, overlap detection.
- `agenda`: one list per resource for the selected day, ordered by start.
- `week`: table with one row per resource and one column per day; each cell lists that day's appointments. No drag/resize.

Features: built-in toolbar and date picker (both replaceable), view switcher, controlled or uncontrolled view, `workingDays` (week shows only working days, navigation skips the others, date picker disables them), `weekStartsOn`, `dayStart`/`dayEnd`, `editable` toggle, `onAppointmentClick`, per-resource colors (class map, color tokens, appearance callback), custom renderers (`renderAppointment`, `renderAgendaItem`, `renderResourceHeader`, `renderWeekDayHeader`, `renderToolbar`, `renderDatePicker`), field adapter.

Constraints: React 18/19 peer dependency; styles scoped under `.rfs-root`.

## Brand Commitments

Name: react-fast-scheduler. Author: Marco Colia. License: MIT. Repository: github.com/justoverclockl/react-fast-scheduler. No logo or visual identity defined yet.

## Evidence on Hand

- README with full API documentation.
- Existing demo data in `dev/const.ts` (clinic/rooms scenario).
- Demo GIF and agenda screenshot linked from the README.

No users, testimonials, download counts, benchmarks, or performance claims are available; the showcase must not invent them.

## Product Principles

1. Show, don't claim: every feature on the site is the real component running with mocked data.
2. Show the integration next to the result: the props that produce each view should be visible.
3. Several realistic scenarios (for example clinic, salon, coworking) to show the scheduler is domain-agnostic.
4. Never imply capabilities the library does not have (no drag in agenda/week, no recurring events, no backend).
