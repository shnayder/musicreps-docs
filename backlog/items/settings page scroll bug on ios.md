---
id: 16
date: 2026-04-01
type: "🐞 bug"
epic:
status: open
priority: "❗❗"
tags: []
td-id: td-012bf9
---

# Settings page scroll bug on iOS

Weird settings scroll bug: scroll all skills a bit, switch to settings, it’s scrolled too, doesn’t scroll back. Race condition somewhere. But why is this even possible? Opportunity to simplify components/css/etc? These tabs shouldn’t even be in the dom at the same time, no?
