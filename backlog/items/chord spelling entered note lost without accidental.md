---
id: 78
date: 2026-04-13
type: "🐞 bug"
epic:
status: open
priority: "❗❗"
tags:
  - ux
  - imported
---

# Chord spelling: entered note lost if accidental not tapped first

Tapped "B", then "Check". Marked wrong because B hadn't entered yet — the
input mechanism was waiting for an accidental tap first. Surprising: the note
should commit when Check is pressed (or be visually clear that it's pending).
