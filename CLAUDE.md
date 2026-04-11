# Music Reps — Docs Vault

Shared knowledge base for the Music Reps project. Both the user and agents
read from and write to this vault. It is the project's collective brain —
decisions, conventions, plans, guides, and observations all live here.

The main code repo checkout is at `../musicreps/`. Other worktrees
(`musicreps-product`, `musicreps-design`, etc.) are parallel checkouts of
the same repo.

## Structure

```
backlog/        — Tracked work items and epics (see below)
inbox/          — Landing zone for notes needing review
decisions/      — "We chose X because Y"
conventions/    — "Always do it this way"
debt/           — Known issues deferred intentionally
questions/      — Open questions parked for later
observations/   — Things noticed that might matter
sessions/       — Agent session summaries
inventory/      - Inventories of current state (strings, components, algorithms). Not filled out yet.
guides/         — Instructions for how to do things (architecture, coding style, design, etc.). 
plans/          — Design docs, product specs, execution plans
backlogs/       — Per-workstream backlogs (legacy, being replaced by backlog/)
feedback/       — User feedback and ideas
references/     — External links, research
screenshots/    — Periodic UI screenshots
templates/      — Obsidian templates for each note type
```

Tooling for this vault (vault-note, etc.) lives in `../trellis/`.

## Backlog system

Tracked work lives in `backlog/`. Structure:

```
backlog/
  _counter.md        — Next available ID (increment after creating an item)
  index.md           — Dataview-powered dashboard
  epics/             — Grouping pages (one per epic)
  items/             — Individual features and bugs (one per file)
  ideas/             — Lightweight idea cards (no ID, not committed work)
```

### Item frontmatter schema

```yaml
id: 33                # Sequential integer, from _counter.md
date: 2026-04-08
type: "🛠️ feature"   # 🛠️ feature | 🐞 bug
epic:                 # [[epic-name]] wikilink, or empty
status: open          # open | active | done | deferred
priority: "❗❗"       # ❗❗❗ | ❗❗ | ❗
tags: 
   - tooling
   - mobile
   - etc
```

### Creating items

- **In Obsidian**: Use Templater → `backlog-item` template. Set the `id`
  from `_counter.md` and increment the counter.
- **From CLI/agents**: Create `backlog/items/short descriptive name.md`
  with the frontmatter above. Always read and increment `_counter.md`.
- **Epic template**: `templates/epic.md`. Epics include a Dataview query
  that auto-lists their child items.

### Conventions

- Filename format: `short descriptive name.md` (e.g. `ios build management.md`)
- Tasks that are sub-steps of a feature live as `- [ ]` checkboxes inside
  that feature's note, not as separate items

## Conventions

- Use `[[wikilinks]]` for cross-references within this vault
- Use standard markdown links for references to code-repo files
- All notes have YAML frontmatter with at least `date`, `type`, and `status`
- See `templates/` for the full schema of each note type
- Commit after each change or coherent set of changes — don't batch up many
  unrelated edits into one big commit

