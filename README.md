# Lotvale

**Make the whole order work.**

A cheap quote can still make a bad purchase. Pack quantities, minimum orders, freight and delivery dates change which basket you can actually buy.

Lotvale turns supplier quotes into complete buying plans and supplier-specific order drafts. It is built for small-business buyers who already have their quotes and need to make a decision.

## Use it

1. Set your basket, quantities, budget and deadline.
2. Paste supplier quotes or import text/CSV files.
3. Review the extracted terms against the original text. Correct anything missing or wrong, then confirm the terms.
4. Compare complete baskets by total cost, arrival date and supplier count.
5. Choose a plan and download supplier drafts or a comparison CSV.

The workspace saves in your browser. Export a JSON backup to move or recover a purchase. Draft orders are never sent to suppliers by the app.

## SERV Reasoning

The server calls the SERV Reasoning Chat Completions endpoint using `gpt-5.4-mini`. A provider-enforced JSON schema defines the quote contract; Zod validates the response independently. SERV matches quoted products to basket items and interprets pack prices and commercial terms. The buyer then reviews and confirms the draft.

The local planning engine evaluates item-to-supplier combinations. It performs pack rounding, applies per-item minimum packs and supplier merchandise minimums, adds freight and confirmed tax, and excludes unreviewed, expired, late or foreign-currency quotes. A comparison total is only as reliable as the entered supplier terms.

Provider documentation: [SERV API](https://docs.openserv.ai/serv-reasoning/api/chat-completions). Hackathon: [SERV Hackathon 02](https://www.openserv.ai/hackathon-2), Open Track.

## Run locally

Use Node.js 24 and npm.

```sh
npm ci
```

Create an ignored `.dev.vars` file at the project root:

```dotenv
SERV_API_KEY=your_key_here
```

Then run:

```sh
npm run dev
```

Open the printed local URL. The sample purchase works without a provider key; interpreting a new quote requires a valid SERV key and credits. For deployment, configure `SERV_API_KEY` as a server-side runtime secret. It must never be added to browser code.

```sh
npm run typecheck
npm test
npm run build
```

The application uses React, Vinext/Vite and a Cloudflare Worker. The Sites scaffold supplies its deployment, identity and connector infrastructure. Local API calls are allowed only in development; production extraction requires the authenticated identity supplied by Sites. Preserve that boundary when moving hosts.

## Supported commercial model

- Up to six basket items and six supplier quotes per purchase.
- One currency per purchase; no FX conversion.
- Each item's quantity is assigned to one supplier. Different items may go to different suppliers.
- Net pack prices, minimum packs, supplier merchandise minimum, freight, quote validity and delivery dates.
- A confirmed tax percentage applied to merchandise plus freight. Other tax bases and tax-inclusive quotes require manual resolution and are not automatically normalized.
- Text/CSV import and pasted text. Binary PDF import and OCR are not included; copy the text from a PDF instead.

The planner covers the modeled combinations, not every commercial negotiation. It does not verify inventory, execute payments, place orders, or prove supplier acceptance. Review current terms with suppliers before ordering.

## Evidence and data

The café sample and Harbor Paper QA quote are fictional, clearly labeled examples. The default sample's lowest complete on-time plan is $755.08; its $540.00 pack-price reference excludes commercial terms and uses a supplier that arrives late. These figures demonstrate the workflow, not real savings.

Fifteen deterministic tests cover complete baskets, budget and delivery constraints, pack rounding, minimums, expired/foreign/unreviewed quotes, missing charges, invalid inputs, and exported documents. Real SERV requests and browser checks are recorded under `reviews/`; see `EVIDENCE.md` for their limits. Customer demand and willingness to pay remain untested.

## Project files

- `PRODUCT.md`: approved purpose and required capabilities.
- `BRAND.md` and `DESIGN.md`: identity and interface decisions.
- `DEMO.md`: demo architecture and truthful payoff.
- `lib/planner.ts`: deterministic purchase planning.
- `app/api/extract/route.ts`: real SERV integration and response validation.

Built by ElseMade for SERV Hackathon 02. MIT license for original project code; third-party dependencies retain their own licenses.
