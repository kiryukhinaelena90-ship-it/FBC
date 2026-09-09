const REQUEST_SCHEMA = 'FBC_P1_COCKPIT_REQUEST_1.0';
const RESPONSE_SCHEMA = 'fbc_decision_payload_v1';

function json(res, status, body) {
  res.status(status);
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  return res.send(JSON.stringify(body));
}

function parseBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string' && req.body.trim()) return JSON.parse(req.body);
  return null;
}

function validateRequest(body) {
  const errors = [];
  if (!body || typeof body !== 'object') return ['body_missing'];
  if (body.schema_version !== REQUEST_SCHEMA) errors.push('schema_version');
  if (body.mode !== 'owner_employee') errors.push('mode');
  for (const key of ['owner', 'employee', 'operating_costs', 'financing']) {
    if (!body[key] || typeof body[key] !== 'object') errors.push(key);
  }
  if (body.owner) {
    for (const key of ['price', 'billable_hours_month', 'monthly_target']) {
      if (!Number.isFinite(Number(body.owner[key]))) errors.push(`owner.${key}`);
    }
  }
  if (body.employee?.direct_billing) {
    for (const key of ['customer_price', 'billable_hours_month']) {
      if (!Number.isFinite(Number(body.employee[key]))) errors.push(`employee.${key}`);
    }
  }
  return [...new Set(errors)];
}

function validateResponse(payload) {
  if (!payload || typeof payload !== 'object') return ['payload_missing'];
  const errors = [];
  if (payload.schema_version !== RESPONSE_SCHEMA) errors.push('schema_version');
  for (const key of ['current', 'recommendation', 'target_path', 'post_decision', 'break_even', 'financing', 'production_meta']) {
    if (!payload[key] || typeof payload[key] !== 'object') errors.push(key);
  }
  return errors;
}

function backendUrl() {
  if (process.env.R_BACKEND_ANALYZE_URL) return process.env.R_BACKEND_ANALYZE_URL;
  if (!process.env.R_BACKEND_URL) return null;
  return process.env.R_BACKEND_URL.replace(/\/$/, '') + '/analyze';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('allow', 'POST');
    return json(res, 405, { error: 'method_not_allowed' });
  }

  let body;
  try {
    body = parseBody(req);
  } catch {
    return json(res, 400, { error: 'invalid_json' });
  }

  const requestErrors = validateRequest(body);
  if (requestErrors.length) {
    return json(res, 422, { error: 'invalid_fbc_request', fields: requestErrors });
  }

  const target = backendUrl();
  if (!target) {
    return json(res, 503, {
      error: 'r_backend_not_configured',
      message: 'Set R_BACKEND_ANALYZE_URL or R_BACKEND_URL in Vercel Environment Variables.'
    });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 55000);
  const headers = {
    'content-type': 'application/json',
    'accept': 'application/json',
    'x-fbc-proxy': 'vercel'
  };
  if (process.env.R_BACKEND_API_KEY) {
    headers.authorization = `Bearer ${process.env.R_BACKEND_API_KEY}`;
  }

  try {
    const upstream = await fetch(target, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: controller.signal
    });

    const text = await upstream.text();
    let payload;
    try {
      payload = text ? JSON.parse(text) : null;
    } catch {
      return json(res, 502, {
        error: 'r_backend_non_json',
        upstream_status: upstream.status
      });
    }

    if (!upstream.ok) {
      return json(res, 502, {
        error: 'r_backend_error',
        upstream_status: upstream.status,
        upstream: payload
      });
    }

    if (
  payload?.status === 'target_not_reachable' &&
  (!payload.financing || typeof payload.financing !== 'object')
) {
  payload.financing = {
    active: false,
    status: 'not_evaluated_for_target_not_reachable',
    current: null,
    alternative: null,
    comparison: null,
    note: 'Finanzierung bleibt getrennt vom operativen Ergebnis.'
  };
}
    
    const responseErrors = validateResponse(payload);
    if (responseErrors.length) {
      return json(res, 502, {
        error: 'invalid_r_payload',
        fields: responseErrors,
        expected_schema: RESPONSE_SCHEMA
      });
    }

    return json(res, 200, payload);
  } catch (error) {
    if (error?.name === 'AbortError') {
      return json(res, 504, { error: 'r_backend_timeout' });
    }
    return json(res, 502, {
      error: 'r_backend_unreachable',
      message: String(error?.message || error)
    });
  } finally {
    clearTimeout(timer);
  }
}
