# CSS Cleanup — Next Steps

After the initial cleanup (PR #229), these items remain for future work.

## Card component adoption

`<Card>` / `<Card variant='well'>` / `<Card accent='notice'>` are defined in
`src/ui/layout.tsx` but not yet adopted by existing card-like CSS classes. Each
has unique padding/border that doesn't match the current Card API (`padding:
var(--pad-component)` uniform).

**Candidates and their differences:**

| CSS class | Padding | Border | Background |
|-----------|---------|--------|------------|
| `.practice-card` | `pad-component pad-region` (asymmetric) | none | card |
| `.suggestion-card` | `gap-group pad-component` (compact) | notice accent | notice-bg |
| `.level-progress-card` | `gap-group pad-component` | border-lighter | card |
| `.level-toggles-section` | `gap-group pad-component` | none | well |
| `.seq-card` | `gap-group pad-component` | border-lighter | well |
| `.about-col` | varies | varies | well / card |

**Options:**

1. Add a `padding` prop to Card (e.g. `compact` for `gap-group pad-component`)
   — most cards use this asymmetric pattern
2. Standardize all cards to the same padding and accept minor visual changes
3. Keep Card for new code only and gradually migrate as screens are touched

Most cards use `padding: var(--gap-group) var(--pad-component)` — adding a
`compact` variant would cover 5 of 6 candidates.

Also: `margin-bottom` on cards should move to parent Stack gap.

## Round complete spacing

Round complete has non-uniform spacing between children (heading →
pad-component → count → tight → label → gap-group → stats → pad-region →
progress). A single Stack gap doesn't fit. Options:

1. Accept non-uniform spacing as intentional (it's a hero display, not a list)
2. Use nested Stacks with different gaps for the count group vs the stats group
3. Standardize to uniform spacing

## Typography migration — remaining button/control classes

These CSS classes still manually expand `--type-*` tokens but are buttons or
controls where typography legitimately belongs in CSS (not in `<Text>`):

- `.tab-btn` (control recipe)
- `.text-link` (control recipe)
- `.segmented-btn` (control-small recipe)
- `.suggestion-card-accept` (control recipe)
- `.baseline-rerun-btn` (control recipe)
- `.level-toggle-btn` (partial control recipe)
- `.level-action-btn` (control recipe)
- `.group-skip-btn` (control recipe — dead, can delete)
- `.pill` (label-tag recipe)
- `.answer-btn` (answer recipe)
- `.home-title` (display-brand recipe)
- `.home-stats-bar` (status recipe — partial, font-size + color only)
- `.track-accordion-header` (heading-subsection recipe)
- `.about-col-text` (body recipe)
- `.active-skills-done` (status recipe)

These are intentional — buttons carry their own typography in CSS. No action
needed unless we want to extract a `control` CSS mixin.

## Home screen `.home-about-list`

The `<ul>` element still has manual `margin: 0` because the global reset only
covers `h1, h2, h3, p`. Consider extending the reset to `ul, ol` if more lists
appear in Stack contexts.

## Preview page maintenance

The preview page was updated with a Layout Primitives section. The dead toggle
demos were removed. Keep the preview page current as new components are added —
it's the design system source of truth.
