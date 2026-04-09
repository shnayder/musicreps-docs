---
date: 2026-04-08
type: "🧰 epic"
status: active
priority: "❗❗❗"
tags: [launch]
---

# Pre-launch polish

Bugs, rough edges, and must-have improvements before public launch.

## Items

```dataview
TABLE id, type, status, priority
FROM "backlog/items"
WHERE epic = this.file.link
SORT priority ASC, id ASC
```
