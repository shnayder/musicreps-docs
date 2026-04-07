# Music Reps — Docs Vault

Shared knowledge base for the Music Reps project. Both the user and agents
read from and write to this vault. It is the project's collective brain —
decisions, conventions, plans, guides, and observations all live here.

The main code repo checkout is at `../musicreps/`. Other worktrees
(`musicreps-product`, `musicreps-design`, etc.) are parallel checkouts of
the same repo.

## Structure

```
inbox/          — Landing zone for notes needing review
decisions/      — "We chose X because Y"
conventions/    — "Always do it this way"
debt/           — Known issues deferred intentionally
questions/      — Open questions parked for later
observations/   — Things noticed that might matter
sessions/       — Agent session summaries
guides/         — Reference docs (architecture, coding style, design, etc.)
plans/          — Design docs, product specs, execution plans
backlogs/       — Per-workstream backlogs
feedback/       — User feedback and ideas
references/     — External links, research
screenshots/    — Periodic UI screenshots
templates/      — Obsidian templates for each note type
```

Tooling for this vault (vault-note, etc.) lives in `../trellis/`.

## Conventions

- Use `[[wikilinks]]` for cross-references within this vault
- Use standard markdown links for references to code-repo files
- All notes have YAML frontmatter with at least `date`, `type`, and `status`
- See `templates/` for the full schema of each note type
