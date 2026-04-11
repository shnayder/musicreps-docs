---
id: 65
date: 2026-04-09
type: 🐞 bug
epic: "[[pre-launch polish]]"
status: open
priority: ❗❗
tags:
  - algorithm
  - imported
---

# Too much progress awarded for one question answered

Too much progress is being awarded for answering a single question.

![[Pasted image 20260408230551.png|200]]

Oh, I just figured it out I think. Maybe it's more of a design issue than a bug. The progress bar has one segment per level, and looks like it shows average speed across items that have data. So if I have 6 levels, with two levels started at all, the bar will be 1/3 full, even if the per-level bars are almost entirely empty at first.

Options:
1. Leave it. Once you actually practice all or most of the items in a level, it makes sense. New user confusion though.
2. Make the overall progress segment length proportional to the fraction of started items. So if only 1/30 items for level 1 has been started, the level 1 segment is only 1/30th of its "full" length. (Note that this is not making each segment proportional to number of items -- if some levels have more items than others, their "full-length" segments should still be equal length).
3. Other ideas?
