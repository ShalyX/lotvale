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
