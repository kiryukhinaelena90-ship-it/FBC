const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const SETUP_KEY = process.env.TELEGRAM_SETUP_KEY;
const COCKPIT_URL = process.env.COCKPIT_URL;

async function tg(method, payload = {}) {
  const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!data.ok) {
    throw new Error(`${method}: ${data.description || "Telegram API error"}`);
  }

  return data.result;
}

export default async function handler(req, res) {
  try {
    if (!BOT_TOKEN) {
      return res.status(500).json({ ok: false, error: "Missing TELEGRAM_BOT_TOKEN" });
    }

    if (!SETUP_KEY) {
      return res.status(500).json({ ok: false, error: "Missing TELEGRAM_SETUP_KEY" });
    }

    if (!COCKPIT_URL) {
      return res.status(500).json({ ok: false, error: "Missing COCKPIT_URL" });
    }

    if (req.query?.key !== SETUP_KEY) {
      return res.status(403).json({ ok: false, error: "Forbidden" });
    }

    const publicBaseUrl = COCKPIT_URL.replace(/\/+$/, "");
    const webhookUrl = `${publicBaseUrl}/api/telegram-webhook`;

    await tg("setWebhook", {
      url: webhookUrl,
      allowed_updates: [
        "message",
        "callback_query",
        "pre_checkout_query",
      ],
    });

    await tg("setMyCommands", {
      commands: [
        { command: "start", description: "Business Cockpit / Support" },
        { command: "myid", description: "Meine Telegram Chat-ID anzeigen" },
        { command: "paysupport", description: "Hilfe zur Zahlung" },
        { command: "terms", description: "Zahlungsbedingungen" },
      ],
    });

    await tg("setChatMenuButton", {
      menu_button: {
        type: "web_app",
        text: "Cockpit öffnen",
        web_app: {
          url: publicBaseUrl,
        },
      },
    });

    return res.status(200).json({
      ok: true,
      webhookUrl,
      cockpitUrl: publicBaseUrl,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: String(error?.message || error),
    });
  }
}