---
name: process-inbox
description: Process an inbox note into backlog items. Extracts actionable items, creates a processing plan alongside the source file, and after user review, executes the changes.
argument-hint: <filename in inbox/>
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# Process inbox note

Process the inbox file at `inbox/$ARGUMENTS` (or the file the user specifies)
into backlog items. This is a two-phase workflow:

## Phase 1: Create processing plan

1. **Read the source file** in `inbox/`.
2. **Read existing backlog items** to identify duplicates. Use:
   ```
   source ~/.zprofile && obsidian base:query path="backlog/Backlog items.base" vault="musicreps-docs" view="All items" format=tsv
   ```
   Filter out stderr noise (Loading/out of date lines).
3. **Read `backlog/_counter.md`** to know the next available ID.
4. **Analyze each item** in the source and categorize:
   - **Create**: new backlog item needed. Propose title, type (🛠️ feature | 🐞 bug), tags, epic, priority.
   - **Skip**: already in backlog, not actionable, or pure reference/discussion material.
   - **Merge**: should be combined with an existing item. (Link it)
   - **Convention/decision**: not a task, but a principle or decision to record (suggest phrasing and location)
5. **Write the processing plan** to `inbox/<source-name> - processed.md` with:
   - Frontmatter: `date`, `type: plan`, `status: active`, `source: "[[source-name]]"`
   - Tables of proposed items grouped by category, each with a **decision** column for user markup
   - A "skip" section explaining what was left out and why
   - A "duplicates" section noting items that already exist
   - A summary with counts

6. **Ask the user to review** the processing plan. Do NOT proceed to Phase 2 until they confirm.

## Phase 2: Execute (after user review)

Only run this after the user has reviewed and marked up the processing plan.

1. **Read the updated processing plan** to see user decisions.
2. **Create backlog items** as files in `backlog/items/`:
   - Filename: `short descriptive name.md`
   - Frontmatter per the schema in CLAUDE.md (id, date, type, epic, status, priority, tags)
   - Tags use YAML list format:
     ```yaml
     tags:
       - launch
       - imported
     ```
   - Add `imported` tag to every new item
   - Increment `backlog/_counter.md` after all items created
3. **Record conventions/decisions** if any were identified.
4. **Mark the processing plan** status as `done`.

## Important notes

- Do NOT use `obsidian property:set` for bulk updates — it mangles YAML quoting.
  Edit files directly instead.
- Type and priority values must be quoted in frontmatter:
  `type: "🛠️ feature"` not `type: 🛠️ feature`
- Tags must be YAML list format, not inline `[x, y]`
- Epics are wikilinks: `epic: "[[pre-launch polish]]"`
- When in doubt about whether something is a new item vs duplicate, note it
  in the processing plan and let the user decide.
- Items that are clearly "someday/maybe" or "post-launch" should still be
  created but tagged `post-launch`.
- Flag items where the user already made a decision (⚡️) vs items that
  need investigation (🔍) vs items to backlog (🔜).
