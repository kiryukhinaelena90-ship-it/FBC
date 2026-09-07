# FUTURE Business Cockpit — R integration

## Production path

Frontend -> `POST /api/analyze` -> Vercel proxy -> R backend -> `fbc_decision_payload_v1` -> `FBC_R_BACKEND_ADAPTER.applyPayload()`.

The browser does not contain a production recommendation fallback. If the R backend is unavailable or returns an invalid payload, the request fails visibly.

## Vercel environment variables

Set one of:

- `R_BACKEND_ANALYZE_URL=https://<r-host>/analyze` (preferred, exact endpoint), or
- `R_BACKEND_URL=https://<r-host>` (proxy appends `/analyze`).

Optional:

- `R_BACKEND_API_KEY=<secret>` -> sent as `Authorization: Bearer <secret>` from Vercel to R.

Do not expose these values in `index.html`, GitHub, or Telegram frontend code.

## Request

Schema: `FBC_P1_COCKPIT_REQUEST_1.0`

Current production mode: `owner_employee`.

Frontend metadata:

- `fbc_version=FBC_USER_BASE_R1`
- `locale=de|ru`
- `mode=owner_employee`

The factual browser bridge sends owner capacity/billable hours, employee paid/billable hours, 10 operating-cost lines, financing, legal form and target. Evidence/config fields stay separate from ordinary form fields.

See `contracts/fbc_p1_request_example.json`.

## Response

Required schema: `fbc_decision_payload_v1`.

The Vercel proxy rejects a 2xx response that is missing these top-level objects:

- `current`
- `recommendation`
- `target_path`
- `post_decision`
- `break_even`
- `financing`
- `production_meta`

See `contracts/fbc_decision_payload_minimal_example.json`.

## Ownership of calculations

Browser JS may provide immediate factual/current-state UX and validation. R is authoritative for forecast, Monte Carlo, sensitivity, optimizer recommendation, target path, break-even, liquidity/capital service, P2 assurance/audit and the final report values.
