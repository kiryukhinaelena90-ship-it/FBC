# FUTURE Business Cockpit — v7.4 Stars Test

Current working repository for the FUTURE Business Cockpit preview and Telegram Mini App payment-flow testing.

> **Status:** Preview / beta test. Not yet the final production monetization release.

## Current product status

- DE/RU Business Cockpit
- Modes: Solo, Mitarbeiter, TeamCheck
- Current navy / steel visual system
- Unified typography with lighter financial-result numerals
- Compact `Kostenorientierter Kundenpreis` layout
- Light `Was wäre, wenn?` decision layer with steel-blue sliders
- Neutral inactive / disabled states
- `Absicherung` layout adjusted so long Rentenversicherung options fit more cleanly
- Instagram footer link prepared
- LinkedIn intentionally left unconfigured until the final Company Page URL is confirmed
- GA4 integrated
- Telegram Mini App integration prepared for Vercel

## Telegram bot

Frontend points to:

`https://t.me/FutureBusinessCockpitBot`

Included API routes:

- `/api/telegram-setup`
- `/api/telegram-webhook`
- `/api/telegram-stars-invoice`
- `/api/telegram-payment-status`

The bot becomes connected to the current Vercel deployment only after the Vercel Environment Variables are configured and the setup endpoint is run once.

## Telegram Stars beta pricing

Current test prices:

- **Mitarbeiter-Auswertung: 50 ⭐**
- **Team-Auswertung: 150 ⭐**

Payment currency: Telegram Stars (`XTR`).

Implemented beta flow:

1. User opens the Cockpit from Telegram.
2. Mini App sends validated Telegram `initData`.
3. Backend creates a Stars invoice.
4. Telegram sends `pre_checkout_query`.
5. Backend confirms a valid checkout.
6. Telegram sends `successful_payment`.
7. Backend stores the entitlement for the exact `user + scope + calcId`.
8. Cockpit checks payment status and unlocks the corresponding paid state.
9. `/paysupport` and `/terms` are available through the bot.

## Important security boundary

The **Stars transaction and entitlement check are server-side**.

However, the current legacy Employee/Team calculation engine still calculates values in the browser. Therefore v7.4 is suitable for **real payment-flow beta testing**, but it is **not yet the final secure commercial paywall**.

Before broad public monetization, final paid Employee/Team results should only be delivered after server-side entitlement verification.

## Required Vercel Environment Variables

Never commit secret values to GitHub.

Configure these in:

**Vercel → Project Settings → Environment Variables**

Required:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_SETUP_KEY`
- `TELEGRAM_SUPPORT_CHAT_ID`
- `COCKPIT_URL`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

Compatible Vercel / Upstash REST KV variables may also be used:

- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

During testing, `COCKPIT_URL` should point to the Vercel preview URL. Switch it to `https://futurebusinesscockpit.de` only after the preview has passed testing.

## Google Analytics 4

Measurement ID:

`G-RZXWPLS4J4`

Prepared / included Cockpit events:

- `calculation_start`
- `calculation_complete`
- `mode_solo`
- `mode_employee`
- `mode_team`
- `paywall_click`
- `stars_payment_complete`
- source / traffic tracking

Before production, verify events in GA4 Realtime / DebugView and update the privacy text accordingly.

## Social links

Instagram:

`@futurebusinesscockpit`

LinkedIn:

Not configured yet. Add the final Company Page URL only after the official page is confirmed.

Social links should remain a restrained trust / contact layer in the footer, not a dominant element inside the calculator.

## Indexing

The current test version remains:

`noindex,nofollow`

`robots.txt` also blocks crawling.

Do not open indexing until legal pages, payment/privacy handling and release checks are complete.

## Test sequence after Vercel deploy

1. Configure all required Vercel Environment Variables.
2. Run once:

   `https://<vercel-preview>/api/telegram-setup?key=<TELEGRAM_SETUP_KEY>`

3. In Telegram, open `@FutureBusinessCockpitBot`.
4. Test `/start`.
5. Open the Cockpit using the bot / Mini App button.
6. Test text, photo and document support flow.
7. Test owner reply back to the user.
8. Test **50 ⭐ Mitarbeiter** payment.
9. Confirm `successful_payment`.
10. Close and reopen the Mini App and confirm entitlement persists.
11. Test **150 ⭐ Team** payment.
12. Test `/paysupport`.
13. Test `/terms`.
14. Verify GA4 events.
15. Regression-test Solo / Mitarbeiter / TeamCheck in DE and RU, desktop and mobile.

## Production release gate

Do not treat the current repository as final production until these are complete:

- payment-flow test with real Telegram Stars
- persistent entitlement test
- full Telegram support reply test
- formula regression test
- legal placeholders / Impressum / Datenschutz / payment terms
- GA4 privacy review
- final domain switch
- Telegram Cockpit URL switch
- final mobile QA

## Repository rule

This repository is now the active working repository for the current Cockpit version.

Avoid mixing old archived local folders or obsolete HTML snapshots into this repository. Keep secrets out of GitHub and use Vercel Environment Variables for backend credentials.
