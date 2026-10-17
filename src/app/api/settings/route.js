import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const CONFIG_FILE = path.join(DATA_DIR, 'panel_config.json');

const defaultSettings = {
  fivemEndpoint: process.env.FIVEM_ENDPOINT || 'http://127.0.0.1:30120/just_admin',
  apiKey: process.env.JUST_API_KEY || 'just-secret-token-12345',
  serverName: 'Los Santos Roleplay // Polish Official',
  serverEndpoint: '142.250.190.40:30120',
  maxPlayers: 128,
  oneSync: 'OneSync BigMode',
  tags: 'roleplay, polish, custom, esx, realistic, txadmin',
  gameBuild: '3095',
  rconPassword: 'super_secret_rcon_pass',
  steamApiKey: '1A2B3C4D5E6F708192A1B2C3D4E5F678',
  discordWebhook: 'https://discord.com/api/webhooks/12984192847192/just_admin_logs',
  crashAlertWebhook: 'https://discord.com/api/webhooks/12984192847192/just_crashes',
  pollingInterval: 3000,
  autoReconnect: true,
  syncTxAdmin: true,
  blockVpn: false,
  soundAlerts: true,
  theme: {
    brandColor: '#7c3aed',
    surfaceBase: '#09090b',
    surfacePanel: '#141418',
    borderRadius: '8px',
    enableGlow: true
  }
};

function getSettingsFromDisk() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(CONFIG_FILE)) {
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(defaultSettings, null, 2), 'utf-8');
      return defaultSettings;
    }
    const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSettings;
  }
}

function saveSettingsToDisk(settings) {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(settings, null, 2), 'utf-8');
  } catch {}
}

export async function GET() {
  const current = getSettingsFromDisk();
  const masked = {
    ...current,
    apiKeyMasked: current.apiKey ? `${current.apiKey.slice(0, 4)}••••••••` : '',
    rconPasswordMasked: '••••••••••••••••'
  };

  return NextResponse.json({ ok: true, settings: masked });
}

export async function POST(req) {
  try {
    const body = await req.json();

    if (body.action === 'test_connection') {
      const current = getSettingsFromDisk();
      const targetUrl = body.endpoint || current.fivemEndpoint;
      const targetToken = body.apiKey || current.apiKey;
      const startTime = Date.now();

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2000);

        const res = await fetch(`${targetUrl}/status`, {
          headers: { 'x-just-token': targetToken },
          signal: controller.signal
        });
        clearTimeout(timeout);
        const latencyMs = Date.now() - startTime;

        if (res.ok) {
          const payload = await res.json();
          return NextResponse.json({
            ok: true,
            status: 'online',
            latencyMs,
            serverName: payload.name || 'FXServer',
            message: `Connected successfully (${latencyMs}ms)`
          });
        }

        return NextResponse.json({
          ok: false,
          status: 'unauthorized',
          latencyMs,
          message: `Server returned HTTP ${res.status}. Check API Key.`
        });
      } catch (err) {
        return NextResponse.json({
          ok: false,
          status: 'offline',
          latencyMs: Date.now() - startTime,
          message: 'Could not reach FiveM bridge. Make sure just_admin resource is started.'
        });
      }
    }

    if (body.action === 'test_webhook') {
      const webhookUrl = body.url;
      if (!webhookUrl || !webhookUrl.startsWith('http')) {
        return NextResponse.json({ ok: false, message: 'Invalid webhook URL' }, { status: 400 });
      }

      try {
        const res = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: 'Just AdminPanel',
            avatar_url: 'https://cdn-icons-png.flaticon.com/512/906/906343.png',
            embeds: [
              {
                title: '🔔 Test połączenia Webhook',
                description: 'Powiadomienie testowe z Just AdminPanel zostało pomyślnie wysłane!',
                color: 8140029,
                timestamp: new Date().toISOString(),
                footer: { text: 'Just AdminPanel • FiveM Bridge' }
              }
            ]
          })
        });

        if (res.ok || res.status === 204) {
          return NextResponse.json({ ok: true, message: 'Webhook test sent successfully' });
        }
        return NextResponse.json({ ok: false, message: `Discord returned ${res.status}` });
      } catch (err) {
        return NextResponse.json({ ok: false, message: 'Failed to deliver webhook payload' });
      }
    }

    if (body.settings) {
      const current = getSettingsFromDisk();
      const updated = {
        ...current,
        ...body.settings,
        theme: {
          ...current.theme,
          ...(body.settings.theme || {})
        }
      };
      saveSettingsToDisk(updated);
      return NextResponse.json({ ok: true, message: 'Settings saved', settings: updated });
    }

    return NextResponse.json({ ok: false, message: 'Invalid payload' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
