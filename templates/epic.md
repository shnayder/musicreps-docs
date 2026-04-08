---
date: <% tp.date.now("YYYY-MM-DD") %>
type: "🧰 epic"
status: open
priority: "❗❗"
tags: []
---

## Goal

What this epic aims to achieve.

## Scope

What's in and out of scope.

## Items

```dataview
TABLE status, priority, type
FROM "backlog/items"
WHERE epic = this.file.link
SORT priority ASC
```
