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

| #   | item                                                             | type | pri | decision             | actions                                            |
| --- | ---------------------------------------------------------------- | ---- | --- | -------------------- | -------------------------------------------------- |
| 1   | [[figure out ios build management for test flight and beyond]]   | 🛠️  | ❗❗❗ | v1                   | type→🛠️, epic→[[pre-launch tooling]]              |
| 2   | [[Add skill - intervals on fretboard]]                           | 🛠️  | ❗❗❗ |                      | remove tag v2                                      |
| 4   | [[review text descriptions for all skills]]                      | ☑️   | ❗❗❗ |                      | type→🛠️, epic->[[pre-launch polish]]              |
| 8   | [[export progress data and tooling for testing recommendation ]] | 🛠️  | ❗❗  |                      | —                                                  |
| 9   | [[get rid of dead css and prevent in the future tools for this]] | 🛠️  | ❗❗  |                      | remove tag v2                                      |
| 10  | [[grand renaming mode skill group level]]                        | ☑️   | ❗❗  | tech debt            | type→🛠️, tag tech-debt                            |
| 11  | [[improve principles based ui iterate tool]]                     | 🛠️  | ❗❗  | tooling              | remove tag later, tag tooling                      |
| 12  | [[key signatures 1b major shows answer buttons with sharps]]     | 🐞   | ❗❗  | v1                   | epic→[[pre-launch polish]]                         |
| 13  | [[mark entire skill i know this]]                                | 🛠️  | ❗❗  |                      | remove tag v2                                      |
| 14  | [[prioritize level order more in recommendation system]]         | 🛠️  | ❗❗  | v1                   | epic→[[pre-launch polish]]                         |
| 15  | [[refactor very long files]]                                     | ☑️   | ❗❗  | tech debt            | type→🛠️, tag tech-debt                            |
| 16  | [[settings page scroll bug on ios]]                              | 🐞   | ❗❗  | fixed. close it      | status→done                                        |
| 17  | [[show progression of automatization for a skill e g swipe scr]] | ☑️   | ❗❗  | close it             | status→done                                        |
| 18  | [[test on iphone se screen size fretboard gets squished too mu]] | ☑️   | ❗❗  | v1                   | type→🛠️, epic→[[pre-launch polish]]               |
| 19  | [[test on ipad screen sizes better for fretboard]]               | ☑️   | ❗❗  | v1                   | type→🛠️, epic→[[pre-launch polish]]               |
| 20  | [[try allow learning fretboard by low med high frets instead o]] | 🛠️  | ❗❗  | already done         | status→done, remove tag v2                         |
| 21  | [[better icon for all skills it s not a card grid]]              | 🐞   | ❗❗  |                      | epic→[[pre-launch polish]]                         |
| 22  | [[notice palette is weird in saturation review and perhaps use]] | ☑️   | ❗❗  | tooling              | type→🛠️, tag tooling                              |
| 23  | [[update preview page to reflect latest components]]             | ☑️   | ❗❗  | tooling              | type→🛠️, tag tooling                              |
| 24  | [[useMemo mutable object bug]]        | 🐞   | ❗❗  | tech debt. Fix name. | tag tech-debt, rename→"useMemo mutable object bug" |
| 7   | [[bug report feature]]                                           | 🛠️  | ❗   |                      | remove tag v2                                      |
| 25  | [[level card actions ux improve known skip discoverability]]     | ☑️   | ❗   | v1                   | type→🛠️, epic→[[pre-launch polish]]               |
| 26  | [[progress bar tap to explain card showing item breakdown fres]] | ☑️   | ❗   | v1                   | type→🛠️, epic→[[pre-launch polish]]               |
| 27  | [[remove dev panel link in ios builds]]                          | ☑️   | ❗   | v1                   | type→🛠️, epic→[[pre-launch polish]]               |
| 28  | [[try adding repeat logo in the home background behind the car]] | ☑️   | ❗   | v1                   | type→🛠️, epic→[[pre-launch polish]]               |
| 29  | [[try different shape for fretboard markers rounded rectangles]] | ☑️   | ❗   |                      | type→🛠️, remove tag v2                            |
| 30  | [[web nav should be on top]]                                     | 🐞   | ❗   | later                | tag post-launch                                    |
| 31  | [[ios widget to encourage practice]]                             | 🛠️  | ❗   |                      | remove tag later                                   |
| 32  | [[key signature keyboard entry doesn t accept s for and no key]] | 🐞   | ❗   | later                | tag post-launch                                    |

### Global actions (apply first)
1. Create epic: `pre-launch polish`
2. All ☑️ task items → type 🛠️ feature (items: 4, 10, 15, 18, 19, 22, 23, 25, 26, 27, 28, 29)
3. Remove all v2/later tags from all items
4. Then apply per-item actions above (epics, tags, status changes, rename)

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
