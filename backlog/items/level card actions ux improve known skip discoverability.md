---
id: 25
date: 2026-03-26
type: "☑️ task"
epic:
status: open
priority: "❗"
tags: []
td-id: td-d83ab7
---

# Level card actions UX: improve 'known'/'skip' discoverability

Problem: Level progress cards have ✓ (known/mastered) and ✗ (skip/deferred) icon buttons that don't communicate their meaning, especially on mobile with no hover. Previously tried a '...' menu (overkill). Current bare icons are unclear.

These are really skill config actions living on the progress tab, which is a bit odd.

Ideas explored:
- Tap-to-expand action row (clean default, self-documenting when open)
- State chip replacing two buttons (compact, shows current state)
- Keep icons + add state label when active (still weak first-time discoverability)
- Move actions to Custom practice tab entirely (separation of concerns, but Custom toggles would need known/skip states)
