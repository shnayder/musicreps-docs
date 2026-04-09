---
id: 39
date: 2026-04-08
type: 🛠️ feature
epic: "[[pre-launch polish]]"
status: open
priority: ❗❗
tags:
  - design
---

# Review screen headers and IA

Multiple screens lack headers and clear guidance:
- Progress tab: no header. "Item details" — what items?
- Practice tab: no header. What am I supposed to do?
- "Keep practicing" wording is off
- "+- 1-2 semitones" is confusing wording
- "N-># ; # -> N" — huh?

Ask on every screen: what is it for, what do I do next?

## Inventory

### Practice tab (skill screens) — NO HEADER

PracticeCard renders: Status → Recommendation → Scope. No heading explains the
tab's purpose. Compare to Progress tab which labels every section. The practice
tab is the primary action surface — it should say what it's for.

**Rec:** Add a heading or brief instruction. The tab icon now says "Practice" but
the content area itself has no label.
	- Yes. Need exact text, style plan for single-level modes with no config, multi-level modes. 🔍 Add draft here:
	- **Single-level modes** (Note Semitones, Interval Semitones):
		- See title, progress if started, Recommendation.
		- then a giant empty page before the practice button.
		- Lots of space to encourage action
			- "Practice" heading?
			- Hint text summarizing what you're going to drill: e.g. _"Practice to automate the mapping between intervals and semitones"_?
	- **Multi-level modes** (8 modes): GroupPracticeContent already renders "Practice setup" heading above the Suggested/Custom toggle. This IS the practice tab header — it labels the content.

### Progress tab — "Item details" heading is vague

`generic-mode.tsx:925` — "Item details" labels the stats grid/table. What items?
Details of what? A user seeing this for the first time can't tell.

**Rec:** "Mastery by item" or "Item mastery" — says what the data represents.
- ⚡️It's not really "mastery". Let's call it "Speed by item".

### Stats table direction headers — cryptic abbreviations

Column headers in bidirectional stats tables:

| Mode                 | Forward | Reverse | Problem                  |
| -------------------- | ------- | ------- | ------------------------ |
| Note ↔ Semitones     | N→#     | #→N     | What are N and #?        |
| Interval ↔ Semitones | I→#     | #→I     | What are I and #?        |
| Key Signatures       | Key→Sig | Sig→Key | Abbreviated but passable |

**Rec:** Spell out: "Note→Number" / "Number→Note", "Interval→Number" /
"Number→Interval". Key Signatures headers are okay.
- ⚡️Let's try and see if it fits. May need text to wrap.

### Semitone Math group labels — "±1–2" is opaque

Toggle buttons show `±1–2`, `±3–4`, etc. The `longLabel` values ("1–2 semitones
apart") exist but aren't displayed.

**Rec:** Use longer labels on the toggles: "1–2 semitones", "3–4 semitones", etc.
Drop the ± — the mode already implies both directions.
	- ⚡️yes

### Interval Math group labels — "m2 M2" needs context

Toggle buttons show interval shorthand like "m2 M2", "P4 TT". Correct for
musicians who know interval notation, but no heading explains what the groups
represent.

**Rec:** The scope heading "Intervals" helps, but consider "P4 / TT" with
separators instead of space-separated pairs. Low priority — target audience knows
these.
	- ⚡️Let's use long labels here too

### "Keep Going" button — slightly off

`mode-screen.tsx:484` — after round complete. "Keep Going" implies persistence
through difficulty. The action is just "do another round."

**Rec:** "Next Round" — clearer, matches the "Round complete" heading. Low
priority.
	- ⚡️keep as-is. Practice is surprisingly cognitively difficult, so persistence through difficulty feels right.

### "Practice setup" label in PracticeConfig

`practice-config.tsx:189` — labels the Suggested/Custom toggle. "Setup" is vague.

**Rec:** Leave for now — the Suggested/Custom toggle is self-explanatory. Could
become "Practice scope" if we add more config options.
- ⚡️yes, leave it pending user feedback

### Recommendation cards
 Verb + scope pattern ("start A string — 5 new
  items"). It's ok, but a bit confusing at first. e.g. "Start Seconds (m2, M2) — 48 new items". On first load, I may have no idea what Seconds are, certainly don't know what the set of levels is, whether this is the first one, what the others will be, etc. 
	- ⚡️ Let's remove the "48 new items". It's not clearly helpful. If people want, we can bring it back using the custom setup pattern (in the practice button)
	- 🔍 Perhaps "Start first level: {level long label}". Inventory: [[recommendation-strings]]. 
### Screens that are fine

- **Home tabs**: Active Skills, All Skills, About, Settings — all have clear
  headings.
- **Mode top bar**: Shows mode name + icon. Clear.
- **Round complete**: "Round complete" heading + stats + actions. Clear.
- **Progress tab sections**: "Level progress" and "Speed check" headings are
  good.
- **Info tab**: "Before" / "After" column headers. Clear.
- **Recommendation cards**:
