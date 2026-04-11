---
date: 2026-04-10
---
# Recommendation System

How the recommendation system works and why.

## Design principles

- **One mental model** — recommendations use the same metrics the user sees in
  the heatmap. No hidden axes, no divergent thresholds.
- **Guide, don't gate** — nothing is locked. Users can always practice any
  level. Recommendations are suggestions, not restrictions.
- **Consolidate before expanding** — master what you've started before the system
  suggests new material. This prevents accumulating half-learned levels.

## Overview

We track **speed** and **freshness** for each item. These roll up to P10 speed
and P10 freshness per level. The recommendation algorithm looks across levels
within a skill: which need review (stale), which need more practice (slow),
which are ready for the user to move on. On the home screen, per-skill
recommendations roll up further to guide which skill to open.

## Item metrics

**Speed** — how fast you answer. EWMA (exponential moving average) of response
times, normalized to a 0–1 score. Calibrated to the user's motor baseline so
physical response time doesn't penalize the score.

**Freshness** — how much of your practiced speed you've retained since last
session. Decays over time: `freshness = 2^(-elapsed / stability)`. Just
practiced → ~1.0. Haven't practiced in a while → decays toward 0. Stability
(the half-life, in hours) grows with spaced repetition — more sessions → slower
decay → less frequent practice needed.

The heatmap combines these visually (speed × freshness → color), but the
recommendation system treats them as **independent axes**: speed drives level
classification, freshness drives review detection.

## Level rollup

Each level's status is the **P10** (10th percentile) of its items' values, with
unseen items contributing 0. This is deliberately strict — a few unseen or weak
items hold the whole level back.

P10 speed and P10 freshness are computed separately.

## Level classification

Based on P10 speed. Defined in `speed-levels.ts` (single source of truth for
labels, color tokens, and thresholds):

| P10 speed | Key        | Label     | Meaning                              |
|-----------|------------|-----------|--------------------------------------|
| ≥ 0.9    | automatic  | Automatic | Fully memorized — instant recall      |
| ≥ 0.7    | solid      | Solid     | Solid recall, minor hesitation        |
| ≥ 0.3    | learning   | Learning  | Working on it — needs practice        |
| > 0      | hesitant   | Hesitant  | Significant hesitation                |
| 0        | starting   | Starting  | Not yet learned                       |

**Review timing**: only computed for Solid+ levels. Below-Solid levels just
need practice — showing a review pill would be confusing. Review timing uses
avg stability and avg freshness (not P10): `computeReviewTiming()` in
`recommendations.ts`.

Speed labels are shown on level progress cards via status swatch + label.

## Recommendation algorithm

The algorithm decides which levels to recommend, in priority order:

1. **Review** — Solid+ levels where review timing is "soon" (avg freshness
   below threshold or ≤ 24h remaining). Below-Solid levels don't get review
   recs — they just need practice.

2. **Practice** — any level not yet Solid (Starting, Hesitant, or Learning).
   Slow levels always need practice regardless of freshness.

3. **Expand** — suggest the next unstarted level. The expansion gate must be
   open (see below). Placed after review + practice, before automate.
   - When ≥ 3 levels are Solid-but-not-Automatic, expansion is **throttled**:
     placed after automate instead, to prioritize solidifying existing levels.

4. **Automate** — Solid levels with no stability data yet. Once a Solid level
   has stability data and is scheduled for later review, no rec is needed.
   (Solid + "soon" → gets review rec instead.)

### Expansion gate

The gate opens when **all** started levels meet both conditions:
- P10 speed ≥ 0.7 (at least Solid)
- Review timing is not "soon"

This enforces consolidate-before-expanding. You can't progress until existing
levels are solid and fresh. Unseen items within started levels contribute 0 to
P10, so you need to cover a level before the gate considers it done.

### Budget

Recommendations respect a `maxWorkItems` budget (default 30). Levels are added
in priority order until the budget is exhausted.

## Cross-skill recommendations (home screen)

For each starred skill, the same pipeline runs and classifies the skill by its
highest-priority rec type. Skills are then ranked across the starred set:

Three user-facing verbs: **Review**, **Practice**, **Start**.

| Priority | Type     | Cue label        | Meaning                        |
|----------|----------|------------------|--------------------------------|
| 1        | review   | Review           | Has stale Solid+ levels        |
| 2        | practice | Practice         | Has levels needing practice    |
| 3        | start    | Start            | Ready to expand                |

Top 3 are surfaced. Within a tier, higher urgency (more affected levels) wins.

Cold start: when all starred skills are unstarted, the first in definition order
is recommended with "Ready to start."

## Review timing (progress tab pills)

Unified with the recommendation pipeline via `computeReviewTiming()` in
`recommendations.ts`. Level progress cards read their pill from
`recommendation.levelStatuses` instead of computing independently.

Only shown for Solid+ levels (below-Solid levels just need practice).

- **Review soon** — avg freshness already below threshold, or ≤ 24h remaining.
- **Review in Xd / Xw / Xmo** — estimated time until the level needs review.
- No pill if stability data is missing (unseen items or legacy stats).
