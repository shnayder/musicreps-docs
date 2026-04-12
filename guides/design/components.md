# Component Patterns

Reusable component patterns and their design conventions.

**Live reference:** The preview page's **Buttons** and **Screen Structure** tabs
show all component variants with current styling. The CSS is the single source
of truth — this guide describes the taxonomy and usage rules.

## Button Variant Taxonomy

Every interactive element falls into one of these categories. Each has a
distinct visual treatment — don't reuse styles across roles. See
[[layout-and-ia]] (principle #14).

| Variant | Role | Component |
|---------|------|-----------|
| **Primary action** | Initiate flow (Practice, Keep Going, Start, Done) | `<ActionButton variant='primary'>` |
| **Secondary action** | Cancel / alternative (Stop) | `<ActionButton variant='secondary'>` |
| **Small action** | Tertiary / utility (Redo speed check, Accept suggestion) | `.baseline-rerun-btn`, `.suggestion-card-accept` |
| **Answer** | Quiz response — equal visual weight, 4-column grid | `.answer-btn` in `.answer-grid` |
| **Toggle** | Multi-select filter (strings, groups, notes) | `.string-toggle`, `.distance-toggle` |
| **Tab** | View switching | `.mode-tab`, `.home-tab` |
| **Text link** | Tertiary navigation — muted, no background | `.text-link` |
| **Close** | Dismiss / navigate back | `.mode-close-btn`, `.quiz-header-close` |

**When to use ActionButton vs raw button:** Use `<ActionButton>` for
primary/secondary flow actions (start, stop, continue, done). Use raw `<button>`
with a specific class for everything else — answer buttons have feedback
semantics, toggles have pressed state, tabs have ARIA roles, and small actions
have intentionally quieter styling.

## Layout Primitives

Composable building blocks that own spacing and containment, so content
elements don't need one-off margin/padding classes. Source:
`src/ui/layout.tsx` + CSS section 2c.

| Component | Role | CSS |
|-----------|------|-----|
| `<Stack gap='group'>` | Flex column with semantic gap | `.stack.stack-group` |
| `<Card>` | Container surface (white, bordered, padded) | `.card` |
| `<Card variant='well'>` | Inset/recessed surface | `.card.card-well` |
| `<Card accent='brand'>` | Left-stripe brand accent | `.card.card-accent-brand` |
| `<Card accent='notice'>` | Left-stripe notice accent | `.card.card-accent-notice` |
| `<Section heading='...'>` | Heading + content with consistent gap | `.section-block` |

**Stack gap values** map to semantic spacing tokens:

| Gap | Token | Typical use |
|-----|-------|-------------|
| `micro` | `--gap-micro` (2px) | Icon + label coupling |
| `related` | `--gap-related` (4px) | Label + value pairs |
| `group` | `--gap-group` (12px) | Distinct groups within container |
| `component` | `--pad-component` (16px) | Card-internal section breaks |
| `region` | `--pad-region` (24px) | Layout region padding |
| `section` | `--gap-section` (32px) | Page-level separators |

**When to use Stack vs raw flex:** Use `<Stack>` for any vertical list of
elements that need consistent spacing. Use raw `flex` only when you need
horizontal layout, non-uniform gaps, or flex properties beyond column + gap.

**When to use Card vs raw div:** Use `<Card>` for any container that needs
the standard card treatment (background + border + radius + padding). This
replaces `.practice-card`, `.level-progress-card`, etc.

### Toggle Base

All filter toggles (string, distance, notes) share a `.toggle-btn` base class.
Specific classes (`.string-toggle`, `.distance-toggle`, `.notes-toggle`) add
only unique overrides (width, padding). Always apply both:
`class='toggle-btn distance-toggle'`.

## Modal

Centered dialog over a semi-transparent backdrop. Source: `src/ui/modal.tsx`.

| Prop | Type | Purpose |
|------|------|---------|
| `title` | `string` | Heading shown in the modal header |
| `open` | `boolean` | Controlled visibility |
| `onClose` | `() => void` | Called on backdrop click, Escape, or close button |
| `children` | `ComponentChildren` | Body content |

**Stacking:** Modal renders via `createPortal` to `document.body`, bypassing
all intermediate stacking contexts (`isolation: isolate` on `.layout-main`,
footer z-ordering, etc.). The backdrop uses `z-index: var(--z-modal)` (100).
This guarantees the modal dims everything underneath, including the tab bar.

**Z-index tokens** (`:root` in styles.css):

| Token | Value | Use |
|-------|-------|-----|
| `--z-raised` | 1 | Elements raised within their container (e.g., star button) |
| `--z-modal` | 100 | Modal backdrop — paints above all normal content |

**Rule:** Never use raw z-index numbers. Always use a token. If a new layer
is needed, add a token to the scale.

**Dismiss:** Three ways — tap backdrop, tap close button, press Escape.

## Info Hierarchy Pattern

When displaying a metric with context, use the **label: value / explanation**
pattern. The value is visually dominant; the label is quieter; the explanation
is smallest.

```
{label}         {value}         <- Text role: label + metric-primary
{explanation}                   <- Text role: supporting
[action]                        <- Small action button (optional)
```

This pattern appears in:
- **BaselineInfo** — "Response time: 0.5s / Timing thresholds are based on..."
- **Round complete stats** — "This round: 8/10 correct"
- **Practice status** — "Status: Building..."

Use `<Text role='label'>`, `<Text role='metric-primary'>`, and
`<Text role='supporting'>` to encode the hierarchy structurally.
