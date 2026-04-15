---
id: 90
date: 2026-04-14
type: "🐞 bug"
epic:
status: open
priority: "❗"
tags:
  - design
  - imported
---

# Progress display: handle missing table cells

When a progress table has missing items (no data to display), don't show it
as a table with blank rows. Either skip the table format, or put an X /
placeholder for missing items so it doesn't look broken.
