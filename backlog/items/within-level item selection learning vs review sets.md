---
id: 76
date: 2026-04-12
type: "🛠️ feature"
epic:
status: open
priority: "❗❗"
tags:
  - algorithm
---
# Within-level item selection: learning vs review sets

Instead of activating all items in a level at once, maintain a small
**learning set** (items actively being learned) and a larger **review set**
(items being maintained). Adjust the sets dynamically as items graduate from
learning → review.

Discussion:
https://claude.ai/chat/fb0143c7-c053-46aa-893b-bc02b55965d9

Execution plan:
[[2026-04-12-within-level-working-sets]]

Current behavior inventory: [[item-selection]]

## Problem

- Trying to learn 15–50 items at once is not efficient — too many to hold in
  mind at once, feels like re-deriving each answer, not improving quickly.
- Want to keep levels defined by musical structure, even if that means dozens
  of items per level. Don't want to shatter levels into tiny bits just to
  shrink the active set.

## Proposal

Within each level, items are classified on every trial into one of three
buckets based on their current speed and freshness:

- **Active learning** (up to N = 5): items not yet fast — the things you're
  still learning.
- **Review** (up to M = 10): items that *were* fast but have gone stale —
  the things you learned and need to refresh.
- **Fast-and-fresh** (no cap): items that are both fast and fresh — the
  things you've already got. These are a fallback only.

Items in a level have a **fixed order** `i1 ... iN` that should make
musical sense. Bucket membership is assigned by walking that order and
taking the first N (or M) items that match the predicate. The fixed order
therefore controls *which* items fill the caps when more than 5 / 10
qualify — it does **not** control within-bucket draw order.

Trial selection does a 70/30 biased coin flip:

- **70%**: prefer active → review → fast-and-fresh (first non-empty wins).
- **30%**: prefer review → active → fast-and-fresh.

Within whichever bucket is chosen, the existing weighted-random selector
decides the item (slower / staler / unseen items weighted heavier).

If both active and review are empty, the coin flip is moot and selection
falls through to fast-and-fresh — i.e., "you've got this level; we'll
just keep you warm," and the level-recommendation system should suggest a
different level next round.

## Item State

Use existing speed, stability, freshness metrics — no new knobs:

- **Speed**: currently EWMA, normalized to a 0–1 score against the
  calibrated motor baseline.
- **Stability**: spaced-repetition half-life in hours.
- **Freshness**: `2^(-elapsed/stability)`, in [0, 1].

An item is **fast** when its speed score ≥ the Automatic threshold (0.9).
An item is **fresh** when its freshness ≥ `freshnessThreshold` (0.5 —
same cutoff the recommendation system uses for "needs review"). Unseen
items (speed score = null) count as not-fast.

The two predicates are:

- `needs_active_learning(i)`: not fast (speed < Automatic, including
  unseen).
- `needs_review(i)`: fast (speed ≥ Automatic) AND not fresh (freshness <
  `freshnessThreshold`).

These are mutually exclusive. An item that is fast and fresh is in
neither; it's in the fast-and-fresh fallback pool.

🔜 to backlog: Ponder switching speed metric to median — that's the
standard approach in cog sci. Are there reasons to prefer EWMA?

## Bucket population

On every `selectNext` call, recompute from live stats:

1. Exclude the most recently shown item (no-repeat).
2. Walk the level's fixed item order. Collect up to 5 items matching
   `needs_active_learning` → **active_learning**.
3. Walk the order again. Collect up to 10 items matching `needs_review`
   → **review**.
4. Everything else (fast-and-fresh) → **fast_and_fresh**.

A later item in the fixed order *can* appear in the review bucket even
while earlier items are still in active, as long as it qualifies — the
caps just gate how many items we expose at once within each category.

Because this recomputes per trial, there is no explicit "mid-round
promotion" event. An item whose EWMA crosses the Automatic line simply
stops being drawn from active on the next trial; the freed slot in
active is filled by the next `needs_active_learning` item in fixed
order, if any.

## Trial Selection

Within a chosen bucket, weighting uses the existing adaptive weights:
unseen boost, slower → heavier, lower recall → heavier. No bucket-
specific weighting rules.

## Cross-Round Behavior

No extra state persisted — time passes, freshness erodes, and that
drives behavior:

- Items that were fast and fresh carry over as review candidates once
  their freshness decays below the threshold.
- Items whose EWMA regresses (e.g., answered slowly after a long gap)
  flip back into active and are drawn heavily until they re-pass
  Automatic, benefiting from savings.
- When the whole level is fast-and-fresh, the level-recommendation
  system should suggest moving on.

## Design Principles

- **No explicit state machine.** Bucket membership is emergent from
  speed and freshness, recomputed every trial.
- **Fixed order gates exposure, not drawing.** Musical order decides
  *which* qualifying items fill the bucket caps, but draws within a
  bucket are weighted by difficulty as today.
- **Active cap at ~5** to stay within cognitive acquisition limits.
- **No new knobs.** Reuse Automatic + `freshnessThreshold`.

# Pseudocode

```
Items in a level have fixed order i1 ... iN.

needs_active_learning(i):
    true if speed < Automatic (speed score < 0.9, including unseen)

needs_review(i):
    true if speed >= Automatic AND freshness < freshnessThreshold (0.5)

Invariant: at most one of these predicates can return true for any item.

When we need to pick an item:

    # No repetition
    items = items.filter(not the one we just showed)

    # Walk fixed order; cap at 5 active, 10 review
    active_learning = first_five(items.filter(needs_active_learning))
    review          = first_ten(items.filter(needs_review))
    fast_and_fresh  = items.filter(i => !needs_active_learning(i) && !needs_review(i))

    # 70/30 bias between active and review. `choose` picks from the first
    # non-empty bucket, using existing weighting rules (unseen boost,
    # slower = heavier, lower recall = heavier).
    if rand() < 0.7:
        choose(active_learning, review, fast_and_fresh)
    else:
        choose(review, active_learning, fast_and_fresh)
```

## Resolved

- **Thresholds:** no knobs. "Fast" = speed score ≥ Automatic (0.9).
  "Fresh" = freshness ≥ `freshnessThreshold` (0.5, same value already used
  by the recommendation system's "needs review" logic in
  `checkItemsNeedReview` / `computeReviewTiming`).
- **Fall-back when active is empty:** the pseudocode's `choose` picks the
  first non-empty bucket, so if active is empty we get 100% review (and
  if review is also empty, 100% fast-and-fresh). No separate "ignore the
  cap" fallback.
- **Later items can be drawn while earlier items are still in active.** A
  stale item late in the fixed order can sit in the review bucket even
  though earlier items are still in active — the caps (5 / 10) don't
  imply a gate on later items.
- **Mid-round promotion** is implicit: buckets recompute per trial, so
  crossing the Automatic line on trial N removes the item from active on
  trial N+1 with no explicit event.
- **Re-lapsed items and savings.** A lapsed item re-enters `active` at
  its original position in the fixed order. Because `active` is capped at
  5, that naturally pushes out any later-in-order unseen or just-started
  item — i.e., the lapsed item *does* jump ahead of later material. No
  special re-lapse handling needed.
- **Thrashing.** Bucket membership is stateless and only affects draw
  probability; it holds no persisted state. An item that oscillates
  around the Automatic line just oscillates between "drawn from active"
  and "drawn from review" — no promotion/demotion events, nothing to
  thrash.
- **70/30 as a constant.** Define as a named constant (e.g.
  `ACTIVE_BUCKET_BIAS = 0.7`) alongside `N_ACTIVE = 5` and
  `M_REVIEW = 10`. Not user-facing; revisit once we have data.
- **Fretboard fixed order.** Fret by fret, string by string: fret 0 on
  low E, fret 0 on A, fret 0 on D, … then fret 1 across all strings,
  etc. (For Speed Tap / chord shape modes the item is a whole chord, not
  a single fret — see chord ordering below.)

## Fixed order per level

**Convention.** Define a *root cycle* (circle of fifths starting at C):

```
ROOT_CYCLE = C, G, D, A, E, B, F#, C#, G#, D#, A#, F
```

For skills whose items are (root × something-else), the "something-else"
is the outer axis (varies slowly) and `ROOT_CYCLE` is the inner axis
(varies fast, one full cycle per outer step). For bidirectional items,
forward before reverse within the same (outer, root) pair.

### Per-skill ordering

| Skill                    | Level(s)                                                                          | Item count             | Fixed order within level                                                                                                                               |
| ------------------------ | --------------------------------------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Guitar Fretboard**     | Fret groups (per `FRET_GROUPS` in `fretboard/logic.ts`)                           | 78 total               | By fret ascending, then string low→high: `(fret=0, E)`, `(0, A)`, `(0, D)`, `(0, G)`, `(0, B)`, `(0, e)`, `(1, E)`, …                                  |
| **Ukulele Fretboard**    | Fret groups                                                                       | 52 total               | Same as guitar: fret ascending, string low→high (`G, C, E, A` or instrument's own string order)                                                        |
| **Note ↔ Semitones**     | Single group (24 items)                                                           | 24                     | Outer: direction (fwd then rev). Inner: `ROOT_CYCLE`.                                                                                                  |
| **Interval ↔ Semitones** | Single group (24 items)                                                           | 24                     | Outer: direction. Inner: intervals in ascending semitone order (m2, M2, m3, …, M7).                                                                    |
| **Semitone Math**        | 5 distance groups: 1–2, 3–4, 5–6, 7–8, 9–11                                       | 48 / 48 / 48 / 48 / 72 | Outer: distance ascending (1,2 then 3,4 etc.). <br>For each distance: outer direction (+ then −), inner `ROOT_CYCLE`.                                  |
| **Interval Math**        | 5 distance groups: m2–M2, m3–M3, P4–TT, P5–m6, M6–M7                              | same as semitone math  | Same pattern: interval ascending within the group, then direction, then `ROOT_CYCLE`.                                                                  |
| **Key Signatures**       | 4 groups: major sharps, major flats, minor sharps, minor flats (`ALL_KEY_GROUPS`) | 48 total               | Outer: direction (key→sig, then sig→key). Inner: by accidental count (0♯/♭, 1, 2, … 7) — this *is* the circle of fifths for key-sig mode.              |
| **Scale Degrees**        | 3 degree groups (per `DEGREE_GROUPS`)                                             | 144 total              | Outer: degree within group (2, 3, … in ascending order). Inner: direction (fwd/rev), then `ROOT_CYCLE` over keys.                                      |
| **Diatonic Chords**      | 3 chord groups (per `CHORD_GROUPS`)                                               | 168 total              | Outer: numeral within group (I, ii, iii, … ascending). Inner: direction, then `ROOT_CYCLE` over keys.                                                  |
| **Chord Spelling**       | Groups by chord type (triads, 7ths, …)                                            | ~132 total             | Outer: chord type within group (major before minor before dim, etc. — use the order they appear in `SPELLING_GROUPS`). Inner: `ROOT_CYCLE` over roots. |
| **Guitar Chord Shapes**  | 3 quality groups: maj, min, dom7                                                  | 15 total               | Outer: quality (level boundary). Inner: `ROOT_CYCLE` over roots in that quality.                                                                       |
| **Ukulele Chord Shapes** | 3 quality groups                                                                  | 13 total               | Same as guitar chord shapes.                                                                                                                           |
| **Speed Tap**            | Note groups (per `NOTE_GROUPS`)                                                   | —                      | `ROOT_CYCLE` over target notes.                                                                                                                        |

**General rules:**

- "Outer" axes that are *already* the level boundary (e.g., math
  distance, chord quality) don't need to be re-ordered — by definition
  a level contains only one value on that axis.
- When a level has a sub-outer axis inside it (e.g., semitone math's
  `dist-1-2` contains both distance 1 and distance 2), cycle the
  sub-outer before cycling roots: all `root × 1` then all `root × 2`.
- "Forward then reverse" is the default bidirectional convention; it
  matches the order used in the stats grids today.

## Open questions

- **Fixed order for root-based skills** (chord spelling, chord shapes,
  key sigs, scale degrees, diatonic chords, math modes). Two axes to
  commit to:

  1. **Outer axis — what cycles slowly?** Likely the *quality / shape /
     operation*, because teaching "major triad" and then reusing that
     pattern across 12 roots is closer to how you'd teach this
     interactively than randomly mixing qualities. For math modes the
     outer axis is the interval/distance; for scale degrees it's the
     degree; for diatonic chords it's the numeral.

  2. **Inner axis — what cycles within the outer?** Candidates:
     - **Circle of fifths** (C G D A E B F♯ …) — already the mental
       model for key sigs, natural for chord roots.
     - **Chromatic** (C C♯ D D♯ …) — matches fretboard semitone logic.
     - **By accidentals** (naturals first, then sharps, then flats) —
       closest to "easy to hard" but fragments the circle.

     Proposal: **circle of fifths** as the default inner axis for all
     root-based skills, since it matches the way key-sig mode already
     visualizes progress and keeps related keys adjacent. Open to
     overriding per skill if a specific ordering clearly teaches better.

- **Does "quality first, root second" actually match the existing level
  definitions?** For several skills, levels are *already* defined by
  quality/distance (e.g., math mode's distance groups, chord spelling's
  chord types). Within such a level, only the inner axis matters. But
  for skills like fretboard where a level spans many strings/frets, the
  outer axis question doesn't arise — so this question mostly resolves
  by inspecting each mode's level definition.
