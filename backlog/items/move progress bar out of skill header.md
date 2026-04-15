---
id: 50
date: 2026-04-09
type: 🛠️ feature
epic: "[[pre-launch polish]]"
status: done
priority: ❗❗
tags:
---

# Move progress bar out of skill header

Is the progress bar needed on every tab? Definitely not on the info tab.

* Practice tab:
	* useful high level context of where you are with this skill. Gives enough info to know whether to practice, what kind of experience to expect (am I reviewing and the questions will be easy, am I just starting and will have to puzzle out the answers for a while, etc).
	* ⚡️Keep it.
	* 🔍Design? Options:
		* Keep in header
		* Put at top of main content
			* without a section header (bar has a built-in "progress" label)
			* with a section header, perhaps also the one-line skill description that's currently on the info tab
			* Other suggestions?
* Progress tab:
	* obviously useful. Keep, but doesn't belong in header.
	* ⚡️ move it out of the header. Put in "Overall" section at the top.
* Info: not needed. 
	* ⚡️ Remove

## Review 1 notes
- Practice tab:
	- Doesn't work as-is. Needs a section header or different treatment. 
	- ⚡️Let's try section header: 
		- "Summary"
			- short description (move from info tab)
			- progress bar, with "progress" label (as-is)
		- then rest of content, as-is
- Progress tab
	- ⚡️Lost "progress" label for some reason. Put it back.
	- we'll add more here later on. For now just the bar.