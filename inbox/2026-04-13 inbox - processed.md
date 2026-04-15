---
date: 2026-04-14
type: plan
status: done
source: "[[2026-04-13 inbox]]"
---

# Processing plan for 2026-04-13 inbox

## New items to create

| #   | Proposed title                                                              | Type        | Priority | Tags               | Epic                  | Decision                                                                      |
| --- | --------------------------------------------------------------------------- | ----------- | -------- | ------------------ | --------------------- | ----------------------------------------------------------------------------- |
| 1   | Suggest switching levels on round complete screen                           | 🛠️ feature | ❗        | ux                 |                       |                                                                               |
| 2   | Verify portrait/landscape orientation on tablet                             | 🐞 bug      | ❗        | mobile             | [[pre-launch polish]] | not a bug, just a task. call it a feature I guess                             |
| 3   | Review bucket not working: still seeing same 5 items                        | 🐞 bug      | ❗❗       | algorithm          |                       | skip -- already fixed                                                         |
| 4   | Bump active learning limit from 5 to 7                                      | 🛠️ feature | ❗        | algorithm          |                       | skip -- already done                                                          |
| 5   | Move Review pill above status on progress cards                             | 🐞 bug      | ❗        | design             | [[pre-launch polish]] |                                                                               |
| 6   | Add ukulele speed tap mode                                                  | 🛠️ feature | ❗        | content            |                       |                                                                               |
| 7   | Diatonic chords: don't drill I chord (identity)                             | 🐞 bug      | ❗        | content            |                       | merge all the diatonic chords items into one "review diatonic chords" feature |
| 8   | Random-but-fixed item ordering to avoid WM prefilling                       | 🛠️ feature | ❗        | algorithm          |                       |                                                                               |
| 9   | Diatonic chords: maj row shows E not started but bar 100% full              | 🐞 bug      | ❗❗       | algorithm, content |                       | this was ukulele. skip -- included below                                      |
| 10  | Diatonic chords: missing E maj and several minor chords (need all 12)       | 🐞 bug      | ❗❗       | content            |                       | this is also ukulele. skip, included below.                                   |
| 11  | Progress display: handle missing table cells (X marker or non-table)        | 🐞 bug      | ❗        | design             |                       |                                                                               |
| 12  | Review chord coverage for uke and guitar                                    | 🛠️ feature | ❗        | content            |                       |                                                                               |
| 13  | Rollback drill: test allowDowngrade flag on gh-pages                        | 🛠️ feature | ❗❗       | tooling, releases  |                       |                                                                               |
| 14  | Pick sharps or flats at random each round (fretboard memorization)          | 🛠️ feature | ❗        | algorithm          |                       | include note: display-only change. Doesn't change the items themselves.       |
| 15  | Show splash screen on app open                                              | 🛠️ feature | ❗        | ux, mobile         |                       | add to pre-launch polish                                                      |
| 16  | Notes-semitones: "review" on skills tab but "all automatic" on skill screen | 🐞 bug      | ❗❗       | algorithm          |                       |                                                                               |
| 17  | Summary screen vertical spacing too tight, inconsistent with rest of app    | 🐞 bug      | ❗        | design             | [[pre-launch polish]] |                                                                               |

## Ideas

| #   | Proposed title                                                      | Tags              | Decision                                                |
| --- | ------------------------------------------------------------------- | ----------------- | ------------------------------------------------------- |
| 1   | Make app clips                                                      | mobile, marketing | ⚡️ user said "make app clips" — flag as idea            |
| 2   | Social sharing for progress                                         | ux, marketing     | ⚡️ user said "to idea list"                             |
| 3   | Diatonic chords: is chord root enough? what is this skill training? | content, design   | skip -- included in diatonic chord review feature above |

## Skipped

| Item | Reason |
|------|--------|
| "levels practiced switched mid-round" | User noted "Already fixed" |
| "phone done" (orientation) | Already done; tablet check broken out as item #2 |
| Reference: discussion in claude code web session (chord skill design) | Pure reference, captured in idea #3 |

## Summary

- **17** new items
- **3** ideas
- **3** skipped
- Next ID will start at **84**

## Notes

- The diatonic chords cluster (#7–12) all feed into the same skill — could
  consolidate into one tracking item if you'd rather, but I split them since
  they're distinct fixes.
- Items #3 and #4 are both about the same friction with #76's design but
  distinct: #3 is "the bucket isn't doing what we wanted" (bug) and #4 is
  "even working correctly, 5 might be the wrong cap" (tuning). Could merge.
