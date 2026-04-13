---
date: 2026-04-13
---
# Item Selection (within a level)

How the app picks the next item to show within a level/group. This is
distinct from the [recommendation system](../recommendation-system.md),
which decides which *level* to practice. Once the user is practicing a
level, the logic here chooses among its enabled items trial-by-trial.

## Behavior

### What's in play on a given trial

Not every enabled item is a candidate on every trial. Items are
partitioned into three **working-set buckets** each trial, and the next
item is drawn from exactly one of them:

- **Active learning** — up to 5 items that aren't yet fast. The things
  you're still learning.
- **Review** — up to 10 items that were fast but have gone stale. The
  things you learned and need to refresh.
- **Fast-and-fresh** — everything else. Fallback only.

Bucket membership is recomputed from live item stats on every call to
`selectNext`. There is no persisted bucket state and no promotion
event — an item's category is just `(speed, freshness) →` bucket, every
trial.

### Fixed per-level item order

Each level has a **fixed order** over its items (authored in the mode's
`logic.ts`). The order is pedagogical: fretboard walks fret-by-fret
across the instrument; root-based skills cycle roots in the circle of
fifths; bidirectional modes do forward then reverse.

The fixed order controls *which* qualifying items fill the bucket
caps when more than 5 / 10 items qualify. Walk the level in order,
take the first 5 items that need active learning, take the first 10
that need review. Anything past those caps is omitted from this
trial's pool entirely (it will reappear on a future trial as slots
free up).

Within a chosen bucket, the existing weighted-random draw decides the
actual pick — the fixed order is not the draw order.

### How the next item is chosen

1. Recompute the three buckets from live stats (excluding the
   last-selected item).
2. Biased 70/30 coin flip decides which bucket is *preferred*:
   - 70% of the time: prefer active → review → fastFresh.
   - 30% of the time: prefer review → active → fastFresh.
3. Pick the first non-empty bucket in the preferred order.
4. Within that bucket, draw an item with the existing weights: unseen
   items get an exploration boost, slower items get more weight,
   staler items get more weight.
5. Store the picked item as `lastSelected` so it's excluded next
   trial.

If active and review are both empty, selection falls through to
fast-and-fresh — "you've got this level" — and the recommendation
system should be suggesting a different level next round.

### Bucket predicates

- **Active learning**: `speedScore == null || speedScore < 0.9`. Any
  unseen item or any seen item below the Automatic threshold.
- **Review**: `speedScore ≥ 0.9 AND freshness < freshnessThreshold`
  (0.5 by default, shared with the recommendation system). A fast
  item with no freshness data (e.g., a fast item whose stability is
  null for legacy reasons) is treated as fresh, not stale.
- **Fast-and-fresh**: everything else — fast *and* fresh.

Predicates are mutually exclusive: an item that needs active learning
is never in review; an item that needs review is never fast-and-
fresh. Overflow items (category full) are omitted from all three
buckets.

### No-repeat guarantee

The last-selected item is excluded from bucket population, so it
never appears twice in a row even if its weight would be very high.

### What is *not* considered

- **Consecutive-fast promotion.** There is no "graduating" event.
  An item crossing the Automatic line simply stops appearing in
  the active bucket on the next trial.
- **Bucket state between trials.** Buckets are recomputed every
  trial from the current `ItemStats`. Nothing about bucket
  membership is persisted.
- **Hysteresis.** An item that oscillates around the Automatic line
  may flip between active and review across trials; the only
  consequence is which pool it's drawn from, there's no thrashing
  cost.

### Calibration interaction

Timing thresholds (what counts as "fast," what counts as "slow")
scale linearly with the user's motor baseline. Modes that require
multiple physical responses per question (e.g. chord spelling, speed
tap) scale those thresholds proportionally to the expected response
count so that a multi-tap item's speed is comparable to a single-tap
item's speed.

### Correctness

Wrong answers do not change an item's EWMA (speed estimate is only
updated on correct responses), but they reduce its stability, which
can push the item out of the fast-and-fresh pool via the recall /
freshness signal.

## Implementation notes

Living source of truth: `src/adaptive.ts`.

### Constants

```ts
export const N_ACTIVE = 5;
export const M_REVIEW = 10;
export const ACTIVE_BUCKET_BIAS = 0.7;
```

### Predicates

`needsActiveLearning(speedScore)` and
`needsReview(speedScore, freshness, freshnessThreshold)` are pure
exported functions. The freshness threshold defaults to
`DEFAULT_CONFIG.freshnessThreshold` (0.5) but is threaded through
from the selector's live `cfg` so tuning via `updateConfig()` stays
consistent with `checkItemsNeedReview`.

### `computeBuckets`

```ts
export function computeBuckets(
  orderedItems: string[],
  getSpeed: (id: string) => number | null,
  getFreshness: (id: string) => number | null,
  excludeId: string | null,
  freshnessThreshold?: number,
): WorkingBuckets
```

Walks `orderedItems` once. Each item is classified and placed into
the matching bucket if that bucket has space; overflow items are
omitted entirely (safe because buckets recompute every trial).
`excludeId` (typically `lastSelected`) is skipped.

### `pickFromBuckets`

```ts
export function pickFromBuckets(
  buckets: WorkingBuckets,
  getWeight: (id: string) => number,
  coin: number,
  rand: number,
): string | null
```

Handles the 70/30 coin flip and the first-non-empty-bucket fall
through, then delegates to the existing `selectWeighted(items,
weights, rand)` for the intra-bucket draw.

### `selectNext`

`createAdaptiveSelector(...).selectNext(orderedItems)`:

1. Throw on empty; return singleton as-is.
2. `computeBuckets(..., cfg.freshnessThreshold)`.
3. `pickFromBuckets` with two RNG draws (one for the coin, one for
   the weighted draw).
4. Save `lastSelected`, return.

The `pickFromBuckets` result could in principle be null (every item
excluded), but the singleton short-circuit makes that unreachable;
a defensive `?? lastSelected ?? orderedItems[0]` fallback remains
in case the bucket logic ever changes.

### Weight calculation (unchanged within a bucket)

`computeWeight(stats, cfg)`:

- Unseen item → `cfg.unseenBoost` (default 3).
- Seen item → `max(ewma, minTime) / minTime` (slower = heavier),
  multiplied by a `recallWeight` of `1 + (1 - recall)` when
  stability data exists. recallWeight ranges 1.0 (fully fresh) to
  2.0 (fully decayed).

### Per-item state

`ItemStats` (persisted per item via `StorageAdapter`):

- `recentTimes: number[]` — ring buffer of last `maxStoredTimes`
  (default 10) response times, clamped to `maxResponseTime`
  (default 9000 ms).
- `ewma: number` — exponential moving average of response time,
  `alpha = 0.3`.
- `sampleCount: number`
- `lastSeen: number` — ms since epoch.
- `stability: number | null` — spaced-repetition half-life in hours.
- `lastCorrectAt: number | null`.

### Config knobs (`DEFAULT_CONFIG` in `adaptive.ts`)

- `minTime` = 1000 ms (baseline-scaled)
- `unseenBoost` = 3
- `ewmaAlpha` = 0.3
- `maxResponseTime` = 9000 ms (baseline-scaled)
- `initialStability` = 4 h
- `maxStability` = 336 h (14 days)
- `stabilityGrowthMax` = 0.9
- `stabilityDecayOnWrong` = 0.3
- `freshnessThreshold` = 0.5 (shared: review detection at the level
  layer *and* bucket classification at the item layer)
- `selfCorrectionThreshold` = 1500 ms
- `speedTarget` = 3000 ms

### Correct / wrong bookkeeping

- `recordCorrectResponse(...)` — updates `recentTimes`, `ewma`,
  `sampleCount`, `lastSeen`, and advances `stability` via
  `updateStability()` (freshness-modulated growth, with a self-
  correction floor when a fast answer arrives after a long gap).
- `recordWrongResponse(...)` — increments `sampleCount` /
  `lastSeen` and decays `stability` via
  `computeStabilityAfterWrong()` (multiplier floored at
  `initialStability`). EWMA is untouched on wrong answers.

### Fixed per-level order — authorship

The order is baked into each mode's item-construction code:

- **Fretboard (guitar/uke)**: `getItemIdsForFretRange` in
  `quiz-fretboard-state.ts` — fret ascending (outer), string
  index descending / low-pitched→high-pitched (inner).
- **Semitone Math / Interval Math**: distance-within-group
  ascending → direction (+ then −) → `ROOT_CYCLE` roots.
- **Note ↔ / Interval ↔ Semitones**: direction (fwd first) →
  inner cycle (`ROOT_CYCLE` for notes, semitone-ascending for
  intervals).
- **Scale Degrees / Diatonic Chords**: degree/numeral ascending →
  direction → `MAJOR_KEYS` (already circle-of-fifths).
- **Key Signatures**: direction → group's existing accidental-count
  order.
- **Chord Spelling**: chord type outer → local `CHORD_ROOT_CYCLE`
  inner (uses flat spellings to match `CHORD_ROOTS`).
- **Chord Shapes (guitar/uke)**: quality outer → local
  `CHORD_SHAPE_ROOT_ORDER` inner.
- **Speed Tap**: natural and accidental groups each return their
  own circle-of-fifths list.

`ROOT_CYCLE` is exported from `src/music-data.ts` and used by the
modes that speak in sharp-based note names.

### Storage

`createStorageAdapter(namespace)` wraps the `storage` abstraction
(localStorage on web, Capacitor Preferences on native). Each mode
gets its own namespace so stats don't collide. `createMemoryStorage()`
is the test double.

### Where selection is invoked

`hooks/use-engine-actions.ts` calls
`selector.selectNext(configRef.current.getEnabledItems())` when the
engine needs the next question. `useGroupScope.enabledItems`
concatenates each enabled group's ordered item list in `allGroupIds`
definition order, so the array reaching `selectNext` preserves the
mode's fixed order end-to-end.
