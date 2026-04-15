---
id: 83
date: 2026-04-13
type: 🐞 bug
epic:
status: open
priority: ❗❗
tags:
  - algorithm
---

# Recs suggest later levels before earlier ones

Observed: L1 and L2 show "Learning" status, L3 shows "Hesitant", no review
pills. Recommendations suggest levels 2 and 3. Expected to see L1. 

Related to #14 (which was meant to fix level ordering but evidently didn't
cover this case).
