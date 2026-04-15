---
id: 66
date: 2026-04-09
type: 🐞 bug
epic: "[[pre-launch polish]]"
status: done
priority: ❗❗
tags:
  - mobile
  - design
---

# Interval/number progress table doesn't wrap on phone

I ↔ N progress: interval→number and vice versa aren't wrapping, making the table too wide on phone. Should wrap. Maybe just needs space around the arrow?

## Investigation

Headers defined in [`src/modes/interval-semitones/definition.ts:61-62`](../../../musicreps/src/modes/interval-semitones/definition.ts):

```ts
fwdHeader: 'Interval\u2192Number',
revHeader: 'Number\u2192Interval',
```

Rendered as `<th>` in `StatsTable` (`src/ui/stats.tsx:47`). No `white-space: nowrap` is set — the issue is that each header is a single unbreakable token: the words have no spaces and `→` is a non-breaking character, so the browser has no legal break point.

## Proposed plan

Add thin spaces around the arrow so each header has a legal break point:

```ts
fwdHeader: 'Interval → Number',
revHeader: 'Number → Interval',
```

That alone should allow the table to wrap labels naturally on phones. No CSS changes needed.

If the regular space produces an ugly break (e.g. "Interval" on one line, "→ Number" on the next), fall back to `word-break: break-word` on `.stats-table th` scoped to this mode. But start with just the space.

⚡️Sounds good