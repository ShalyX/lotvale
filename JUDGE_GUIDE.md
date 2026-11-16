# Try Lotvale

Start with the [two-minute story](https://lotvale-cyan.vercel.app/demo). The page includes the film, transcript, source and live product links. Then try the product yourself. All suppliers and prices below are fictional.

## Complete a purchase without an account

1. Open [the sample](https://lotvale-cyan.vercel.app/app?sample=1). Review the four-item café basket, $850 budget and deadline.
2. Inspect Supplier quotes. Moss has lower pack prices but arrives after the required date.
3. Choose **Build buying plans**. The lowest complete on-time basket is **$755.08**, including freight and tax. This is a fictional example, not measured customer savings.
4. Choose **Prepare order drafts** and download the supplier draft or comparison CSV. Nothing is sent to a supplier.
5. **Backup** downloads the purchase JSON. **Restore** accepts that file after a confirmation; back up existing browser work before replacing it.

## See the real SERV Reasoning step

1. Download the [two-quote starting purchase](https://lotvale-cyan.vercel.app/api/demo?kind=before-import) and [Counter Supply text quote](https://lotvale-cyan.vercel.app/api/demo?kind=quote). Both use dates relative to today, so the walkthrough remains usable after the recording date.
2. Open [the buying desk](https://lotvale-cyan.vercel.app/app), use **Restore**, select the JSON and confirm replacement. It contains Moss and Westbridge, with Counter deliberately absent.
3. Choose **Add quote**, import the Counter text file and choose **Interpret quote**. The server calls SERV Reasoning; this is a fresh request, not a replay.
4. Review the returned terms: pack prices $14.00/$7.50/$5.20/$12.00; pack sizes 100/100/100/500; freight $28; tax 7.5%; merchandise minimum $0; delivery before the deadline. Expand **Original quote text** and check the source. Correct any missing or inaccurate field.
5. Tick the review confirmation and **Save reviewed quote**. Build buying plans. The expected lowest complete on-time basket is **$755.08**. Choose it and export the draft.

Public interpretation permits six requests/minute/IP and depends on available SERV credits. If throttled or unavailable, use the reviewed sample or manual terms entry. Text/CSV and pasted PDF text are supported; binary PDFs and OCR are not. A model result is never auto-approved.

## Business workspace

Optionally [create an account](https://lotvale-cyan.vercel.app/auth/sign-up), verify the emailed six-digit code, set business defaults and create a purchase. Use **Save purchase**, return to the overview, then reopen the purchase. Cloud save is explicit. The owner account is required; the public sample stays independent. Password reset uses a delivered email link. The current shared Neon sender works in tested QA inboxes; broad-provider inbox placement is untested.

[Evidence](EVIDENCE.md) · [Final rehearsal](reviews/FINAL-JUDGE-REHEARSAL.md) · [Scope](PRODUCT.md). SERV interprets quote language; code calculates complete baskets; the buyer decides.
