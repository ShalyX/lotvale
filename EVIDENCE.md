# Evidence registry

All suppliers, buyers and prices in QA and the film are fictional. No customer savings, demand, revenue or supplier acceptance is claimed.

| Claim | Evidence | Limit |
|---|---|---|
| Current judge release | [Final judge rehearsal](reviews/FINAL-JUDGE-REHEARSAL.md), [live app](https://lotvale-cyan.vercel.app), [public film](https://lotvale-cyan.vercel.app/demo) | Point-in-time checks, not an independent security audit |
| Whole-order planning and exports | 15 planner/export tests; complete on-time sample $755.08; downloaded draft | Up to six items/quotes, one currency, supported tax basis |
| Real SERV interpretation | Film request chatcmpl-Ek5KuMqkkjzb3mOmHwDVfYJMFdZFe returned 200 with four unconfirmed offers; current fresh request in final rehearsal | Synthetic text; source review and confirmation required |
| Business storage and isolation | [Business QA](reviews/BUSINESS-QA.md), business-acceptance.json (11 groups) | Single owner; explicit save; bounded acceptance |
| Email verification and recovery | [Auth QA](reviews/AUTH-QA.md), delivered OTP and reset link; old password/session and reset replay rejected | Shared Neon sender; broader-provider inbox placement untested; separate automated inbox retry failed and remains recorded |
| Backup and restore | Current final browser roundtrip in [final rehearsal](reviews/FINAL-JUDGE-REHEARSAL.md) | Restore replaces the browser-local purchase after confirmation |
| Public API bounds | Six requests/minute/IP firewall; rate-limit.json | Provider credits needed; no global spending cap |
| Film provenance | [Demo sources](demo/README.md), actual SERV review/plan/draft and business save | Shortened waits; held recorded evidence; all data fictional |
| Film integrity | 120s, 1080p30 H.264/AAC; full decode and normal-speed playback; SHA-256 in [DEMO.md](DEMO.md) | Source re-render may differ with browser/fonts |

Historical reports under reviews describe their dated release and observations. Where older QA says restore inconclusive, film pending, verification off or deployment pending, use the newer specific evidence above. No X publication or form receipt is inferred from these tests.
