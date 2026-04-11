---
id: 40
date: 2026-04-08
type: 🛠️ feature
epic: "[[pre-launch polish]]"
status: review
priority: ❗❗❗
tags:
  - learning-model
worktree: /Users/shnayder/Dropbox/projects/musicreps-root/musicreps.worktrees/claude-review-recommendations
---

# Review recommendations logic and language

## Problems

### 1. Info that should be surfaced to the user

- **No level status labels shown anywhere.** `statusLabelFromLevel()` produces Automatic/Solid/Learning/Hesitant but PracticeCard (which renders them) is overridden by all modes. Users have no word for how they're doing on a level — just heatmap colors.
- **No progress recs for single-level skills.** Single-level modes get a bare verb ("Review" / "Keep practicing") but no detail — no speed status, no freshness info, no "almost there" encouragement.
- **"Almost there" only on home screen.** The automate rec type maps to "Almost there" on skill cards but inside a skill it's just "Keep practicing" — the encouraging near-finish signal doesn't appear where the user is actually practicing.
- **"Review in Xd" pill doesn't connect to recommendations.** The progress tab pill says "Review in 3d" but the practice tab's suggestion cards don't reference timing. If a level says "Review in 1d," the practice tab might still recommend it today with no indication that waiting is fine.

### 2. Label consistency

- **Different verb vocabularies across surfaces.** Home screen: Review / Keep practicing / Learn next level / Almost there. In-skill multi-group: Review / Practice / Start / Keep practicing. Single-level: Review / Keep practicing / Start practicing / All items mastered. Same rec type, different words.
- **"Practice" vs "Keep practicing"** — in-skill verb for slow levels is "Practice" but the home screen uses "Keep practicing" for the same state. Different implication (starting vs continuing).
- **"Start" vs "Learn next level"** — expand recs say "Start {level}" in-skill but "Learn next level" on home. "Start" is ambiguous (start what? why?). Perhaps "Start first level: {level long label}".
- **Flat text uses internal label "automate"** — `buildRecommendationText` maps automate recs to the literal string "automate" (e.g. "automate Major keys"). Leaks an internal concept.

### 3. Algorithm improvements

- **Consolidate-first logic unclear at the start.** If a user has barely started level 1 but poked around level 2, the algorithm may recommend reviewing level 2 even though level 1 is the real focus. Consolidate-before-expanding should mean: don't suggest reviewing a higher level when a lower level isn't solid yet.
![[Pasted image 20260410103619.png]]![[Pasted image 20260410103608.png]]
- **Level order not prioritized in recs.** Recs pick levels by status without considering natural order. "Review level 1 and 7" when levels 2–4 are equally good candidates. (See [[prioritize level order more in recommendation system]].)
- **"Review in 1d" should suppress active recommendation.** A level showing "Review in 1d" on the progress tab implies it's fine for today, but the rec system may still flag it as a practice target. If the pill says "come back tomorrow," the rec shouldn't say "practice this now."

## Current state

Recommendations surface in four places:

| Where | What shows | Example |
|-------|-----------|---------|
| Home screen skill cards | Single highest-priority rec for the skill: bold verb + level labels | **Review** Frets 0–3, naturals |
| Skill practice tab (multi-group) | One line per rec type in the "Suggested" view, verb + comma-separated levels | Review Frets 0–3, naturals / Practice 1–2 semitones apart |
| Skill practice tab (single-level) | One line: verb only, no level labels | Review / Keep practicing / Start practicing |
| Skill progress tab | Pill on each level card with review timing | Review soon / Review in 3d |

**Home screen verbs**: Review · Keep practicing · Learn next level · Almost there.
**In-skill verbs**: Review · Practice · Start · Keep practicing.
**Single-level verbs**: Review · Keep practicing · Start practicing · All items mastered.

Details in [[recommendation-strings]].

## Direction

Design from level status outward. Same verbs everywhere.

### Per-level recommendation

Each level has a speed status and a freshness state. These combine into one
recommendation verb:

| Speed                      | Fresh | Verb         | Rationale                                                        |
| -------------------------- | ----- | ------------ | ---------------------------------------------------------------- |
| Starting/Hesitant/Learning | any   | **Practice** | Still building speed — stale or fresh, you haven't mastered it   |
| Solid                      | fresh | **Practice** | You know it, push to automatic. Progress bar shows you're close. |
| Solid                      | stale | **Review**   | You had it fast, it's fading                                     |
| Automatic                  | fresh | *(none)*     | You're done for now                                              |
| Automatic                  | stale | **Review**   | Was automatic, needs refreshing                                  |
| Not started, next in line  | —     | **Start**    | Expansion gate is open                                           |

Three verbs: **Review**, **Practice**, **Start**.

- **Review** = you were fast, you've gotten rusty. Only for levels that were
  Solid or Automatic. This is the spaced-repetition signal.
- **Practice** = you're still learning, or you're close but not instant yet.
  Status labels (Learning, Solid) and progress bars show where you are.
- **Start** = new level, expansion gate is open.

### How it surfaces

Same three verbs at every layer:

- **Progress tab level cards**: status label (Learning, Solid, Automatic) +
  progress bar + review pill timing. These carry the detail and encouragement.
- **Practice tab suggestion lines**: "Review {levels}" / "Practice {levels}" /
  "Start {level}". Grouped by verb, same words.
- **Home screen skill card**: highest-priority verb across levels, same words.
  No separate vocabulary ("Almost there", "Learn next level", "Keep practicing"
  all go away).
- **Single-level modes**: same verbs, just no level names.

### Algorithm changes

- Review pill and recommendation agree: if the pill says "Review in 3d", the
  level is fresh → no "Review" rec. They use the same freshness threshold.
- "Review" only applies to levels that were Solid+ before going stale. A level
  that's Learning and stale gets "Practice", not "Review."
- Level order matters: prefer earlier levels when multiple are equally eligible.
  (See [[prioritize level order more in recommendation system]].)

## Related docs

Design specs:
- [[2026-03-04-mastery-and-recommendations-spec]] — the core design: item metrics → group status → consolidate-vs-expand recs. Defines the mental model.
- [[2026-03-13-home-screen-recommendations-spec]] — cross-skill recs on the home screen (starring, ranking, cue labels).
- [[2026-04-08-practice-tab-redesign]] — practice tab layout, where in-skill recs appear.

Inventory:
- [[recommendation-system]] — how the algorithm works and why (principles, metrics, thresholds).
- [[recommendation-strings]] — current user-facing text at each surface.

Related backlog items:
- [[prioritize level order more in recommendation system]] — recs ignore level order, suggest "review level 1 and 7" when 2–4 are equally good.
- [[export progress data and tooling for testing recommendation ]] — tooling for testing rec logic with real data.

Diagnostic tools (in code repo):
- `scripts/recommendation-diagnostic.ts` — runs pre-baked scenarios through the algorithm, captures practice tab screenshots, generates annotatable HTML report. (`deno task diagnostic`)
- `scripts/group-model-diagnostic.ts` — group-level model: given items at various states, what group summary do we get? (`deno task group-model`)
- `scripts/item-model-diagnostic.ts` — item-level adaptive model visualization. (`deno task item-model`)
- `src/fixtures/recommendation-scenarios.ts` — scenario definitions used by the diagnostic.
