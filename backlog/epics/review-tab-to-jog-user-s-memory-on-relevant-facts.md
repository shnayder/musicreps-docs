---
date: 2026-03-31
type: "🧰 epic"
status: open
priority: "❗❗"
tags: []
td-id: td-ecca94
---

# "Review" tab to jog user's memory on relevant facts

## Goal

e.g. for fretboard, show a labeled map. For key sigs, show the table. For chords spelling, show the chord structures.

## Items

```dataview
TABLE id, type, status, priority
FROM "backlog/items"
WHERE epic = this.file.link
SORT priority ASC, id ASC
```
