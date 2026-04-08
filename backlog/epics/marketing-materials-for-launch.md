---
date: 2026-03-31
type: "🧰 epic"
status: open
priority: "❗❗❗"
tags: []
td-id: td-db2f21
---

# Marketing materials for launch

## Goal

Everything I need to launch in the app store. Including website, if I want one.

## Items

```dataview
TABLE id, type, status, priority
FROM "backlog/items"
WHERE epic = this.file.link
SORT priority ASC, id ASC
```
