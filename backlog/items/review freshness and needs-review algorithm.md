---
id: 96
date: 2026-04-17
type: "🛠️ feature"
epic:
status: open
priority: "❗❗❗"
tags:
  - algorithm
---

# Review freshness / needs-review algorithm

Current behavior inventory: [[speed-and-freshness]]

## Issues to investigate

- **4-hour initial stability — why?** Why not 1 minute, or 10 minutes? With
  60-second rounds and a 5–7 item active set, I answer once slowly, then
  several times fairly quickly since it's in working memory. I'd expect the
  item to stay in "needs review" for a while after that and keep popping up
  if I do another round a minute or 5 later. Does it?

- **Observed behavior is confusing.** The system seems to drill the same
  items over and over, then leave them unreviewed for days. E.g. a
  not-quite-fast fretboard L1 has been sitting there for days with the
  system suggesting L2, L3 instead. (Related: #83)

- **Median vs EWMA.** See #82 — need to evaluate whether EWMA is the right
  speed metric. Standard cog-sci approach is median RT.

- **How do SuperMemo / Anki handle this?** And should the model differ for
  automatization (speed) vs memorization (recall)?

- **Diagnostic tooling.** May need to pull out and update the item
  diagnostic tools to make sense of what's happening.

- **Visibility.** Can't see freshness clearly in the UI, and stability not
  at all. Add visibility — either as a debug tool or an actual user feature.
  (Related: idea "show freshness info to user")
