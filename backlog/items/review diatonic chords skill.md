---
id: 88
date: 2026-04-14
type: "🛠️ feature"
epic:
status: open
priority: "❗❗"
tags:
  - content
  - imported
---

# Review diatonic chords skill

Several issues observed with the diatonic chords skill — needs a holistic
review pass.

- [ ] **Don't drill the I chord** — the identity function isn't interesting.
- [ ] **Fixed ordering is awkward** — shouldn't ask `ii` for every chord in
      sequence. Consider random-but-fixed order (see #89).
- [ ] **Missing chords on ukulele**: only 3 minor chords; E maj missing.
      Need all 12.
- [ ] **Maj row in progress table** shows E not started but bar is 100% full
      of started stuff (ukulele) — likely related to the missing E maj item.
- [ ] **Level ordering** — started a user on minor chords before showing E
      maj (because E maj wasn't in the data).
- [ ] **Review chord coverage** for both ukulele and guitar — what chords
      are in there, what's missing, are the levels right?
- [ ] **Open question**: is chord root enough, or what is this skill
      actually trying to train? May need more music theory thinking.
      (See discussion in claude code web session.)
