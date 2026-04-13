---
id: 18
date: 2026-04-01
type: 🛠️ feature
epic: "[[pre-launch polish]]"
status: closed
priority: ❗❗
tags: []
td-id: td-071966
---

# Test on iPhone SE screen size -- fretboard gets squished too much


1. Tooling first -- add a url param to simulate "native" mode in the browser — disable the keyboard entry textbox and hint.
2. Then let's see what it looks like -- I think we'll want to shrink the answer buttons and perhaps extra space in the header and footer

## Review notes from first fix
- it's much better on tiny screens, but now too tight on e.g. an iphone 17 pro
- not enough space in the footer for the button -- too close to the bottom
- response buttons are lower too -- not as comfortable to tap

## Related
- [[ipad fretboard max size cap]]
- Inventory of current behavior: [[layout-practice-screens]].

## Issues to fix
Let's try to clean up all fretboard-related sizing issues together:
1. On large screens, it gets too big visually. (even if there is space, it just doesn't need to be so big)
2. On mid-size screens, it pushes the buttons out too far down
3. On small screens, it's ok, though Next button could come back up a bit

## Fixes
- for large screens (ipad, web): lower max-height
- for large phone screens
	- make fretboard have a minimum required height, flex above that a rule similar to the 60/40, though perhaps different numbers make sense when the fretboard is the prompt vs the response control. Once it's tall enough to be usable, it shouldn't be stealing all available space from the rest of the screen

## Notes for another day:
- buttons don't need to be there when user is answering the question. We can steal that space, have them slide in/appear during "feedback" phase. Like duolingo. Would require changing feedback display, since response buttons would get hidden.
- fretboard will need partial-section views eventually.