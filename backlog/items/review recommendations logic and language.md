---
id: 40
date: 2026-04-08
type: 🛠️ feature
epic: "[[pre-launch polish]]"
status: open
priority: ❗❗❗
tags:
  - learning-model
---

# Review recommendations logic and language

Inventory current recommendation behavior. Known issues:
- "Almost there" shows on home screen, not skill screen
- No progress recs for single-level skills
- "Review in 1d" should imply not recommended today
- Consolidate-first logic unclear when no other levels started

(From practice card review, not handled yet.)
### Recommendation cards
 Verb + scope pattern ("start A string — 5 new
  items"). It's ok, but a bit confusing at first. e.g. "Start Seconds (m2, M2) — 48 new items". On first load, I may have no idea what Seconds are, certainly don't know what the set of levels is, whether this is the first one, what the others will be, etc. 
	- ⚡️ Let's remove the "48 new items". It's not clearly helpful. If people want, we can bring it back using the custom setup pattern (in the practice button)
	- 🔍 Perhaps "Start first level: {level long label}". Inventory: [[recommendation-strings]]. 