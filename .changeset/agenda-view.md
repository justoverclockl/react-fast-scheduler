---
"@marco.colia/react-fast-scheduler": minor
---

Add an optional agenda view: a compact table of the selected day with one row every 15 minutes (times in a sticky left sidebar) and one column per resource; each cell lists the appointments starting in that slot.

- Enable it with `views={["day", "agenda"]}`; the built-in toolbar then shows a view switcher. Without `views` nothing changes.
- Control the view with `view` + `onViewChange`, or set the initial one with `defaultView`.
- Customize it with `viewLabels`, `renderAgendaItem`, and `agendaEmptyState`.
- `renderToolbar` now also receives `view`, `views`, `onViewChange`, and `defaultViewSwitcher`.
