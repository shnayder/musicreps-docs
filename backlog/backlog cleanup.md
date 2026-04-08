---
date: 2026-04-08
type: plan
status: active
---

# Backlog cleanup

Triage the migrated td items, pull in items from the legacy backlogs, and
settle on a structure that works going forward.

Markup:
⚡️ - decision. 

## Open questions

### Type: task vs feature
Currently three types: 🛠️ feature, ☑️ task, 🐞 bug. Is the task/feature
distinction pulling its weight? Options:
- **Merge them** — just 🛠️ and 🐞. Simpler. Size/scope lives in the
  description, not the type field.
- **Keep but clarify** — feature = user-visible new capability, task =
  internal/chore/maintenance work.
- **Rename task → chore** to make the distinction clearer.
- ⚡️ merge them - just feature

### Tags we'll want
As we pull in the bigger backlogs, suggested tag vocabulary:
- `launch` — must-do before launch
- `post-launch` — yes, but after launch
- `tooling` — internal dev/agent tooling
- `tech-debt` — cleanup, refactoring
- `design` — visual/UX work
- `learning-model` — spaced rep algorithm, recommendations
- `music` — new musical content/skills
- `mobile` — iOS/Android specific

### Epics to create
- **Pre-launch polish** — the "ship it" epic: bugs, rough edges, must-haves
- Pre-launch tooling and admin — release workflows, screenshot tools, privacy pages, etc
- Existing epics from td migration: monetization, marketing, sound, music
  reading, review tab
	- ⚡️ let's create only as needed

---

## Triage: migrated td items

Mark each with a fate. Edit the "decision" and "notes" columns directly.

⚡️ default is to leave as-is
⚡️ let's remove v2/later tags -- if it's not in the pre-launch epic, it's later
⚡️putting "v1" for adding to pre-launch 

| #   | item                                                             | type | pri | decision             | notes        |
| --- | ---------------------------------------------------------------- | ---- | --- | -------------------- | ------------ |
| 1   | [[figure out ios build management for test flight and beyond]]   | 🛠️  | ❗❗❗ | v1                   |              |
| 2   | [[Add skill - intervals on fretboard]]                           | 🛠️  | ❗❗❗ |                      | tagged v2    |
| 4   | [[review text descriptions for all skills]]                      | ☑️   | ❗❗❗ |                      |              |
| 8   | [[export progress data and tooling for testing recommendation ]] | 🛠️  | ❗❗  |                      |              |
| 9   | [[get rid of dead css and prevent in the future tools for this]] | 🛠️  | ❗❗  |                      | tagged v2    |
| 10  | [[grand renaming mode skill group level]]                        | ☑️   | ❗❗  | tech debt            |              |
| 11  | [[improve principles based ui iterate tool]]                     | 🛠️  | ❗❗  | tooling              | tagged later |
| 12  | [[key signatures 1b major shows answer buttons with sharps]]     | 🐞   | ❗❗  | v1                   |              |
| 13  | [[mark entire skill i know this]]                                | 🛠️  | ❗❗  |                      | tagged v2    |
| 14  | [[prioritize level order more in recommendation system]]         | 🛠️  | ❗❗  | v1                   |              |
| 15  | [[refactor very long files]]                                     | ☑️   | ❗❗  | tech debt            |              |
| 16  | [[settings page scroll bug on ios]]                              | 🐞   | ❗❗  | fixed. close it      |              |
| 17  | [[show progression of automatization for a skill e g swipe scr]] | ☑️   | ❗❗  | close it             | tagged v2    |
| 18  | [[test on iphone se screen size fretboard gets squished too mu]] | ☑️   | ❗❗  | v1                   |              |
| 19  | [[test on ipad screen sizes better for fretboard]]               | ☑️   | ❗❗  | v1                   |              |
| 20  | [[try allow learning fretboard by low med high frets instead o]] | 🛠️  | ❗❗  | already done         | tagged v2    |
| 21  | [[better icon for all skills it s not a card grid]]              | 🐞   | ❗❗  |                      |              |
| 22  | [[notice palette is weird in saturation review and perhaps use]] | ☑️   | ❗❗  | tooling              |              |
| 23  | [[update preview page to reflect latest components]]             | ☑️   | ❗❗  | tooling              |              |
| 24  | [[usememo stable id mutable objects are a no no signals]]        | 🐞   | ❗❗  | tech debt. Fix name. |              |
| 7   | [[bug report feature]]                                           | 🛠️  | ❗   |                      | tagged v2    |
| 25  | [[level card actions ux improve known skip discoverability]]     | ☑️   | ❗   | v1                   |              |
| 26  | [[progress bar tap to explain card showing item breakdown fres]] | ☑️   | ❗   | v1                   |              |
| 27  | [[remove dev panel link in ios builds]]                          | ☑️   | ❗   | v1                   |              |
| 28  | [[try adding repeat logo in the home background behind the car]] | ☑️   | ❗   | v1                   |              |
| 29  | [[try different shape for fretboard markers rounded rectangles]] | ☑️   | ❗   |                      | tagged v2    |
| 30  | [[web nav should be on top]]                                     | 🐞   | ❗   | later                |              |
| 31  | [[ios widget to encourage practice]]                             | 🛠️  | ❗   |                      | tagged later |
| 32  | [[key signature keyboard entry doesn t accept s for and no key]] | 🐞   | ❗   | later                |              |

Already closed (from td): #3 (force push protection), #5 (clean up design files), #6 (check-ci copilot review).

---

## Next: pull from [[2026-04-06 user feedback]]

## Later: pull from legacy backlogs

Items to extract from [[backlogs/product]], [[backlogs/engineering]],
[[backlogs/design]] into the new system. We'll do this after triaging the
above.

Decision options for each: **keep** (assign epic + tags), **post-launch**
(tag, deprioritize), **close** (done or no longer relevant), **merge**
(combine with existing item).
