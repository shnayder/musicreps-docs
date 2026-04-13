# Within-Level Working Sets — Execution Plan

Spec: [[within-level item selection learning vs review sets]] (#76)
Inventory: [[item-selection]]

## Overview

Replace the current "single weighted pool over all enabled items" selection
with a three-bucket model inside each level:

- **active_learning** — up to 5 items that are not yet fast
- **review** — up to 10 items that were fast and have decayed
- **fast_and_fresh** — everything else, fallback only

Bucket membership is recomputed from live stats on every call to
`selectNext`. A 70/30 biased coin flip picks a preferred bucket; selection
falls through to the first non-empty bucket. Within a bucket, the existing
weighted-random draw is unchanged (unseen boost, slower/staler heavier).

Bucket caps are filled by walking the level's **fixed item order**, so
earlier items consolidate before later items are exposed.

**Success criteria:** in a level with 40+ items, the user sees at most
5 unfamiliar items in play at any time; as items reach Automatic they
drop out of heavy rotation, and later items surface in their place.

## Guiding decisions (already resolved in spec)

- No new user-facing knobs. Reuse existing `speedScore ≥ 0.9` (Automatic)
  and `freshness ≥ 0.5` (`freshnessThreshold`) constants.
- Named implementation constants: `N_ACTIVE = 5`, `M_REVIEW = 10`,
  `ACTIVE_BUCKET_BIAS = 0.7`.
- No persisted bucket state. No promotion events. Buckets are a pure
  function of `ItemStats`.
- Fixed order per level is data, authored in each mode's `logic.ts`.
  Initial orderings may be rough — table exists in the spec but tuning
  is a follow-up.

## Phase 1: Fixed-order infrastructure

Goal: every mode's `getItemIdsForGroup` / `allItems` returns items in a
deterministic, pedagogically-meaningful fixed order. `getEnabledItems()`
from `useGroupScope` (and its equivalents in non-group modes) inherits
that order by concatenating enabled groups' item lists in group order.

No new API — the existing `getItemIdsForGroup` / `allItems` contract is
tightened from "some order" to "fixed order, authored."

- [ ] Review each mode's `getItemIdsForGroup` / `allItems` construction
      and adjust so the emitted order matches the spec's per-skill
      table (or any deterministic order for now — tuning can come
      later).
- [ ] Fretboard: audit `getGroups(instrument)`'s per-group item
      construction to ensure `(fret ascending, string low→high)`.
- [ ] Tests: for each mode, assert `getItemIdsForGroup(g)` returns the
      same items it did before (same set, same length) and is
      deterministic across calls. Order specifics get their own
      targeted test where we care.

Rationale: keep this phase mechanical. No API change, no behavior
change yet — we're just committing to "this list is ordered" as part
of the contract so Phase 3 can rely on it.

## Phase 2: Bucket logic in `adaptive.ts`

Goal: add a pure `computeBuckets()` function and expose it through the
selector, without changing default selection behavior yet.

- [ ] Add constants near `DEFAULT_CONFIG`:
      ```ts
      export const N_ACTIVE = 5;
      export const M_REVIEW = 10;
      export const ACTIVE_BUCKET_BIAS = 0.7;
      ```
- [ ] Add predicates (pure, take the per-item metric functions as args
      so they stay testable without a full selector):
      ```ts
      needsActiveLearning(speedScore: number | null): boolean
      needsReview(speedScore: number | null, freshness: number | null): boolean
      ```
      `needsActiveLearning`: `speed == null || speed < 0.9`.
      `needsReview`: `speed != null && speed >= 0.9 && (freshness ?? 1) < 0.5`.
      Mutually exclusive by construction.
- [ ] Add:
      ```ts
      export function computeBuckets(
        orderedItems: string[],
        getSpeed: (id: string) => number | null,
        getFreshness: (id: string) => number | null,
        excludeId: string | null,
      ): { active: string[]; review: string[]; fastFresh: string[] }
      ```
      Walks `orderedItems` once, skipping `excludeId`. Each item is
      classified by its predicates and placed in the matching bucket if
      that bucket has space; once a bucket is full, subsequent items
      that would belong to it are **omitted** from all three buckets
      (they're not eligible for this trial). `fastFresh` contains only
      items that genuinely satisfy `!needsActiveLearning && !needsReview`
      — overflow from other categories never lands there.

      This is safe because buckets are recomputed every trial. An
      active-overflow item simply waits until a cap slot frees up on a
      future trial (because an active item graduated). Nothing is lost, nothing is mislabeled.
- [ ] Tests for `computeBuckets`:
  - all unseen → first 5 in `active`; items 6..N omitted entirely
  - mixed speeds → correct partition; no item ever appears in more
    than one bucket
  - `excludeId` is never placed in any bucket
  - caps respected; order within `active` / `review` mirrors input order
  - stale but not-yet-fast items go to `active`, not `review`
  - `fastFresh` contains only items that are actually fast and fresh —
    never overflow from another category

## Phase 3: Bucket-aware `selectNext`

Goal: actually change selection behavior. This is the load-bearing
commit.

- [ ] Change `selectNext` signature to take the ordered item list:
      ```ts
      selectNext(orderedItems: string[]): string
      ```
      (The caller already passes an array; we're tightening the
      contract that it must be ordered.)
- [ ] Inside `selectNext`:
  1. Read `lastSelected`.
  2. `computeBuckets(orderedItems, getSpeedScore, getFreshness, lastSelected)`.
  3. Biased coin flip: `const preferActive = randomFn() < ACTIVE_BUCKET_BIAS`.
  4. Pick the first non-empty bucket in the preferred order:
     - preferActive: `active → review → fastFresh`
     - else: `review → active → fastFresh`
  5. Within the chosen bucket, reuse the existing weighted draw:
     build a weight array via `computeWeight(stats, cfg)` and call
     `selectWeighted(items, weights, randomFn())`. Reuse, don't
     duplicate.
  6. Set `lastSelected`, return.
- [ ] Update the single-item short-circuit: if `orderedItems.length ===
      1`, return it (no bucketing needed).
- [ ] Remove the old "last-selected → weight 0" path — it's now handled
      by `excludeId` in `computeBuckets`, and the selected bucket never
      contains the excluded item.
- [ ] Tests:
  - 50-item pool with all unseen → only items 1–5 ever drawn until
    some cross Automatic.
  - As items graduate, items 6, 7, … appear.
  - When active empty and review populated → 100% draws from review
    regardless of coin flip.
  - When both empty → draws from `fastFresh`.
  - Exclude-last-selected: same item never drawn twice in a row.
  - Deterministic RNG → deterministic picks.

## Phase 4: Verify wiring end-to-end

Phase 1 already makes `getEnabledItems()` return an ordered array, so
this phase is just confirming nothing in the engine path reorders or
de-duplicates it before `selectNext`.

- [ ] `hooks/use-engine-actions.ts` (`selectNext` call site at line
      ~130): confirm the array passed in preserves the ordered
      contract — no `Set` round-trips, no filtering that drops order.
- [ ] For fretboard / chord-shapes / speed-tap: audit each mode's
      `engineConfig.getValidItems` (or equivalent) for the same.
- [ ] Integration test: spin up a selector with a mocked storage,
      feed fretboard's ordered items, and assert the first 5 picks
      span only the first 5–6 items (allowing for one cycle).

## Phase 5: Verification & tuning

- [ ] `deno task ok` green.
- [ ] `deno task iterate capture` on a level with many items (e.g.,
      Semitone Math `dist-1-2`) — visually confirm that the stats grid
      lights up a small cluster first, not everything at once.
- [ ] Eyeball a 60-second round in a fresh-state level: should see ≤ 5
      distinct items, with heavy repetition, until some graduate.
- [ ] Eyeball a stale level (artificially age some items): should see
      draws from review bucket, not active.
- [ ] Update [[item-selection]] inventory to describe the new behavior.
- [ ] Update `guides/architecture.md` pointer if needed.

## Deferred (follow-ups, not blocking)

- **Tuning fixed orders.** Initial orderings can be anything
  deterministic; the spec's per-skill table is a target, not a
  prerequisite. Tuning is its own ticket.
- **Savings-effect special handling for re-lapsed items.** Current
  plan: re-lapsed items re-enter `active` at their original fixed-order
  position, which naturally displaces later unseen items once the cap
  is hit. No extra logic.
- **Per-skill telemetry.** If it turns out a level with 40+ items
  thrashes or feels slow, we may want a per-round histogram of which
  items got drawn. Add only if we see problems.
- **Expose `ACTIVE_BUCKET_BIAS`, caps as knobs.** Not planned. Named
  constants only.

## Risks

- **Backwards-incompatible change to `selectNext` contract** (unordered
  set → ordered array). Mostly already satisfied by the current call
  sites, which pass arrays derived from mode `allItems`. Audit in
  Phase 4.
- **First-launch empty state.** With zero stats, every enabled item is
  `needsActiveLearning`. The cap ensures the user only sees the first 5.
  Recommendation system still works — it operates at the level layer,
  not per-item.
- **Fretboard ordering**: fretboard's `FRET_GROUPS` defines levels, so
  within a level there may still be many items. The `(fret, string)`
  fixed order puts the easiest-to-find notes (open strings) first,
  which is the right pedagogical default but may feel odd if the user
  is specifically drilling high frets. Acceptable — they can toggle
  groups.
- **Chord-spelling sequential answers**: each "answer" is a 3–4 note
  sequence. Selection is unchanged at the item level; bucket logic
  doesn't care whether the answer is single or sequential. Confirm in
  Phase 4 that nothing implicitly depended on the old selection order.
