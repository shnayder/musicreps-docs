---
date: 2026-04-13
---
# Screen Headers

How top-level screens present their chrome bar (close button, title, optional
right slot).

On web, every screen also has a persistent **`<BrandStrip>`** above the
header — the Music Reps wordmark + tagline. It lives in `#brand-strip` in
`build-template.ts` and is mounted once from `app.ts`. Hidden on native
via `body.native-app .brand-strip { display: none }`. It's app chrome,
not a screen header, so it doesn't participate in the layout zones below.

## The pattern

Every top-level screen that has a close button uses the same three-part
horizontal layout:

```
[ × ]        [ icon + centered title ]        [ right slot ]
```

- **Close button (left)** — `<CloseButton>` with a screen-appropriate
  `ariaLabel`. Dismisses the screen.
- **Centered title (middle)** — `<Text role='heading-page' as='h1'>`, with an
  optional leading `<SkillIcon>`. The middle region takes `flex: 1` and
  horizontally centers its content so the title stays visually centered in the
  full bar width regardless of what's on the left or right.
- **Right slot (optional)** — mode-specific info like a reps counter, trial
  counter, or another small pill. Omitted renders as an invisible spacer to
  keep the title centered.

The bar has a chrome background (`var(--color-chrome)`), uses
`padding: var(--gap-group) var(--size-content-inset)`, and sits inside
`<LayoutHeader>` so it anchors to the top of the screen under the iOS safe
area inset.

### Height parity across variants

All header variants converge on the same row height — a single
`heading-page` line + `--gap-group` top/bottom padding — so switching
screens doesn't cause a vertical jump. The four variants in play:

| Screen          | Component                                      |
| --------------- | ---------------------------------------------- |
| Skill idle      | `SkillHeader` → `ScreenHeader`                 |
| Skill active    | `QuizSession` (close + countdown + counter)    |
| Home active/all | `HomeHeader` default branch (stats bar only)   |
| About/Settings  | `HomeHeader` page-title branch                 |

There's no `--size-header-min-height` token. Headers match because their
*contents* match in visual weight, specifically:

- **`<CloseButton>`** keeps a 44px touch target via `min-width` /
  `min-height`, but its layout contribution is pulled back to the
  title's line-height via a negative `margin-block`:
  `calc((var(--text-lg) * var(--leading-tight) - var(--size-touch-target)) / 2)`.
  The extra padding overflows into the brand strip / body above and
  below, where it's invisible. This lets the X glyph stay full size
  (`--size-close-btn`, 2.25rem) without inflating the row.
- **Headline metrics** (home stats bar, quiz round counter, skill-screen
  reps badge) use the `metric-header` role, sized to match
  `heading-page` so numbers carry the same weight as page titles. See
  `--type-metric-header-*` tokens.

## Component

`<ScreenHeader>` in `src/ui/mode-screen.tsx` is the reusable primitive.

```tsx
<ScreenHeader
  title='Guitar Fretboard'
  icon={<SkillIcon modeId='fretboard' />}
  onClose={navigateHome}
  closeAriaLabel='Back to home'
  right={<Text role='metric-effort'>{totalReps.toLocaleString()}</Text>}
/>
```

Props:
- `title: string`
- `icon?: ComponentChildren` — usually a `<SkillIcon>`, rendered before the title
- `onClose?: () => void` — close handler; omitted renders an invisible left
  spacer (useful when close isn't applicable)
- `closeAriaLabel?: string` — defaults to "Close"
- `right?: ComponentChildren` — optional right-side content; omitted renders an
  invisible spacer so the centered title stays balanced

## Consumers

Two direct wrappers provide context-specific conveniences:

- **`<SkillHeader>`** (`src/ui/practice-config.tsx`) — skill screen idle
  phase. Takes `modeId`, `title`, `totalReps`, `onBack`. Builds the skill
  icon and the reps counter (with `<RepeatMark>`) and delegates to
  `ScreenHeader`.

- **`SpeedCheckHeader`** (file-private, `src/ui/speed-check.tsx`) — speed
  check calibration. Takes `count`, `onClose`. Title is always
  "Speed Check"; `count` becomes the right slot.

A third consumer renders its own bar, not `ScreenHeader`:

- **`<QuizSession>`** (`src/ui/mode-screen.tsx`) — active quiz phase.
  Renders close + countdown bar + round counter directly. Uses the same
  padding and row-height math as `ScreenHeader` so it stays flush with
  the other variants.

## CSS

- `.screen-header` — background + padding for the bar
- `.screen-header-title` — middle region (`flex: 1`, `justify-content: center`)
- `.screen-header-spacer` — invisible 32px-wide placeholder used when the
  close or right slot is absent, so the centered title stays balanced

## Historical note

Before 2026-04-11, `SkillHeader` and `SpeedCheckHeader` had their own
near-duplicate CSS (`.skill-header*`, `.speed-check-header`, `.speed-check-label`)
and the speed check rendered its X on the right with a left-aligned title.
Unifying on `ScreenHeader` fixed the inconsistency — both headers now have
identical layout, height, and spacing.

On 2026-04-13 `ModeTopBar` was removed. It was rendered by
`generic-mode.tsx` during non-idle phases but always hidden via CSS
(`.phase-active / .phase-round-complete / .phase-calibration`), so it
never appeared on screen. `QuizSession` is the only component that
actually renders during active phases. Same day: `BrandStrip`
extracted, `metric-header` role added, and header row-heights
converged on a single line-height via close-button margin math.
