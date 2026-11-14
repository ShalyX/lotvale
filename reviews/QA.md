# QA checkpoint

Fifteen planner/export tests pass. The standard Next.js production build passes. This replaces the earlier Worker runtime.

Browser checks on the earlier runtime, using the same purchase interface and planner:
- Sample complete plan: Counter Supply, $755.08.
- Selected split plan: $766.69, split into Counter Supply $326.80 and Westbridge Goods $439.89; actual downloaded TXT inspected.
- Real SERV Harbor Paper import: four matching offers, buyer confirmation, complete plan $724.55.
- Budget changed to $700: old selection invalidated and $24.55 over-budget result displayed.
- Actual JSON backup downloaded and inspected.

The initial extraction misclassified separately added tax. Clarified instructions and strict provider JSON schema fixed the same fixture. Missing-term and injection cases preserve unresolved terms; incompatible products are rejected. Detailed responses are stored alongside this file.

Hosted Node 24 release: build READY; authenticated landing and workspace HTML returned 200; actual API returned 200 with all four expected offers, freight/tax and unconfirmed status. Evidence: vercel-extraction.json.

Remaining verification: hosted browser flow, mobile overflow reinspection, and browser file-restore roundtrip. Desktop/mobile captures record the earlier local runtime and must not be described as hosted-release screenshots. Demo video and official submission are not complete.

Public production release 2026-11-14: https://lotvale.vercel.app. Anonymous landing and extraction both returned 200; four expected Harbor Paper offers, freight and tax preserved (public-release.json). Public browser sample produced $755.08 and final screenshot public-plans.jpg. Hosted split order drafts were $326.80 + $439.89. Mobile at 390x844: document/body width 375 within viewport, no document overflow. Temporary viewport reset. Backup restore remains unverified: upload automation timed out, followed by an inconsistent confirmation-dialog response. No restore success claimed.

API rate-limit probe with invalid inputs: 400 for allowed requests, then firewall 403 for excess requests; no provider calls in this probe.
