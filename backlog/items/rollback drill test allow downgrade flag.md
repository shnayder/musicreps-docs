---
id: 91
date: 2026-04-14
type: "🛠️ feature"
epic:
status: open
priority: "❗❗"
tags:
  - tooling
  - releases
  - imported
---

# Rollback drill: test allowDowngrade flag on gh-pages

Walk through the rollback flow before we need it. Edit `release/version.json`
on gh-pages to add `allowDowngrade: true` and confirm a newer client picks
up the older version.
