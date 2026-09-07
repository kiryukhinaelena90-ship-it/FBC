# FUTURE Business Cockpit — GitHub / Vercel R-ready release

Baseline: user-supplied `index(20260907-103125)(1).html` from 2026-09-07.

This release keeps that HTML as the UI baseline and applies only the release fixes required for R integration:
- one active definition each for employeeReady/updateEmployee/updateCompany;
- employee and Team billable customer hours are explicit factual inputs;
- cost-oriented employee/customer rate has no artificial +10% markup and is available immediately from region + role + employment form using the orientation midpoint and schedule reference;
- current employee/team revenue uses confirmed billable hours, not available hours;
- P0 / P1 / P2 / Kapitaldienst / R adapter retained;
- R charts have explicit X/Y units;
- PDF prints a dedicated report surface, not the full page;
- Telegram Stars, Telegram Mini App, Instagram and GA4 retained;
- Naive/Linear/scenarioCalc/local optimizer legacy remnants absent.

R endpoint expected by frontend: `POST /api/analyze`.
The Vercel Telegram endpoints remain under `/api/telegram-*`.
Secrets must remain in Vercel Environment Variables, never in frontend/GitHub.

## R API integration stage 1

Added `api/analyze.js` as the same-origin Vercel proxy for the real R backend.

- Frontend POST target remains `/api/analyze`.
- Proxy validates `FBC_P1_COCKPIT_REQUEST_1.0`.
- Proxy forwards only to the server-side configured R endpoint.
- Proxy validates `fbc_decision_payload_v1` before returning it to the browser.
- No local recommendation fallback is used.
- Frontend request now includes `fbc_version`, `locale`, and `mode=owner_employee`.

See `docs/R_INTEGRATION.md` and `contracts/`.

The R host itself is not bundled into Vercel. The canonical production runner is `39_run_real_production_export.R`, which loads the validated production modules and produces the decision payload. The R service must own MC data paths and other server-only configuration.
