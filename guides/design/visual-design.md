# Visual Design Guide

Current-state reference for Music Reps' design system. All values are defined
as CSS custom properties in `src/styles.css` `:root`.

## Design System Docs

| Guide | Contents |
|-------|----------|
| [[color-system]] | Three-layer color architecture, palette model, semantic families, heatmap, fretboard SVG |
| [[typography]] | Three-layer typography system, 5-tier scale, 20 roles, intensity tiers, design principles |
| [[spacing-and-tokens]] | Spacing scale, elevation, transitions, opacity, z-index, touch targets, border radius |
| [[components]] | Button variant taxonomy, info hierarchy pattern, structural components |
| [[screen-patterns]] | Home screen, quiz area, round complete, layout techniques |
| [[interaction]] | Hover, focus, pressed states, accessibility standards |

## Design Reference Pages

Live HTML pages for visual iteration. Build-generated pages use the same Preact
components and HTML helpers as production — rebuild (`deno task build`) or
refresh the dev server after edits.

| Page                                               | Contents                                                                                       | Source                                        |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------- |
**Component preview** is the primary tool for
iterating on component design. Available at `localhost:8001/preview` during dev. (Implemented in `preview.tsx`)

**Screenshots** The Playwright script
(`scripts/take-screenshots.ts`) captures deterministic screenshots by
dispatching fixture events to the running app.

For visual design principles (drill-first aesthetic, warmth, feedback clarity,
information density, mobile-primary), see
[[design-principles]]. For layout and screen structure
principles, see [[layout-and-ia]].
