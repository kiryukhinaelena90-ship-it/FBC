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
