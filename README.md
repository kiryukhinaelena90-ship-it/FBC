# FUTURE Business Cockpit — v7.3 GitHub release candidate

This package is a **preview/release candidate**, not a production payment release.

## Included
- `index.html` — current navy/steel redesign with unified typography.
- Absicherung layout fix: Rentenversicherung has more width; Private Versicherungen sits directly next to it.
- Scenario panel: no decorative outer border; light decision surface; steel-blue slider.
- Inactive payment preview: cool-neutral only, no gold.
- GA4 Google tag: `G-RZXWPLS4J4` + basic Cockpit events (`calculation_start`, `calculation_complete`, `mode_*`, `traffic_source`).
- Instagram footer link: `@futurebusinesscockpit`.
- LinkedIn remains intentionally unconfigured until the exact Company Page URL is confirmed.
- Telegram Mini App SDK remains in `index.html`.
- Vercel API adapters for Telegram support (`/api/telegram-webhook`, `/api/telegram-setup`).

## Telegram status
The frontend points to `https://t.me/FutureBusinessCockpitBot`. The Vercel webhook/setup code is included, but it becomes live only after deployment and environment variables are configured and `/api/telegram-setup?key=...` is run once.

Required environment variables:
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_SETUP_KEY`
- `TELEGRAM_SUPPORT_CHAT_ID`
- `COCKPIT_URL`

Never commit real secret values to GitHub.

## Telegram Stars status
**Not enabled in this candidate.** The handoff requires server-side entitlement checks and a separately approved Stars price. This package rejects `pre_checkout_query` rather than pretending payment is active.

Before enabling Stars, implement/test: initData validation, invoice endpoint, payment status/entitlement store, successful_payment storage, exact calcId unlock, `/paysupport`, `/terms`, and final Stars prices.

## Analytics / privacy
GA4 is included because it is part of the v6 handoff. Before public production, review/update Datenschutz for analytics and verify Realtime/DebugView. The site remains `noindex,nofollow` and `robots.txt` blocks crawlers.

## Deploy order
1. Push this folder to a new GitHub preview branch (do not overwrite the known production/manual-deploy baseline).
2. Deploy preview on Vercel.
3. Configure environment variables.
4. Run Telegram setup endpoint once.
5. Test `/start`, menu button, text/photo/document forwarding, and support reply round trip.
6. Test DE/RU, mobile, Solo/Employee/Team formulas against the control baseline.
7. Verify GA4 Realtime/DebugView.
8. Only then decide domain switch / production release.


## v7.4 Telegram Stars test flow

Implemented for Telegram Mini App testing:
- Mitarbeiter: **50 Stars** (`XTR`)
- Team: **150 Stars** (`XTR`)
- `/api/telegram-stars-invoice` validates Telegram Mini App `initData` and creates the invoice.
- `/api/telegram-webhook` validates `pre_checkout_query`, records `successful_payment` and stores `telegram_payment_charge_id`.
- `/api/telegram-payment-status` validates the Telegram user and returns entitlement for `user + scope + calcId`.
- `/paysupport` and `/terms` are available in the bot.
- GA4 events: `paywall_click`, `stars_payment_complete`.

### Required Vercel Environment Variables
Do **not** commit secret values. Configure in Vercel Project Settings → Environment Variables:
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_SETUP_KEY`
- `TELEGRAM_SUPPORT_CHAT_ID`
- `COCKPIT_URL` (the Vercel preview URL during test; later `https://futurebusinesscockpit.de`)
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

The two Upstash variables provide persistent entitlement storage. A compatible Vercel/Upstash REST KV using `KV_REST_API_URL` and `KV_REST_API_TOKEN` is also accepted.

### After deploy
1. Open `https://<your-vercel-preview>/api/telegram-setup?key=<TELEGRAM_SETUP_KEY>` once.
2. Open the bot and `/start`.
3. Open Cockpit from the bot (payment cannot be tested as a normal browser page).
4. Test 50 Stars Mitarbeiter and 150 Stars Team.
5. Verify `/paysupport`, successful-payment confirmation and reopen entitlement.
6. Verify GA4 `paywall_click` and `stars_payment_complete`.

### Security boundary
The Stars transaction and entitlement check are server-side. The current legacy calculation engine still calculates Employee/Team values in the browser, so this package is suitable for **payment-flow beta testing**, but it is **not yet the final secure paid-result architecture** described in the handoff. Before public monetization, paid final Employee/Team results should be returned only after server-side entitlement verification.
