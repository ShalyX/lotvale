# Design specification

Product-specific direction: a buyer's working desk, with supplier documents on the left and the complete order on the right. Keep source terms and arithmetic inspectable. No agent console, chat-first flow, decorative analytics, fake activity, or stock photos.

Routes: / is a concise product introduction with an actual illustrative basket and two clear entrances (sample purchase / empty purchase). /app is the complete local workspace. Top bar: identity, local-save status, backup actions. Compact left rail: purchase name, quantities and buying constraints. Main area: Quotes -> Buying plans -> Order drafts, with counts. A visible sample label persists whenever fictional data is loaded.

Quotes: supplier summary rows with commercial terms; source/review editor in a modal, explicit field labels and confirmation. Import/paste modal includes supported formats and provider disclosure. Empty state guides adding basket items first. Loading explains quote interpretation. Error preserves input and offers retry/manual entry. Unknown terms are blank, never silently zero.

Plans: prominent chosen/recommended plan with landed total, budget headroom, latest delivery and supplier count; compare alternatives in a compact table. Cost breakdown and per-item allocations under the selected plan. A price-only reference visibly excludes commercial terms and is labeled accordingly. Infeasible state lists actual blockers and directs to the corresponding inputs; never suggests a relaxation was already approved.

Drafts: buyer details, separate supplier order sections with packs/units/price, tax/freight/total, source quote reference and deadline; clearly marked DRAFT, with text/CSV downloads and print layout. Quote edits or requirement changes invalidate plan selection.

Responsive: desktop has a 245px brief rail and flexible working sheet; below 1000px use a compact brief band; below 640px stack fields, use horizontal step tabs and scroll only tables, never the whole page. Controls >=40px touch area. Visible focus, semantic headings/tables/labels, dialog focus/escape handling. Reduced motion removes entry fades. No ambient motion. Response motion limited to brief status and selected allocation changes, 140–180ms.

Functional references inspected as text/product docs on 2026-11-13: PROCAI quote-upload/comparison flow; Fairmarkit side-by-side commercial fields; Keelvar complete constrained award concepts. Their embedded demos were not played; no claim of video/UI visual inspection. Synthesize their workflow lessons, not branding. Final rendered Lotvale must be inspected on desktop and mobile.

Asset strategy: authored SVG identity and a real data-driven allocation sheet. Decorative imagery would add no buying information and is omitted. Loading, blocked, sample, verified extraction, draft and export states have distinct wording.
