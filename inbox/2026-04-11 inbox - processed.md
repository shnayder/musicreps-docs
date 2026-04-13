---
date: 2026-04-13
type: plan
status: done
source: "[[2026-04-11 inbox]]"
---

# Processing plan for 2026-04-11 inbox

## New items to create

| #   | Proposed title                                                           | Type        | Priority | Tags           | Epic                  | Decision               |
| --- | ------------------------------------------------------------------------ | ----------- | -------- | -------------- | --------------------- | ---------------------- |
| 1   | Chord shapes: use open circles for open strings                          | 🐞 bug      | ❗        | design         | [[pre-launch polish]] |                        |
| 2   | Chord spelling: entered note lost if accidental not tapped first         | 🐞 bug      | ❗❗       | ux             |                       |                        |
| 3   | Add delete/backspace button to clear last entered note in chord spelling | 🛠️ feature | ❗        | ux             |                       |                        |
| 4   | Fretboard mode: 4+3 buttons smaller than 6+6, should match               | 🐞 bug      | ❗❗       | design         | [[pre-launch polish]] |                        |
| 5   | Small-button layouts too small — size up when space allows               | 🐞 bug      | ❗        | design, mobile | [[pre-launch polish]] | ⚡️combine with above.  |

## Ideas

| # | Proposed title | Tags | Decision |
|---|---------------|------|----------|
| 1 | Show freshness info to the user somewhere | ux, algorithm | ⚡️ (user said "idea, not feature for now") |

## Merge / update existing items

| Source note                                          | Existing item                                            | Action                                                                                   | Decision                                                     |
| ---------------------------------------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| "Review level ordering in recs — should go in order" | #14 prioritize level order more in recommendation system | Add observation: seeing L1/L2 Learning, L3 Hesitant, recs suggest L2+L3 instead of L1+L2 |                                                              |
| "notes↔semitones: mix directions as inner dimension" | #76 within-level item selection                          | Add note: direction (note→semi vs semi→note) should be an inner dimension in mixed modes | ⚡️make a new item -- #76 already landed, this is fine-tuning |
| "review EWMA" (speed metric)                         | #76 within-level item selection                          | Already flagged in #76 as 🔜 to consider median vs EWMA                                  | ⚡️make a new item                                            |

## Skipped

| Item | Reason |
|------|--------|
| (none) | |

## Summary

- **5** new items (4 bugs, 1 feature)
- **1** idea
- **3** merges (2 into #76, 1 into #14)
- Next ID will start at **77**
