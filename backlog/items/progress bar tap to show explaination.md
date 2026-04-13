---
id: 26
date: 2026-03-25
type: "🛠️ feature"
epic: "[[pre-launch polish]]"
status: open
priority: "❗"
tags: []
td-id: td-0ff5e4
---
# Tapping progress bars on skill tabs should show an explanation modal
When user taps a group's progress bar, show a popover/card with:

1. Let's start with the table shown on speed check complete screen, defining the different status and colors. 
	1. modal. tap outside to dismiss.
		1. will need to add to design system
	2. Probably needs a line of context before the table itself. Propose something.

## Draft 1
![[Pasted image 20260411075436.png]]

To fix:
1. title: should say something about progress. 
	1. Go with "Progress"
2. copy: "how quickly you recall" isn't quite right
3. table headers: 
	1. "level" is already used for levels within a skill. 
	2. "meaning" is ok, could be better
4. Copy and perhaps title can / should adjust based on which bar you tapped: level or skill, single-level skill or multi-level. (whether it's )

So:
## Multi-level progress bars
**Progress**
The bar shows a segment for each level in this skill, showing how quickly you answer.

|       | Status    | Meaning |
| ----- | --------- | ------- |
| green | Automatic | etc     |
|       | ...       |         |

## Single-level progress bars
(Level cards in multi-level skills, overall progress for single-level skills).

**Progress**
The bar shows a segment for each item, showing how quickly you answer.

(Same table)

## Draft 2
![[Pasted image 20260411205409.png]]

1. let's wire in the actual thresholds, as in the speed check complete screen:
	1. "Max time"
2. Add a note below: "Response time baseline: 0.9s", or "1s (_default_)" if we're using the default. 
3. Update Speed Check Complete table to match:
	1. s/Level/Status/
	2. Move the measured time into a "Response time baseline: ..." line below the table.
4. Hopefully that means we can use the same table + note component in both places.