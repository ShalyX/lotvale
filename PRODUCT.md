# Lotvale — locked product, revision 1

Decision origin: user selected purchase planning on November 13, 2026. This document specifies that selected thesis; it does not change it.

Purpose: help a small buyer turn supplier quotes into a feasible buying plan and useful order drafts. User: an occasional buyer at a small business, with a known basket and quotes already in hand. Promise: understand the complete purchase before placing it. Payoff: choose a complete basket that satisfies the stated budget and deadline, then export the supplier orders.

Entry -> sample or new purchase -> specify requirements -> import/paste quotes -> review and correct extracted terms -> compare complete plans -> adjust requirements and recalculate -> select plan -> edit buyer details -> export supplier-specific draft orders and comparison data. Purchase decisions remain with the buyer. Supplier acceptance and inventory are outside the product's knowledge.

P0 coverage contract:

| ID | User value and acceptance | Surface / implementation | Status |
|---|---|---|---|
| P0-1 | Create/edit title, currency, budget, deadline and up to six basket items with quantities | Purchase brief, lib/schema.ts | IMPLEMENTED |
| P0-2 | Import text/CSV, paste quote terms, and use real SERV to map terms into reviewable supplier offers | Quotes, /api/extract | IMPLEMENTED |
| P0-3 | Review source text and edit prices, pack sizes, MOQ, tax, freight, delivery and validity; explicitly confirm terms before inclusion | Quote editor | IMPLEMENTED |
| P0-4 | Compare complete single/split-supplier baskets using pack rounding, supplier minimums, freight, tax, validity, currency, budget and arrival constraints | Plans, lib/planner.ts | IMPLEMENTED |
| P0-5 | Change buying constraints, recalculate and explain exclusions or impossible requirements | Brief + Plans | IMPLEMENTED |
| P0-6 | Select plan and export real supplier-specific draft orders plus CSV comparison | Drafts, lib/exports.ts | IMPLEMENTED |
| P0-7 | Persist purchase locally, export/import project backup, start fresh without losing the saved purchase by accident | Browser storage / backups | IMPLEMENTED; browser restore verification inconclusive |
| P0-8 | Complete responsive and accessible entry-to-export flow with loading, error, empty and recovery states | All product surfaces | IMPLEMENTED; bounded desktop/mobile QA, not exhaustive accessibility audit |

First-release model: one ISO currency per purchase, integer quantities, up to six items and six supplier quotes, at most one offer per supplier/item, each item's demand assigned to one supplier (different items can go to different suppliers). Offers are pack-priced; minimum pack quantities and whole-supplier merchandise minimums apply. Tax is an explicitly confirmed percentage on merchandise plus freight. No assumed currency conversion or inferred tax policy. Every unknown commercial field stays editable and blocks confirmation until resolved. Document source snippets are preserved.

Differentiators to retain: complete basket instead of isolated cheapest lines; visible cost/arrival/supplier tradeoffs; source-backed editable terms; useful supplier order drafts; requirement changes can alter the chosen basket. These are workflow choices, not claims of technical novelty.

SERV interprets quote language and maps it to the buyer's basket. Deterministic code calculates money and evaluates combinations. Tests exercise these capabilities; neither tests nor an agent-management console become the product.

Non-goals: supplier discovery, autonomous payments, dispatching orders/emails, enterprise ERP, legal/tax advice, real-time inventory guarantees. Text/CSV and pasting extracted PDF text are supported at launch; binary PDF import is a follow-up unless implemented and verified. No promise of OCR in this lock.

## Approved extension — business workspace, revision2

User approved business accounts, cloud-saved purchases and a purchase overview on November14, preserving the public judge/sample route. Adds managed account signup/sign-in, owner-managed business defaults, multiple cloud purchases, explicit save, optimistic revisions and saved workflow state. No team invitations or approval chains in this slice. Existing purchase-planning purpose and non-goals remain. Acceptance evidence: reviews/business-acceptance.json; browser evidence and deployment verification pending final release.
