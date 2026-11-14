# Release hygiene

Canonical identity: Lotvale. Purpose: supplier quotes into feasible buying plans and supplier-specific order drafts. Public source: https://github.com/ShalyX/lotvale.

Completed: MIT license, setup instructions, matching favicon/social card, standard Next.js migration, Node 24 pin, encrypted preview-only SERV key, protected Vercel review preview. Source and the initial Git history were scanned against the configured key; 71 tracked paths and 25 compiled browser assets contained no secret matches. Only the placeholder .env.example is tracked. Local environment, Vercel state, dependencies and build output are ignored.

A connector incorrectly classified a requested preview as production; that build was canceled before completion. The successful CLI deployment has target null (preview). No production promotion was performed. The earlier private host is superseded for review; it was not deleted.

Open release gates: hosted visual inspection; mobile overflow reinspection; browser backup restore; public judge access; final video; official form and authorized X post/submission. This review preview is not a judge-ready public release.
