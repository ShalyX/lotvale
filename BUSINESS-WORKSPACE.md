# Business workspace implementation brief

Approved extension: real business accounts, cloud-saved purchases and a purchase overview. Purpose remains supplier quotes into feasible buying plans and supplier draft orders.

Keep `/app`, `/app?sample=1` and `/app?new=1` public and browser-local for judges. Add `/business` for the authenticated purchase overview and `/business/purchases/[id]` for cloud purchases using the existing editor. Never copy a sample or local purchase into an account without an explicit action.

One owner-managed business per authenticated user initially. Managed Neon Auth handles credentials and sessions. Server-only Postgres queries scope every business and purchase read/write to the authenticated owner. Purchase snapshots use the existing schema and optimistic revisions. A conflict must preserve edits and request reload, never overwrite silently. Cloud-save errors remain visible; local mode continues to use its existing storage key.

Overview: business name and purchasing defaults, New purchase, searchable purchase list with title, budget/currency, deadline, quote/review counts and last saved date. Empty state explains the first action. No invented revenue charts or supplier activity. Existing wine/chalk typography and ruled-list design extend into the business area.

Acceptance: sign-up/sign-in/sign-out, server route protection, business onboarding/update, create/open/edit/save/reopen purchases, second-session persistence, cross-account denial, conflict preservation, clear errors, responsive rendering, and public sample regression. No team roles, invitations, ordering or payment added.

Infrastructure: Neon project lingering-river-45343827; branch br-small-darkness-bbrxpwwi. An attempted five-minute suspend timeout was rejected by the account's settings; no autosuspend claim. No product completion claimed before acceptance checks.
