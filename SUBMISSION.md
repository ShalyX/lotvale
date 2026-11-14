# Lotvale — submission draft

Status: implemented and locally verified; Vercel review deployment in progress; not submitted.

## Short description

Turn supplier quotes into a complete buying plan and supplier-specific order drafts.

## Problem and product

A buyer receives three quotes. Each uses different pack quantities, freight charges, minimums and delivery terms. The lowest prices do not tell them whether the complete order will fit the budget or arrive on time.

Lotvale brings those terms into one editable workspace. The buyer specifies what they need, reviews the quoted details, compares complete baskets and exports the chosen supplier orders.

## What was built during the hackathon

A new purchase-planning app: purchase setup, text/CSV quote import, real SERV extraction, source-backed review, deterministic basket planning, requirement changes, supplier draft exports, CSV comparison, local persistence and project backups. Product definition, branding, interface and verification were created during Edition 02.

## How SERV powers it

SERV Reasoning interprets the supplier text and maps quoted products and commercial terms into a strict structured draft. The buyer checks the draft. Code calculates complete basket costs and evaluates the modeled combinations. Missing information stays unresolved until reviewed; a model response never approves a quote or places an order.

## Track

Open Track.

## Why someone would pay

The intended buyer is a small business operator who buys from several quotes without an enterprise sourcing system. A charging hypothesis is paid project exports or a small team subscription. No paid customer, revenue, measured savings or validated willingness to pay is claimed.

## Links and release checks

- Public repository: https://github.com/ShalyX/lotvale — public, verified.
- Live demo: https://lotvale-o4qyyal84-shalyxs-projects.vercel.app — protected review preview, not a public judge link.
- Demo video: PENDING production/QA.
- X submission post and post URL: PENDING explicit posting authorization.
- Official form fields/eligibility details: PENDING final interactive inspection.
- Submission receipt: NONE.

All demo suppliers and prices are fictional. No orders or payments have been executed.
