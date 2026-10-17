import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DATA_DIR = path.join(process.cwd(), 'data');
const CONFIG_FILE = path.join(DATA_DIR, 'panel_config.json');
const ADMINS_FILE = path.join(DATA_DIR, 'admins.json');
const CHECKLIST_FILE = path.join(DATA_DIR, 'checklist_overrides.json');

const DEFAULT_TOKEN = 'just-secret-token-12345';
const DEFAULT_RCON = 'super_secret_rcon_pass';
const DEFAULT_STEAM = '1A2B3C4D5E6F708192A1B2C3D4E5F678';
const DEFAULT_WEBHOOK_SUBSTR = '12984192847192';

function readJsonSafe(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return fallback;
  }
}

function writeJsonSafe(filePath, data) {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch {}
}

export async function GET() {
  const config = readJsonSafe(CONFIG_FILE, {});
  const admins = readJsonSafe(ADMINS_FILE, []);
  const overrides = readJsonSafe(CHECKLIST_FILE, {
    httpsSsl: false,
    fivemFirewall: false
  });

  // 1. Token mostka FiveM
  const isDefaultToken = !config.apiKey || config.apiKey === DEFAULT_TOKEN || config.apiKey.length < 16;
  
  // 2. Hasło admina domyślnego
  const hasDefaultAdmin = admins.some((a) => {
    if (a.username !== 'admin') return false;
    // Sprawdz hash domyslnego hasla "admin"
    const isDefaultHash = a.passwordHash && a.passwordHash.includes('1b2fc574d70a9fed8c0ba36b6f67f4c7e4b650d81c765ae1cb975f936d21b8b574b93b5a93e62e7c25e0d4927af5c5855e16d9c62b2db3efae94cd95aad9a9b3');
    return isDefaultHash || a.username === 'admin';
  });

  // 3. Hasło RCON
  const isDefaultRcon = !config.rconPassword || config.rconPassword === DEFAULT_RCON || config.rconPassword.length < 8;

  // 4. Adres serwera
  const isLocalhostEndpoint = !config.fivemEndpoint || config.fivemEndpoint.includes('127.0.0.1') || config.fivemEndpoint.includes('localhost');

  // 5. Discord Webhook
  const isDefaultWebhook = !config.discordWebhook || config.discordWebhook.includes(DEFAULT_WEBHOOK_SUBSTR);

  // 6. Steam API Key
  const isDefaultSteam = !config.steamApiKey || config.steamApiKey === DEFAULT_STEAM || config.steamApiKey.length < 20;

  // 7. Wszyscy admini z 2FA
  const allAdminsHave2fa = admins.length > 0 && admins.every((a) => a.has2fa === true);

  // 8. HTTPS / Reverse Proxy (manual override)
  const isHttpsDone = Boolean(overrides.httpsSsl);

  const items = [
    {
      id: 'bridge_token',
      category: 'security',
      severity: 'required',
      title: 'Token mostka FiveM (JUST_API_KEY)',
      titleEn: 'FiveM Bridge Secret Token (JUST_API_KEY)',
      description: 'Unikalny klucz współdzielony między Just AdminPanel a skryptem just_admin w FXServer.',
      descriptionEn: 'Shared secret key for authenticated RPC calls between panel and FXServer just_admin resource.',
      status: isDefaultToken ? 'action_required' : 'ready',
      currentValue: isDefaultToken ? 'Domyślny placeholder (just-secret-token-12345)' : 'Bezpieczny token zdefiniowany',
      currentValueEn: isDefaultToken ? 'Default placeholder (just-secret-token-12345)' : 'Custom secure token set',
      canAutoFix: true,
      actionLabel: 'Generuj bezpieczny token 64-bit',
      actionLabelEn: 'Generate secure 64-bit token'
    },
    {
      id: 'admin_credentials',
      category: 'security',
      severity: 'required',
      title: 'Domyślne konto administratora (admin / admin)',
      titleEn: 'Default Root Admin Credentials (admin / admin)',
      description: 'Domyślny użytkownik "admin" z hasłem "admin" musi zostać zmieniony przed wystawieniem panelu na świat.',
      descriptionEn: 'The initial default "admin" account with password "admin" must be changed before exposing to internet.',
      status: hasDefaultAdmin ? 'action_required' : 'ready',
      currentValue: hasDefaultAdmin ? 'Wykryto domyślnego użytkownika admin' : 'Hasło zmienione / brak domyślnego konta',
      currentValueEn: hasDefaultAdmin ? 'Default "admin" account detected' : 'Changed / no default admin found',
      canAutoFix: false,
      targetTab: 'admins',
      actionLabel: 'Zarządzaj administratorami',
      actionLabelEn: 'Manage Administrators'
    },
    {
      id: 'rcon_password',
      category: 'security',
      severity: 'required',
      title: 'Hasło konsoli RCON (rcon_password)',
      titleEn: 'FXServer RCON Master Password',
      description: 'Hasło do zdalnego wykonywania poleceń konsoli silnika FXServer. Chroń przed atakami brute-force.',
      descriptionEn: 'Master password used for remote server engine execution. Prevent unauthorized brute-force access.',
      status: isDefaultRcon ? 'action_required' : 'ready',
      currentValue: isDefaultRcon ? 'Domyślny placeholder (super_secret_rcon_pass)' : 'Własne silne hasło ustawione',
      currentValueEn: isDefaultRcon ? 'Default placeholder (super_secret_rcon_pass)' : 'Custom strong password configured',
      canAutoFix: false,
      targetTab: 'settings',
      actionLabel: 'Zmień w Ustawieniach',
      actionLabelEn: 'Change in Settings'
    },
    {
      id: 'server_endpoint',
      category: 'network',
      severity: 'recommended',
      title: 'Publiczny adres mostka FXServer',
      titleEn: 'FXServer Public Bridge Endpoint',
      description: 'Wskaż docelowe publiczne IP lub domenę serwera FiveM, jeśli panel nie działa na tej samej maszynie co FXServer.',
      descriptionEn: 'Specify the public IP or reverse proxy domain of your FXServer if panel is hosted externally.',
      status: isLocalhostEndpoint ? 'warning' : 'ready',
      currentValue: config.fivemEndpoint || 'http://127.0.0.1:30120/just_admin',
      currentValueEn: config.fivemEndpoint || 'http://127.0.0.1:30120/just_admin',
      canAutoFix: false,
      targetTab: 'settings',
      actionLabel: 'Konfiguruj endpoint',
      actionLabelEn: 'Configure endpoint'
    },
    {
      id: 'discord_webhook',
      category: 'monitoring',
      severity: 'recommended',
      title: 'Webhook audytu i banów Discord',
      titleEn: 'Discord Staff Audit & Ban Webhook',
      description: 'Zapewnia niezależny rejestr nakładanych sankcji i restartów na dedykowanym kanale Discord.',
      descriptionEn: 'Provides an off-site audit log of all issued bans, kicks, and restart routines to Discord.',
      status: isDefaultWebhook ? 'warning' : 'ready',
      currentValue: isDefaultWebhook ? 'Brak aktywnego webhooka' : 'Webhook podłączony',
      currentValueEn: isDefaultWebhook ? 'No active webhook' : 'Webhook configured',
      canAutoFix: false,
      targetTab: 'settings',
      actionLabel: 'Ustaw webhook',
      actionLabelEn: 'Set webhook'
    },
    {
      id: 'steam_api_key',
      category: 'integration',
      severity: 'recommended',
      title: 'Klucz Steam Web API',
      titleEn: 'Steam Web API Key',
      description: 'Wymagany do automatycznego tłumaczenia steam:hex na profile graczy i wykrywania banów VAC.',
      descriptionEn: 'Required for automated steam:hex identifier lookup and Steam Community profile syncing.',
      status: isDefaultSteam ? 'warning' : 'ready',
      currentValue: isDefaultSteam ? 'Domyślny placeholder' : 'Zarejestrowany klucz Steam API',
      currentValueEn: isDefaultSteam ? 'Default placeholder' : 'Custom Steam API key registered',
      canAutoFix: false,
      targetTab: 'settings',
      actionLabel: 'Wklej klucz API',
      actionLabelEn: 'Paste API key'
    },
    {
      id: 'two_factor_auth',
      category: 'security',
      severity: 'recommended',
      title: 'Uwierzytelnianie 2FA dla administratorów',
      titleEn: 'Two-Factor Authentication (2FA) for Admins',
      description: 'Upewnij się, że wszyscy zarejestrowani administratorzy posiadają włączoną weryfikację dwuetapową.',
      descriptionEn: 'Ensure all registered administrator accounts have 2FA enabled to prevent account takeover.',
      status: allAdminsHave2fa ? 'ready' : 'warning',
      currentValue: allAdminsHave2fa ? 'Wszyscy administratorzy chronieni 2FA' : 'Część kont bez aktywnego 2FA',
      currentValueEn: allAdminsHave2fa ? 'All admins protected with 2FA' : 'Some accounts missing 2FA',
      canAutoFix: false,
      targetTab: 'admins',
      actionLabel: 'Sprawdź 2FA personelu',
      actionLabelEn: 'Inspect Staff 2FA'
    },
    {
      id: 'https_ssl',
      category: 'network',
      severity: 'recommended',
      title: 'Certyfikat SSL / Reverse Proxy (HTTPS)',
      titleEn: 'SSL Certificate / Reverse Proxy (HTTPS)',
      description: 'Panel produkcyjny powinien działać z bezpiecznym protokołem HTTPS (np. przez Nginx, Caddy lub Cloudflare).',
      descriptionEn: 'Production admin panel should be served over HTTPS to encrypt session tokens and credentials.',
      status: isHttpsDone ? 'ready' : 'warning',
      currentValue: isHttpsDone ? 'Oznaczono jako zweryfikowane' : 'Wymaga weryfikacji ręcznej',
      currentValueEn: isHttpsDone ? 'Marked as verified' : 'Requires manual verification',
      canToggleManual: true,
      manualKey: 'httpsSsl',
      actionLabel: isHttpsDone ? 'Cofnij oznaczenie' : 'Oznacz jako wdrożone',
      actionLabelEn: isHttpsDone ? 'Undo mark' : 'Mark as deployed'
    }
  ];

  const total = items.length;
  const ready = items.filter((i) => i.status === 'ready').length;
  const requiredPending = items.filter((i) => i.severity === 'required' && i.status !== 'ready').length;
  const percentage = Math.round((ready / total) * 100);

  return NextResponse.json({
    ok: true,
    percentage,
    readyCount: ready,
    totalCount: total,
    requiredPending,
    isProductionReady: requiredPending === 0,
    items
  });
}

export async function POST(req) {
  try {
    const body = await req.json();

    if (body.action === 'generate_token') {
      const secureToken = `just_sec_${crypto.randomBytes(24).toString('hex')}`;
      const config = readJsonSafe(CONFIG_FILE, {});
      config.apiKey = secureToken;
      writeJsonSafe(CONFIG_FILE, config);

      return NextResponse.json({
        ok: true,
        token: secureToken,
        luaConfigSnippet: `Config.ApiKey = "${secureToken}"`,
        message: 'Wygenerowano nowy bezpieczny token i zaktualizowano konfigurację panelu!'
      });
    }

    if (body.action === 'toggle_manual') {
      const key = body.key;
      if (!key) return NextResponse.json({ ok: false, message: 'Missing key' }, { status: 400 });

      const overrides = readJsonSafe(CHECKLIST_FILE, {});
      overrides[key] = !overrides[key];
      writeJsonSafe(CHECKLIST_FILE, overrides);

      return NextResponse.json({
        ok: true,
        key,
        newValue: overrides[key],
        message: 'Zaktualizowano stan checklisty'
      });
    }

    return NextResponse.json({ ok: false, message: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
