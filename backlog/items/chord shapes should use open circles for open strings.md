---
id: 77
date: 2026-04-13
type: 🐞 bug
epic: "[[pre-launch polish]]"
status: review
priority: ❗
tags:
  - design
---

# Chord shapes: use open circles for open strings

Chord shape diagrams should use open circles for open strings, to match
standard chord diagram conventions.

## Investigation

Chord-shape modes use `InteractiveFretboard` ([`src/ui/interactive-fretboard.tsx`](../../../musicreps/src/ui/interactive-fretboard.tsx)). Fret 0 circles (sitting on the nut row) are colored via `setCircleFill` — solid fill, identical to fretted notes. Convention: fret 0 should be a hollow outline circle.

## Proposed plan

Teach `setCircleFill` / `setCircleRing` about fret 0:

1. In both helpers, after parsing `posKey`, branch when `f === '0'`: apply `fill: none; stroke: <color>; stroke-width: 2.5` instead of a solid fill. This makes fret-0 positions render as outline-only circles in every state where they'd otherwise be filled (collection tap feedback, correct/missed after evaluation).
2. The existing wrong-tap "ring" behavior for fret 0 is already outline-only, so no change needed there — but confirm stroke width stays consistent with the new open-string styling.
3. Verify `clearAllCircles` already resets both fill and stroke (it does — lines 66-70) so switching items works.
4. No change needed to `fretboard.ts` / `positionCircles`; the base SVG is transparent and all state comes from imperative styling.

### Open questions
- Should fret-0 circles be hollow **always** (including during collection, when user taps an open string) or only after evaluation? Convention-matching suggests always — a tapped open string = "you're playing this string open" = hollow circle.
	- ⚡️yes, always
- Should we make the hollow circle slightly larger than fretted dots (standard chord diagrams often do)? Or keep the current radius for tap-target consistency?
	- ⚡️yes, let's try that -- inner radius should match the fretted dot size
