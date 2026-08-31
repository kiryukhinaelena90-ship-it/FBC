# Handoff implementation status — v7.3

## Implemented / carried forward
- DE/RU and Solo / Mitarbeiter / TeamCheck structure.
- Telegram WebApp SDK and public bot link.
- Footer wording `Telegram · Feedback & Fragen`.
- `info@futurebusinesscockpit.de`.
- GA4 tag `G-RZXWPLS4J4` and basic Cockpit event hooks.
- Instagram profile link.
- noindex/nofollow and robots blocking for preview.
- Security response headers in `vercel.json` (nosniff, Referrer-Policy, Permissions-Policy).
- UI typography and result-weight cleanup.
- Compact Employee/Team Kundenpreis orientation.
- Empty/inactive state color cleanup.

## Prepared but requires deployment test
- Vercel Telegram webhook/setup adapters.
- Support reply flow.
- Telegram menu-button URL update.
- Source tracking via URL query (`start` / `utm_source`) into GA4.

## Not production-ready / intentionally not enabled
- Telegram Stars checkout.
- Secure Employee/Team paywall / server-side entitlement.
- Stars price.
- Final legal/payment terms and refund process.
- LinkedIn Company Page link (exact URL not yet confirmed here).
- Search Console ↔ GA4 linking (done in Google UI, not code).
- Public indexing/SEO landing publication.

## Required regression tests before production
Solo: hour/day auto rules, manual overrides, vacation, zero goal, VAT 19/7, negative/max inputs, DE/RU, mobile.
Employee: billable on/off, employment forms, wage orientation, Personalkosten, owner+employee totals, customer price logic.
Team: add/remove roles, billable/internal, price allocation, zero/nonzero goal, mobile.
Telegram: start, menu button, messages, photo/document, owner reply round trip.


## v7.4 Stars beta
- Functional Stars invoice/payment/status flow added.
- Prices: Employee 50 XTR, Team 150 XTR.
- Persistent payment entitlement requires Upstash/Vercel REST KV env.
- `/paysupport` and `/terms` added.
- Payment unlock is beta; calculation engine server-side extraction is still required before calling the paid-result paywall production-secure.
