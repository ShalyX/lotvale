# Email verification and recovery QA

Production: https://lotvale.vercel.app, deployment dpl_3DPUCxyJNhdKmBvBAh8QBH131p7a (2026-11-14).

Email ownership is required. Signup and unverified sign-in send OTP emails; verification automatically starts a session. Existing unverified accounts can request a code at /auth/verify-email. Business APIs reject unverified identities and request fresh provider session validation. Password reset revokes existing sessions. No customer records or ownership IDs were changed.

Actual browser acceptance passed: new account -> verification screen -> wrong code rejected -> correct code from delivered email -> business setup. Unverified account received 401 from business API. Actual reset email -> delivered link -> matching new password -> success screen with token removed from address -> new-password sign-in. Old password and prior session rejected (401); saved cloud purchase recovered; reused reset token rejected. Missing-token route gives a recovery message and no password form. Mobile verification at390px had no horizontal overflow. See auth-browser-acceptance.json and auth-*.png.

All 11 verified-account business API groups passed in business-acceptance.json. All15 planner/export tests passed. Production build and TypeScript passed. Final anonymous sample builds755.08; actual anonymous SERV extraction returned200 with four unconfirmed offers and a provider request ID (auth-demo-regression.json).

A separate automated fresh-mailbox repetition passed the unverified-access check but timed out reading its QA inbox. It is retained in auth-email-acceptance.json as a failed repetition, separate from the completed browser checks. The optional scripts/test-auth-email.mjs uses bounded network waits and records failures; no automated-email pass is claimed for that run. The disposable inbox service is [Mail.tm](https://mail.tm), used solely for fictional QA identities. No email codes, password/reset tokens or mailbox credentials are included in these reports.

Current sender: auth@mail.myneon.app, application name Lotvale. Delivery was observed in the QA inboxes; inbox placement at other providers and production email volume remain untested. Configure dedicated SMTP before a broad rollout per the [Neon production checklist](https://neon.com/docs/auth/production-checklist). One owner per business remains the supported model.
