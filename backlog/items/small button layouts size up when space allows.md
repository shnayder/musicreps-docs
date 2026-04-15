---
id: 80
date: 2026-04-13
type: 🐞 bug
epic: "[[pre-launch polish]]"
status: review
priority: ❗❗
tags:
  - design
  - mobile
---

# Small-button layouts: size up when space allows

Fretboard mode: response buttons in 4+3 layout (natural notes only) are smaller than in 6+6 layout. Use the bigger size for all response buttons, except on really short screens (iphone SE) when we need the vertical space.

## Investigation

Two grid classes in [`src/styles.css:1783-1795`](../../../musicreps/src/styles.css):

- `.answer-grid` — 4 columns, `max-width: var(--size-answer-grid)` (272px desktop, **220px on mobile** from styles.css:2741)
- `.answer-grid-6` — 6 columns, `max-width: var(--size-answer-grid-wide)` (400px, **not shrunk on mobile**)

Fretboard's `useFretboardController` returns `buttonColumns: hasAccidentals ? undefined : 4` ([`src/modes/fretboard/definition.tsx:261`](../../../musicreps/src/modes/fretboard/definition.tsx)), which switches `NoteButtons` ([`src/ui/buttons.tsx:82`](../../../musicreps/src/ui/buttons.tsx)) to plain `.answer-grid`.

On mobile, 4+3 buttons end up ~55px wide (220px/4) while 6+6 buttons are ~67px wide (400px/6) — visibly smaller.

## Proposed plan

Make the 4+3 layout size up to match (or exceed) the 6+6 button size whenever there's room:

1. **Target button size**: match the 6+6 button width (~67px on mobile). For 4+3 that means a container of ~300px (4×67 + 3×gap).
2. **CSS change**: give `.answer-grid` (4-col) a column width driven by the same target as `.answer-grid-6`, e.g. introduce `--size-answer-btn` and compute both containers from it:
   - `.answer-grid { max-width: calc(4 * var(--size-answer-btn) + 3 * var(--gap-related)); }`
   - `.answer-grid-6 { max-width: calc(6 * var(--size-answer-btn) + 5 * var(--gap-related)); }`
3. **Short-screen override**: wrap the shrink in `@media (max-height: 667px)` (iPhone SE is 375×667) — reduce `--size-answer-btn` there so vertical space is preserved. Drop the existing `--size-answer-grid: 220px` mobile override (which was width-based and too aggressive).
4. **Touch other usages**: `.answer-grid-stack` (chord spelling / key signatures) also uses `--size-answer-grid` as its max-width — re-evaluate it in the same pass so SplitButtons don't shrink on mobile for no reason.

### Open questions
- Is `max-height: 667px` the right breakpoint? Should we also gate on viewport width (e.g. only shrink on narrow *and* short)?
	- ⚡️make it 700px -- I don't know what android phones use. Just height is fine.
- Should chord spelling / key signature split grids (SplitButtons) also grow to the new larger size, or is the current narrower feel fine for them?
	- ⚡️yes, make them all match. When there's space, make them easy to tap -- we're aiming for speed across the app. 

