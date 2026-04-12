---
date: 2026-04-11
---
# Screen Headers

How top-level screens present their chrome bar (close button, title, optional
right slot).

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

A third component uses the pattern conceptually but *not* `ScreenHeader`:

- **`<ModeTopBar>`** (`src/ui/mode-screen.tsx`) — active quiz phase. Shows
  close + icon + title + optional description, **left-aligned**, not
  centered. This is intentional: during an active quiz the user's attention
  is on the prompt below, and the top bar exists to identify the mode, not
  to anchor the screen visually. Don't migrate it to `ScreenHeader` without
  revisiting the design.

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
