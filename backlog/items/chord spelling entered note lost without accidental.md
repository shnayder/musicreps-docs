---
id: 78
date: 2026-04-13
type: 🐞 bug
epic: "[[pre-launch polish]]"
status: review
priority: ❗❗
tags:
  - ux
---

# Chord spelling: entered note lost if accidental not tapped first

Tapped "B", then "Check". Marked wrong because B hadn't entered yet — the
input mechanism was waiting for an accidental tap first. Surprising: the note
should commit when Check is pressed (or be visually clear that it's pending).

## Investigation

Chord spelling uses `SplitNoteButtons` → `SplitButtons` ([`src/ui/buttons.tsx:127`](../../../musicreps/src/ui/buttons.tsx)). Tapping a letter sets `pendingPri` but only auto-submits once `pendingSec` is also set (line 162-168). The letter is styled with `.answer-btn-pending` (2px outline) — visual cue exists but is easy to miss.

Check flows through `useSequentialInput.handleCheck` ([`src/declarative/use-sequential-input.ts:72`](../../../musicreps/src/declarative/use-sequential-input.ts)), which only reads already-committed `seqEntriesRef.current`. The `pendingPri` value in `SplitButtons` is never surfaced, so Check evaluates without the tapped letter.

## Proposed plan

Commit-on-Check: when Check is pressed with a pending primary but no secondary, treat it as natural (`combineNote(pendingPri, '') === pendingPri`) and flush it into the sequence before evaluating.

Implementation:

1. Give `SplitButtons` an imperative "flush" hook. Simplest: accept an optional `flushRef: { current: (() => void) | null }` prop. On every render (or via `useImperativeHandle`), `SplitButtons` assigns a function to `flushRef.current` that, when called, calls `onAnswerRef.current(combine(pendingPri, ''))` if `pendingPri && !pendingSec`, then clears pending state.
2. Thread this ref from `SplitNoteButtons` → down from the quiz-area wiring. In [`src/declarative/quiz-areas.tsx`](../../../musicreps/src/declarative/quiz-areas.tsx) around the Check button (lines 599-606), call `flushRef.current?.()` synchronously before `seq.handleCheck()`. Since `handleSeqInput` updates `seqEntriesRef` synchronously, `handleCheck` will see the flushed entry.
3. Keep the existing `.answer-btn-pending` styling as-is — it's still a helpful visual cue.

Edge cases to handle:
- **Double-check**: second Check press after flush should no-op (handled by existing `seqEvaluatedRef.current` guard).
- **Flush with empty pending**: no-op.
- **Batch input path**: `handleSeqBatch` already replaces entries wholesale — pending state should be cleared there too (flush before batch too, or just skip since batch is unambiguous).

### Open questions
- Is commit-on-Check enough, or should we *also* strengthen the visual "pending" state (e.g. show the pending letter as a provisional chip in the collected-entries row)? I lean toward just commit-on-Check — simpler, fixes the reported bug directly. The pending outline on the button already exists.
	- ⚡️start with commit-on-check
- Should tapping a letter auto-commit after a short timeout (e.g. 300ms with no accidental)? Probably no — it fights the "tap letter then accidental" flow. Stick with explicit Check.
	- ⚡️right. No auto-commit. 
