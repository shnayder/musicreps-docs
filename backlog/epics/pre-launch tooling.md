---
date: 2026-04-08
type: "🧰 epic"
status: active
priority: "❗❗❗"
tags: [launch]
---

# Pre-launch tooling

Release workflows, build management, admin tooling needed before launch.

## Items

```dataview
TABLE id, type, status, priority
FROM "backlog/items"
WHERE epic = this.file.link
SORT priority ASC, id ASC
```
