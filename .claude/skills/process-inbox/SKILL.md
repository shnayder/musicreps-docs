---
name: process-inbox
description: Process an inbox note into backlog items and ideas. Extracts actionable items, creates a processing plan alongside the source file, and after user review, executes the changes.
argument-hint: <filename in inbox/>
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# Process inbox note

Process the inbox file at `inbox/$ARGUMENTS` (or the file the user specifies)
into backlog items, ideas, and conventions. This is a two-phase workflow:

## Phase 1: Create processing plan

1. **Read the source file** in `inbox/`.
2. **Read existing backlog items** to identify duplicates. Use:
   ```
   source ~/.zprofile && obsidian base:query path="backlog/Backlog items.base" vault="musicreps-docs" view="All items" format=tsv
   ```
   If that returns empty (Obsidian not running), fall back to:
   ```
   for f in backlog/items/*.md; do id=$(grep '^id:' "$f" | head -1 | sed 's/id: //'); title=$(grep '^# ' "$f" | head -1 | sed 's/^# //'); echo "$id|$title"; done | sort -t'|' -k1 -n
   ```
3. **Read `backlog/_counter.md`** to know the next available ID.
4. **Analyze each item** in the source and categorize:
   - **🛠️/🐞 Create**: new backlog item. Propose title, type, tags, epic, priority.
   - **💡 Idea**: not committed work, but worth capturing. Goes to `backlog/ideas/`.
   - **Skip**: already in backlog, not actionable, or pure reference/discussion.
   - **Merge**: should be combined with an existing item. (Link it by #id)
   - **Convention/decision**: a principle or decision to record (suggest phrasing and location).
5. **Write the processing plan** to `inbox/<source-name> - processed.md` with:
   - Frontmatter: `date`, `type: plan`, `status: active`, `source: "[[source-name]]"`
   - Tables of proposed items grouped by category, each with a **decision** column for user markup
   - Use 💡 in the type column for ideas (user may change to 🛠️/🐞 to promote)
   - A "skip" section explaining what was left out and why
   - A "duplicates" section noting items that already exist
   - A summary with counts

6. **Ask the user to review** the processing plan. Do NOT proceed to Phase 2
   until they confirm.

## Phase 2: Execute (after user review)

Only run this after the user has reviewed and marked up the processing plan.

1. **Read the updated processing plan** to see user decisions.
2. **Create backlog items** (type 🛠️ or 🐞) as files in `backlog/items/`:
   - Filename: `short descriptive name.md`
   - Frontmatter per the schema in CLAUDE.md (id, date, type, epic, status,
     priority, tags)
   - Add `imported` tag to every new item
   - Increment `backlog/_counter.md` after all items created
3. **Create idea cards** (type 💡) as files in `backlog/ideas/`:
   - Filename: `short descriptive name.md`
   - Frontmatter:
     ```yaml
     date: YYYY-MM-DD
     type: idea
     source: "[[source-note-name]]"
     tags:
       - optional-tag
     ```
   - Ideas have NO id, NO priority, NO status, NO epic — they're lightweight.
   - When an idea gets promoted to real work later, create a proper item in
     `items/` and delete the idea card.
4. **Record conventions/decisions** if any were identified.
5. **Mark the processing plan** status as `done`.

## Frontmatter formatting rules

- Do NOT use `obsidian property:set` for bulk updates — it mangles YAML quoting.
  Edit files directly instead.
- Type and priority values must be quoted in frontmatter:
  `type: "🛠️ feature"` not `type: 🛠️ feature`
- Tags must be YAML list format:
  ```yaml
  tags:
    - design
    - imported
  ```
- Epics are wikilinks: `epic: "[[pre-launch polish]]"`
- Don't use `launch` or `post-launch` tags — epic membership handles scoping.

## Triage guidance

- Flag items where the user already made a decision (⚡️) vs items needing
  investigation (🔍) vs items to backlog (🔜).
- When in doubt about item vs idea vs duplicate, note it in the processing
  plan and let the user decide.
- Things that are clearly "someday/maybe" with no concrete scope → 💡 idea.
- Things with a clear action even if low priority → 🛠️/🐞 item.
