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

Based on P10 speed:

| P10 speed | Label     | Meaning                    |
|-----------|-----------|----------------------------|
| ≥ 0.9    | Automatic | Instant retrieval           |
| ≥ 0.7    | Learned   | Fast, not yet instant       |
| ≥ 0.3    | Learning  | Making progress             |
| > 0      | Hesitant  | Just starting               |
| 0        | Starting  | Nothing seen                |

Review flag: P10 freshness < 0.5 → level "needs review."

Note: `statusLabelFromLevel()` maps these to capitalized user-facing labels
(Automatic, Solid, Learning, Hesitant), but these labels aren't currently
displayed in any mode. They exist in `PracticeCard`, which all modes override
with custom practice content. They should probably be surfaced somewhere.

## Recommendation algorithm

The algorithm decides which levels to recommend, in priority order:

1. **Review** — any started level where P10 freshness < 0.5. You were fast once,
   but it's been a while. Time-sensitive: freshness keeps dropping.

2. **Practice** — any started level that is Starting, Hesitant, or Learning
   (P10 speed < 0.7). Active learning in progress.

3. **Expand** — suggest the next unstarted level. The expansion gate must be
   open (see below). Placed after review + practice, before automate.
   - When ≥ 3 levels are Learned-but-not-Automatic, expansion is **throttled**:
     placed after automate instead, to prioritize solidifying existing levels.

4. **Automate** (shown to users as "Keep practicing") — levels that are Learned
   (P10 speed ≥ 0.7) but not yet Automatic (< 0.9). You know these, push for
   instant.

### Expansion gate

The gate opens when **all** started levels meet both conditions:
- P10 speed ≥ 0.7 (at least Learned)
- P10 freshness ≥ 0.5 (not stale)

This enforces consolidate-before-expanding. You can't progress until existing
levels are solid and fresh. Unseen items within started levels contribute 0 to
P10, so you need to cover a level before the gate considers it done.

### Budget

Recommendations respect a `maxWorkItems` budget (default 30). Levels are added
in priority order until the budget is exhausted.

## Cross-skill recommendations (home screen)

For each starred skill, the same pipeline runs and classifies the skill by its
highest-priority rec type. Skills are then ranked across the starred set:

| Priority | Type            | Meaning                        |
|----------|-----------------|--------------------------------|
| 1        | Review          | Has stale levels               |
| 2        | Keep practicing | Has levels in progress         |
| 3        | Learn next      | Ready to expand                |
| 4        | Almost there    | Levels are Learned, push to Automatic |

Top 3 are surfaced. Within a tier, higher urgency (more affected levels) wins.

Cold start: when all starred skills are unstarted, the first in definition order
is recommended with "Get started."

## Review timing (progress tab pills)

Separate from the recommendation pipeline. Each level card on the progress tab
shows a pill estimating when review will be needed, based on average stability
and freshness across the level's items:

- **Review soon** — avg freshness already below threshold, or ≤ 24h remaining.
- **Review in Xd / Xw / Xmo** — estimated time until the level needs review.
- No pill if stability data is missing (unseen items or legacy stats).
