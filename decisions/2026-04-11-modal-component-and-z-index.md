---
status: done
---

# Modal Component + Z-Index Conventions

Added a reusable `Modal` to the design system for the "tap progress bar →
explain" feature (PR #236). First modal in the app, so it needed a proper
stacking/accessibility story.

## Decisions

### Portal to document.body

`Modal` renders via `preact/compat`'s `createPortal` to `document.body`.
This bypasses all intermediate stacking contexts.

**Why:** `.layout-main` has `isolation: isolate` (needed for the watermark
`z-index: -1` trick). Anything rendered inside it, including a
`position: fixed` element, is trapped in that stacking context and can't
paint above `.layout-footer` which is a sibling of `.layout-main`. Without
the portal, tapping the progress bar on the Practice tab left the bottom
nav visibly un-dimmed above the modal backdrop.

### Z-index token scale

Added `--z-modal: 100` (renamed from the pre-existing `--z-popover`).

**Rule:** Never use raw z-index numbers. Always use a token. If a new layer
is needed, add a token to the scale. Current scale:

| Token | Value | Use |
|-------|-------|-----|
| `--z-raised` | 1 | Elements raised within their container (e.g. star button) |
| `--z-modal` | 100 | Modal backdrop — paints above all normal content |

### Accessibility contract for modals

`Modal` must:
- Use `role='dialog'` + `aria-modal='true'`
- Move focus to a predictable target on open (currently the close button)
- Restore focus to the previously-focused element on close
- Lock body scroll while open (`document.body.style.overflow = 'hidden'`)
- Dismiss on Escape, backdrop click, and explicit close button

Focus trap is **not yet implemented**. The current modal is a small
informational dialog with only one interactive element (the close button),
so Tab escaping to the page underneath is acceptable for now. Add a trap
before introducing a modal with multiple focusable elements.

### Controlled, not imperative

`Modal` takes `open: boolean` + `onClose: () => void` — the parent owns
state. This is consistent with the rest of the Preact code and avoids
imperative `.show()` / `.hide()` APIs.

## Related component: SpeedLevelModal

`SpeedLevelModal` is a thin wrapper that renders `<Modal title='Progress'>`
containing the `SpeedLevelLegend` table. It exists so callers don't have
to know about `Modal` — they just toggle `open` on a tight informational
modal.

## References

- `src/ui/modal.tsx` — the Modal component
- `src/ui/speed-level-legend.tsx` — Speed level legend + modal wrapper
- `src/styles.css` — `.modal-backdrop`, `.modal-surface`, `.modal-header`,
  `.modal-close`, `.modal-body`
- `guides/design/components.md` — user-facing reference
