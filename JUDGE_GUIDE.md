# Try Lotvale

Open https://lotvale.vercel.app and choose **Try a sample purchase**. No login is needed.

1. Review the fictional café basket, $850 budget and delivery deadline.
2. Open **Supplier quotes** to compare pack prices, freight, tax and dates. Moss has the lowest pack prices but arrives too late.
3. Click **Build buying plans**. The lowest complete on-time basket is $755.08. This is fictional demonstration data, not measured savings.
4. Choose **Prepare order drafts**. The Counter Supply draft carries the quantities and complete total through. Download it; the app does not send or place the order.
5. To try SERV, click **Add quote** and paste a supplier's text. Review every extracted term against its source, confirm the terms, then recalculate. Use text/CSV or pasted PDF text; binary PDF/OCR is not supported.

The production API permits six interpretation requests per minute per IP. If it is throttled or SERV is unavailable, the sample and manual quote entry remain available. Your purchase saves in this browser; **Backup** exports JSON and **Restore** loads a backup after confirmation.

Implementation/evidence: [README](README.md), [product scope](PRODUCT.md), [evidence](EVIDENCE.md), [QA](reviews/QA.md). SERV interprets text; code calculates plans; the buyer decides.

Business workspace: [Create an account](https://lotvale.vercel.app/auth/sign-up), enter business defaults, then create and reopen cloud purchases from [the overview](https://lotvale.vercel.app/business). Choose Save purchase to retain edits and the selected workflow. This is optional for judges; the sample above remains public and independent.
