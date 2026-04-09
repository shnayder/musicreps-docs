---
date: 2026-04-08
type: plan
status: done
source: "[[2026-04-06 user feedback]]"
---

# Import: 2026-04-06 user feedback

Processing file for [[2026-04-06 user feedback]]. Each item gets a fate.

## Decisions already made (⚡️ in source)

These just need to be turned into backlog items or applied directly.

| #   | item                                                                     | type | tags   | decision            | notes                             |
| --- | ------------------------------------------------------------------------ | ---- | ------ | ------------------- | --------------------------------- |
| A1  | Instrument skills first, theory second in skill ordering                 | 🛠️  | launch | **create**          | ⚡️ decided                        |
| A2  | Stats banner "3 today" — tappable, overlay with details                  | 🛠️  |        | **create**          |                                   |
| A3  | "All skills" hint text should be actionable ("Pick what to automate")    | 🛠️  | launch | **create**          | ⚡️ fix                            |
| A4  | Nav: tapping skill card always loads practice tab (predictable nav)      | 🛠️  | launch | **create**          | also a design principle to record |
| A5  | Add small text labels below nav icons (practice/progress/info)           | 🛠️  | launch | **create**          | "i" reads as "help" not "about"   |
| A6  | "Run speed check" button needs bottom margin on small screens            | 🐞   | launch | **create**          | ⚡️ do it                          |
| A7  | Skill opens on progress tab if last-opened — fix to always open practice | 🐞   | launch | include in A4 scope |                                   |

## Needs investigation (🔍 in source)

These need a closer look before becoming concrete items.

| # | item | type | tags | decision | notes |
|---|------|------|------|----------|-------|
| B1 | Review progress pages: header, section titles, explanation text | 🛠️ | design | **create** | "Item details" — what items? |
| B2 | Review practice tab IA: what is this for, what do I do next? | 🛠️ | design | **create** | combine with header, "Keep practicing", "+- 1-2 semitones" wording |
| B3 | Review recommendations logic and language — inventory current behavior | 🛠️ | learning-model | **create** | 🔥 "Almost there" on wrong screen, single-level skill recs |
| B4 | Review input/output sizing architecture | 🛠️ | design | **create** | close but still special-casing for fretboard — why? |

## To backlog (🔜 in source)

| #   | item                                                       | type | tags               | decision   | notes                                                                    |
| --- | ---------------------------------------------------------- | ---- | ------------------ | ---------- | ------------------------------------------------------------------------ |
| C1  | Musical Modes skill                                        | 🛠️  | music, post-launch | **create** | chatgpt spec link in source                                              |
| C2  | Reference page for every skill — what are the answers?     | 🛠️  |                    | **create** | overlaps "Review tab" epic. Merge? No -- separate, more specific feature |
| C3  | Speed check per input type (3x4 vs 6x2, accidentals, etc.) | 🛠️  | learning-model     | **create** | RT depends on context and button layout                                  |
| C4  | iPad fretboard max size — cap growth, buttons too small    | 🐞   | mobile             | **create** |                                                                          |

## Someday / deferred

| # | item | decision | notes |
|---|------|----------|-------|
| D1 | Solfège ↔ ABC mode | **skip** | ⚡️ "not today" 🗄️ |
| D2 | Is G - m2 = Gb or F#? | **skip** | 🧊 look it up sometime, not a backlog item |

## Decisions to record (not backlog items)

These are design principles/conventions, not tasks:

- **Nav predictability**: No difference in where links take you on first vs later uses. Use first-time banners to guide to relevant info. → record in `conventions/` or `guides/design-principles.md`
- **"Tritone" confusion**: Will fix as part of adding reference info (C2)
- **"Who is this for?"**: See how far marketing copy gets us — not a separate item

## Proposed merges

- A4 + A7: both about "skill always opens practice tab" — single item
	- Yes
- B1 + B2: both about "screens need headers and clear IA" — could be one "review screen headers and IA" item
	- yes
- C2 + "Review tab" epic: reference pages are basically the review tab content
	- "review tab" is about me reviewing the practice tab design, not a "review" tab. Keep separate.

---

## Summary

- **Create**: 13 new items (A1–A7, B1–B4, C1–C4, minus merges)
- **Skip**: 2 (D1, D2)
- **Record as convention**: 1 (nav predictability)
- **Merge candidates**: 3 pairs noted above
