# Public release hygiene

Canonical product: Lotvale. [Public app](https://lotvale.vercel.app), [film](https://lotvale.vercel.app/demo), [source](https://github.com/ShalyX/lotvale). Standard Next.js on Node 24, original identity, MIT license for original code. Dependencies retain their own licenses.

Secrets, local QA accounts, applicant details, environment files, build output and dependencies remain outside Git. The rejected Antigravity Remotion prototype, reports and test voiceover are preserved locally but ignored by Git and excluded from Vercel. No user files were deleted and no Git history was rewritten.

The approved film renderer is under demo/. Large media lives in a checksum-verified GitHub Release asset, not repository history. The public site uses the released MP4 and poster; it never exposes the SERV key. Demo sources are excluded from the web build and deployment.

New public routes contain only fictional, date-relative fixtures and film assets. Existing business routes retain managed auth and owner-scoped queries. Per-IP extraction limiting remains six/minute; this is not a global spending cap.

Current clean-checkout build, tests, source/history/client-secret scan and final public access checks are in [final rehearsal](reviews/FINAL-JUDGE-REHEARSAL.md). X and form publication are separate external completion steps.
