---
id: 49
date: 2026-04-09
type: 🐞 bug
epic: "[[pre-launch polish]]"
status: review
priority: ❗❗
tags:
  - design
---

# Header jumps between home and skill

Space and font are different between home and skill headers. Clean up so
transitions are smooth.

Still wrong:
- 3 different heights/spacings:
	- skill screens
	- about/settings
	- all/active skills (with stats)

## Investigation

Headers in play (all share `padding: var(--gap-group) var(--size-content-inset)` but render different inner content):

1. **Skill (idle)** — `SkillHeader` ([`practice-config.tsx:24`](../../../musicreps/src/ui/practice-config.tsx)) → `ScreenHeader` ([`mode-screen.tsx:196`](../../../musicreps/src/ui/mode-screen.tsx)). Close button + icon + title + reps badge.
2. **Skill (active/calibration)** — `QuizSession` bar ([`mode-screen.tsx:309`](../../../musicreps/src/ui/mode-screen.tsx)) renders the visible top chrome: close button + countdown timer + round reps counter. `ModeHeader` does also render `ModeTopBar` for non-idle phases ([`generic-mode.tsx:62`](../../../musicreps/src/declarative/generic-mode.tsx)), but it's **hidden via CSS** during active/round-complete/calibration ([`styles.css:1736`](../../../musicreps/src/styles.css)). So `ModeTopBar`'s only on-screen role is — nothing useful. The `description` prop is **dead code** (only exercised by tests/preview), and arguably `ModeTopBar` itself can go away once we confirm no phase actually renders it.
3. **About/Settings** — `HomeHeader` page-title branch ([`home-screen.tsx:684`](../../../musicreps/src/ui/home-screen.tsx)). Single centered `<h1>`.
4. **All/Active skills (web)** — `HomeHeader` default branch ([`home-screen.tsx:693`](../../../musicreps/src/ui/home-screen.tsx)). Brand title + tagline + stats bar in one block.
5. **All/Active skills (iOS native)** — same component, but `.home-header.native` hides brand title and tagline; only the stats bar is left.

Root cause: each variant renders different content; nothing enforces a shared height, so switching tabs visibly shifts the content below. Additionally, the brand title + tagline are conceptually app chrome (always-on web branding), not a "screen header", but they currently live inside `HomeHeader` and only on the active/all tabs.

## Proposed plan

Two structural moves, then a shared height:

### 1. Extract brand strip as its own top-of-page component

- New `BrandStrip` component: `<RepeatMark/> Music Reps` + tagline.
- Render it **always at the top on web**, on every screen (home tabs *and* skill screens), outside of any header.
- Hide on iOS native (`body.native-app .brand-strip { display: none }`) — same condition the current `.home-header.native` rule uses.
- Remove brand title + tagline JSX from `HomeHeader`. After this, `HomeHeader`'s default branch contains only the stats bar — i.e. on home active/all the stats bar **is** the header. ✅

### 2. Drop the dead `description` prop from `ModeTopBar`

- Remove the prop, the `mode-top-bar-text` wrapper, and the `.mode-description` CSS.
- Update `components_test.tsx` and `preview-tab-structure.tsx` to drop the description variants.

### 3. Unify header height

After (1) and (2), the four header variants are:

| Screen           | Header content                                       |
| ---------------- | ---------------------------------------------------- |
| Skill idle       | close + icon + title + reps badge (`SkillHeader`)            |
| Skill active     | close + countdown bar + round reps counter (`QuizSession`)   |
| Home active/all  | stats bar (`HomeHeader` default, post-extraction)            |
| About/Settings   | page heading (`HomeHeader` page-title)                       |

**Reference target = about/settings.** That header is `padding: var(--gap-group)` + a single `heading-page` h1, no other elements. Total height ≈ `gap-group + text-lg-line-height + gap-group`. We make the other three headers match this by aligning their *contents*, not by stamping a `min-height` token on top.

Per-variant adjustments:

- **Skill idle (`SkillHeader` / `ScreenHeader`)** — current extra height comes from `.close-btn` having `min-height: var(--size-touch-target)` (~2.75rem), which is taller than a `heading-page` line (~1.625rem at `--text-lg` × `--leading-tight`). The button dictates the row height.
  - Fix: keep the touch target intact (a11y) but stop letting it inflate the row. Shrink the *visual* close button (icon + padding) to roughly title line-height, and preserve the touch area with negative margin / `padding` extending past the content box (or absolute positioning of an enlarged hit zone). Concretely: drop `min-height` from `.close-btn`, set `padding: 0` on the icon container, and use `::before` or a wrapping `<button>` with `padding-block: calc((var(--size-touch-target) - 1em) / 2)` that overlaps adjacent space.
  - Confirm `.skill-icon` size in the header isn't taller than the title either; constrain to `1em` if needed.
  - Result: `SkillHeader`'s row collapses to title line-height, matching about/settings.

- **Skill active (`QuizSession`)** — same close-button issue. Apply the same close-button fix. The countdown bar's intrinsic height needs to match `text-lg` line-height; if it's currently shorter, bump its height token to align. Bump the round-counter (`.quiz-info-count`) text from `metric-info` to `heading-page` size/weight (and `RepeatMark` to match).
	- 👀 Prefer adding a new metric-header token, so current and future metrics are treated consistently.

- **Home active/all (`HomeHeader` stats bar)** — bump stats text from `metric-effort` (text-base / semibold) to **`heading-page`** size/weight, so the metric numbers read as titular. The "today / total / days" word units stay at body size for contrast (or also bump — open question below). The `.home-stats-bar` already has horizontal layout we're keeping; just the text scale changes.
	- 👀 Same -- define / change the way we treat "headline" metrics, don't hack this one page.

- **About/settings** — leave as is.

After all four are visually weight-matched, the heights should naturally align. **No `--size-header-min-height` token needed** — we converge by making the contents the same shape. That's cleaner: future header changes won't need to coordinate against a magic min-height.

Open sub-questions for this section:
- For the home stats bar bump: should the small "today / total / days" labels also move up to match, or stay smaller for visual hierarchy with the bumped numbers?
	- ⚡️leave them small for now
- Close-button hit-target preservation — happy with a negative-margin / overflowing hit area, or do you want the touch target reduced (e.g. to `2rem`) for visual tightness even if it falls below the 44px guideline?
	- ⚡️keep target 44px+.

### 4. Brand strip placement detail

- Above the header, full-width, on its own row. Likely a fixed `--size-brand-strip-height` so the rest of the layout is predictable.
	- 👀if it's the same across all screens, it should naturally stay fixed height, right? Just let it be as tall as is, no separate token should be needed.
- Web body grid becomes: `[brand strip] [header (varies by screen)] [body]`.
- iOS hides the brand strip and starts at the header.

### Open questions
- Where exactly should `BrandStrip` mount in the DOM? Cleanest: at the top of the app root in `app.ts` (or wherever the home/mode containers are inserted), so it sits above both `HomeScreen` and any active mode screen. Confirm that's where you'd like it.
	- ⚡️yes
- For the shared header min-height: is it OK that on iOS (with no brand strip) the headers will look a bit short relative to web (which has the brand strip above)? I think yes — they're independent decisions.
	- ⚡️ yes, that's the intention.
- `SkillHeader` currently has a reps badge on the right. Should the home stats bar match this aesthetic (e.g. centered metrics with the same row height as the reps badge), or stay as its own multi-stat row?
	- ⚡️ don't change horizontal layout
