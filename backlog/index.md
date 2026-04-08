---
date: 2026-04-08
type: index
---
# Backlog

All tracked work for Music Reps. Each feature/bug is a note in `items/`
with a numeric ID. Epics are grouping pages in `epics/`.
## All items

```dataview
TABLE id, type, status, priority, epic
FROM "backlog/items"
SORT priority ASC, id ASC
```

## Open items by epic

```dataview
TABLE id, type, priority
FROM "backlog/items"
WHERE status = "open" OR status = "active"
GROUP BY epic
SORT priority ASC
```

## Epics

```dataview
TABLE status, priority
FROM "backlog/epics"
SORT status ASC, priority ASC
```
