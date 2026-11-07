---
"@marco.colia/react-fast-scheduler": patch
---

Faster rendering. The day grid draws its hour and 15-minute lines as a CSS background, two elements per column instead of one per line, with the same look. The week view re-renders only the rows whose appointments changed. If you styled the lines with your own CSS, target `.rfs-hour-lines` and `.rfs-slot-lines` (background layers) instead of `.rfs-hour-line` and `.rfs-slot-line`.
