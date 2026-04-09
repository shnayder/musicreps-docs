# Practice Tab Redesign

## Problem

The practice tab — especially on single-level skills — is sparse and confusing
for new users. A giant empty page with an unlabeled suggestion box and a
"Practice" button gives no context about what you're about to do or why.

Multi-level modes are better (they have "Practice setup" + Suggested/Custom
toggle filling the space), but still lack upfront motivation.

## Design direction

Move the "what you're learning" content (description + before/after) from the
Info tab to the top of the Practice tab. This front-loads the "why" right where
the user decides to practice.

### Practice tab structure (proposed)

```
┌──────────────────────────────┐
│ Mode top bar (title, close)  │  ← unchanged
├──────────────────────────────┤
│ What you're learning         │  ← NEW: heading-section
│ {description}                │  ← short tagline
│ ┌─Before──────┐┌─After─────┐│  ← moved from Info tab
│ │ slow process ││ instant   ││
│ └─────────────┘└───────────┘│
├──────────────────────────────┤
│ Recommendation               │  ← heading for single-level
│ ┌ suggestion card ──────────┐│
│ │ Start practicing          ││
│ └───────────────────────────┘│
│                              │  ← OR for multi-level:
│ Practice setup               │
│ [Suggested] [Custom]         │
│ suggestion lines / toggles   │
├──────────────────────────────┤
│         [ Practice ]         │  ← footer, unchanged
│  Practice | Progress | Info  │
└──────────────────────────────┘
```

### Info tab (simplified)

```
┌──────────────────────────────┐
│ Why learn this?              │  ← NEW heading
│ {aboutDescription}           │  ← longer explanation
│                              │
│ Start practicing on ⌇ below  │  ← tip, kept
└──────────────────────────────┘
```

## Content hierarchy

### Practice tab — intro section

| Element | Current role | Current rendering | Recommended role | Notes |
|---------|-------------|-------------------|-----------------|-------|
| "What you're learning" | `heading-section` | `--text-base`, semibold, muted | `heading-section` | Correct — section organizer |
| Description tagline | `supporting` | `--text-xs`, normal, light | `body-secondary` | Too small at `supporting`. Should be readable body text, just quieter than headings. Italic to distinguish from structural text. |
| "Before" / "After" headers | `heading-section` | `--text-base`, semibold, muted | `heading-subsection` | These are sub-headers within the intro section, not peer sections. Subsection avoids competing with "What you're learning". |
| Before text (lines) | bespoke `.about-col-text` | `--type-body-*`, italic | `body` with italic override | Correct tier — body content, italic distinguishes the "voice" |
| After text | bespoke `.about-col-text` | `--type-body-*`, semibold | `body` with semibold override | Correct tier — body content, semibold for emphasis |

### Practice tab — recommendation section (single-level modes)

| Element | Current role | Current rendering | Recommended role | Notes |
|---------|-------------|-------------------|-----------------|-------|
| "Recommendation" heading | *(missing)* | — | `heading-section` | NEW — needed to label the suggestion card |
| Suggestion card text | `heading-subsection` (bespoke) | subsection recipe | `heading-subsection` | Correct — it's a call to action within a card |
| "Accept" button | `control` (bespoke) | control recipe | `control` | Correct |

### Practice tab — practice setup (multi-level modes)

| Element                  | Current role               | Current rendering              | Recommended role  | Notes                                                                                                                                                                                                                     |
| ------------------------ | -------------------------- | ------------------------------ | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "Practice setup" heading | `heading-section`          | `--text-base`, semibold, muted | `heading-section` | Correct                                                                                                                                                                                                                   |
| Suggested/Custom toggle  | segmented control          | control recipe                 | —                 | Correct                                                                                                                                                                                                                   |
| Suggestion lines         | bespoke `.suggestion-line` | `--text-sm`, brand color       | `body-secondary`  | Consider — sm is right for density but brand color is unusual for informational text ⚡️let's try the same --notice color instead of brand, like on home screen cards. For the verb. And regular text color for the level. |
|                          |                            |                                |                   |                                                                                                                                                                                                                           |
❓Level toggle buttons have yet another font — I know that's a control, not "text", but still. Consider making it smaller, especially since we now have long labels.


🐞unrelated nit -- when no levels selected, message says "Select at least one group". We should use "level", not "group".
### Practice tab — status (in PracticeCard, single-level)

| Element | Current role | Current rendering | Recommended role | Notes |
|---------|-------------|-------------------|-----------------|-------|
| "Status" label | `label` | `--text-base`, medium, muted | `label` | Correct |
| Status value | bespoke `.practice-status-label` | `--text-sm`, semibold | `status` or `label` | Odd that the value is smaller than the label. Should match or use metric role. |
| Status detail | bespoke `.practice-status-detail` | `--text-sm`, normal, muted | `body-secondary` | Correct tier |

### Info tab

| Element | Current role | Current rendering | Recommended role | Notes |
|---------|-------------|-------------------|-----------------|-------|
| "Why learn this?" | *(missing)* | — | `heading-section` | NEW heading |
| About description | `body` | body recipe | `body` | Correct |
| "Start practicing" tip | `status` (`.status-empty`) | status recipe, italic | `status` | Correct |

## Key typography fixes

1. **Description tagline**: `supporting` (xs) → `body-secondary` (sm). It's
   readable content, not a footnote.
2. **Before/After headers**: `heading-section` → `heading-subsection`. They're
   sub-headers within the intro, not peer sections.
3. **Status value**: should not be smaller than its label. Align to same tier.
4. **Max 3 sizes rule**: With these fixes, the practice tab uses base (headings,
   body), sm (secondary text, status), and xs (only if supporting appears
   elsewhere). Three tiers.

## Spacing fixes

1. Practice intro top padding should match other tab panels (use same
   `--pad-component` / `--gap-group` rhythm as progress tab sections).
2. Recommendation card for single-level needs the same section spacing as
   multi-level's "Practice setup".

## Resolved decisions

- **"Keep Going" button**: keep as-is — persistence framing fits.
- **"Practice setup" label**: keep pending user feedback.
- **Before/After moves to practice tab**: yes — front-loads motivation.
- **Info tab keeps "start practicing" tip**: yes.
- **Single-level recommendation needs "Recommendation" heading**: yes.
- **Info tab needs "Why learn this?" heading**: yes.
