---
date: 2026-04-09
type: convention
area: design
status: active
---

Use Stack, Card, and Section components for layout instead of one-off CSS classes with margin/padding. Stack owns vertical spacing via gap; Card owns containment (bg + border + padding); Section owns heading-to-content gap. Raw flex-column + gap is only needed for horizontal layout or non-uniform gaps. Toggle buttons always use .toggle-btn base class plus a variant class.
