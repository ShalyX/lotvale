# Focused code and product review

Scope: quote text -> real SERV -> validated, unconfirmed draft -> buyer confirmation -> deterministic complete basket -> order drafts. Product purpose retained; no test console or agent console replaces the buying journey.

Resolved findings:

- HIGH: provider returned semantically correct data with different field names. Added provider-enforced JSON schema in addition to Zod response validation; the live four-item fixture now passes.
- HIGH: net pricing and separately added tax were misclassified in the initial prompt. Clarified the distinction and tested the same quote successfully. Extraction is still reviewed, never assumed reliable in general.
- MEDIUM: manual offer fields defaulted to zero price and unit pack size. They now start unresolved, and schema/form validation requires the buyer to enter them.
- MEDIUM: editing a basket item specification could preserve confirmation of an old match. Specification/unit changes invalidate affected quote review.
- MEDIUM: the local API exception needed to be development-only. Production extraction requires the Sites-authenticated user header; the local-host exception is gated by the development build flag.
- MEDIUM: compact mobile backup button lost its accessible name. Added an explicit label.
- MEDIUM: mobile root overflow was observed. Tables retain independent horizontal scrolling; the document root clips lateral overflow. Reinspection pending after the correction.

Checks: request size and schema limits; fixed provider URL (no source-driven SSRF); rendered text rather than raw HTML; source excerpts checked against the input; no automatic quote approval; no order dispatch/payment endpoints; spreadsheet formula escaping in CSV; schema-validated versioned backups; file size/format checks; abort on closing an import; errors preserve input and offer manual recovery. Runtime secret stays server-side.

React review: client boundary limited to workspace components; landing page server-rendered; expensive planning memoized on planning inputs; no fetch on render; schema-versioned storage; modal focus trap and Escape close; form labels and button names; conditional UI preserves explicit empty/loading/failure states. No external analytics or unrelated third-party browser services added.

Limits: this is a focused implementation review, not an independent security audit. Public access and cross-host authentication need a separate review before changing the private deployment boundary. Customer outcome and production traffic behavior are unproven.
