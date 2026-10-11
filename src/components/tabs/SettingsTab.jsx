'use client';

import React, { useState, useEffect } from 'react';
import {
  Server,
  Shield,
  Bell,
  RefreshCw,
  CheckCircle2,
  Lock,
  Globe,
  Eye,
  EyeOff,
  Wifi,
  AlertTriangle,
  Download,
  Save,
  Radio,
  Languages,
  Palette,
  Sparkles,
  ListChecks,
  ArrowRight
} from 'lucide-react';

const colorPresets = [
  { name: 'Just Purple', hex: '#7c3aed' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Cyber Blue', hex: '#06b6d4' },
  { name: 'Crimson', hex: '#ef4444' },
  { name: 'Amber Gold', hex: '#f59e0b' },
  { name: 'Neon Pink', hex: '#ec4899' }
];

const bgPresets = [
  { name: 'Deep Charcoal', base: '#09090b', panel: '#141418' },
  { name: 'OLED Pitch Black', base: '#000000', panel: '#0c0c0e' },
  { name: 'Midnight Navy', base: '#0b0f19', panel: '#111827' }
];

const dict = {
  pl: {
    langSelect: 'Język interfejsu',
    themeTitle: 'Personalizacja Wyglądu Panelu (Config)',
    brandColorLabel: 'Główny Kolor Akcentu',
    customColor: 'Własny kolor',
    bgThemeLabel: 'Styl Ciemnego Tła',
    glowLabel: 'Neonowe Poświaty i Podświetlenia (Glow)',
    glowEnabled: 'Włączone',
    glowDisabled: 'Wyłączone',
    radiusLabel: 'Zaokrąglenia Elementów',
    bridgeTitle: 'Most FiveM & Połączenie Telemetryczne',
    bridgeEndpoint: 'FXServer Resource Endpoint (just_admin)',
    bridgeEndpointHint: 'Domyślny adres wewnętrznego serwera HTTP wbudowanego w FXServer (port 30120)',
    apiKeyLabel: 'Klucz API mostu (x-just-token)',
    apiKeyHint: 'Musi być identyczny z wartością Config.ApiKey w resources/just_admin/config.lua',
    pollingLabel: 'Częstotliwość odpytywania telemetrii',
    polling1s: '1 sekunda (Ultra Realtime)',
    polling3s: '3 sekundy (Zalecane)',
    polling5s: '5 sekund (Oszczędne)',
    polling10s: '10 sekund',
    testConnBtn: 'Przetestuj połączenie z FiveM',
    testingConnBtn: 'Testowanie połączenia...',
    connSuccess: 'Połączono z mostem FiveM',
    connFail: 'Brak połączenia z FiveM',
    identityTitle: 'Tożsamość Serwera & Parametry Gry',
    serverNameLabel: 'Nazwa Projektu (sv_projectName / sv_hostname)',
    maxSlotsLabel: 'Maksymalna liczba slotów (sv_maxclients)',
    endpointLabel: 'Publiczny adres bezpośredniego łączenia (IP:Port)',
    oneSyncLabel: 'Tryb OneSync',
    oneSyncBig: 'OneSync BigMode (128+ slotów)',
    oneSyncLegacy: 'OneSync Legacy (64 sloty)',
    oneSyncOff: 'Wyłączony (32 sloty)',
    gameBuildLabel: 'Wersja buildu GTA V (sv_enforceGameBuild)',
    tagsLabel: 'Tagi serwera (sets tags)',
    securityTitle: 'Bezpieczeństwo, Uwierzytelnianie & RCON',
    rconLabel: 'Hasło RCON (rcon_password)',
    steamKeyLabel: 'Steam Web API Key',
    steamKeyPlaceholder: 'Steam Web API Key dla identyfikatora steam: hex',
    syncTxAdminLabel: 'Synchronizuj bany automatycznie z banlistą txAdmin',
    blockVpnLabel: 'Blokuj graczy używających serwerów VPN i proxy',
    webhooksTitle: 'Powiadomienia Discord Webhooks & Harmonogram',
    modWebhookLabel: 'Webhook Moderacji i Logów Administracyjnych (Kicki, Bany, RCON)',
    crashWebhookLabel: 'Webhook Awarii i Krytycznych Błędów Serwera',
    testWebhookBtn: 'Wyślij testowy ping',
    testingWebhookBtn: 'Wysyłanie...',
    webhookSuccess: 'Wysłano testowy webhook Discord (HTTP 204)',
    webhookFail: 'Błąd wysyłania webhooka',
    restartScheduleLabel: 'Harmonogram automatycznych restartów',
    restartDaily4: 'Codziennie o 04:00 (Zalecane)',
    restartEvery12: 'Co 12 godzin (04:00 & 16:00)',
    restartEvery6: 'Co 6 godzin',
    restartOff: 'Wyłączone',
    backupIntervalLabel: 'Częstotliwość automatycznej kopii bazy danych',
    backup30m: 'Co 30 minut',
    backup1h: 'Co 1 godzinę',
    backup6h: 'Co 6 godzin',
    backupDaily: 'Raz dziennie',
    exportBtn: 'Eksportuj konfigurację (JSON)',
    saveBtn: 'Zapisz konfigurację',
    savingBtn: 'Zapisywanie...',
    saveSuccess: 'Konfiguracja zapisana pomyślnie'
  },
  en: {
    langSelect: 'Interface Language',
    themeTitle: 'Panel Appearance & Theme (Config)',
    brandColorLabel: 'Primary Accent Color',
    customColor: 'Custom color',
    bgThemeLabel: 'Background Theme Style',
    glowLabel: 'Neon Glow & Accents',
    glowEnabled: 'Enabled',
    glowDisabled: 'Disabled',
    radiusLabel: 'Corner Border Radius',
    bridgeTitle: 'FiveM Bridge & Live Telemetry Connection',
    bridgeEndpoint: 'FXServer Resource Endpoint (just_admin)',
    bridgeEndpointHint: 'Default internal FXServer HTTP endpoint on game port (30120)',
    apiKeyLabel: 'Bridge Secret Token (x-just-token)',
    apiKeyHint: 'Must match Config.ApiKey in resources/just_admin/config.lua',
    pollingLabel: 'Telemetry Polling Interval',
    polling1s: '1 second (Ultra Realtime)',
    polling3s: '3 seconds (Recommended)',
    polling5s: '5 seconds (Eco Mode)',
    polling10s: '10 seconds',
    testConnBtn: 'Test FiveM Connection',
    testingConnBtn: 'Testing connection...',
    connSuccess: 'Connected to FiveM Bridge',
    connFail: 'FiveM bridge connection failed',
    identityTitle: 'Server Identity & Game Parameters',
    serverNameLabel: 'Server Project Name (sv_projectName / sv_hostname)',
    maxSlotsLabel: 'Maximum Player Slots (sv_maxclients)',
    endpointLabel: 'Public Direct Endpoint (IP:Port)',
    oneSyncLabel: 'OneSync Mode',
    oneSyncBig: 'OneSync BigMode (128+ Slots)',
    oneSyncLegacy: 'OneSync Legacy (64 Slots)',
    oneSyncOff: 'Disabled (32 Slots)',
    gameBuildLabel: 'Enforced GTA V Build (sv_enforceGameBuild)',
    tagsLabel: 'Server Tags (sets tags)',
    securityTitle: 'Security, Authentication & RCON',
    rconLabel: 'RCON Master Password (rcon_password)',
    steamKeyLabel: 'Steam Web API Key',
    steamKeyPlaceholder: 'Steam Web API Key for steam: hex resolution',
    syncTxAdminLabel: 'Automatically synchronize bans with txAdmin banlist',
    blockVpnLabel: 'Block users connecting via VPN or Proxy servers',
    webhooksTitle: 'Discord Webhooks & Automation Schedule',
    modWebhookLabel: 'Staff Audit & Moderation Webhook (Kicks, Bans, RCON)',
    crashWebhookLabel: 'Server Crash & Critical Error Webhook',
    testWebhookBtn: 'Send test ping',
    testingWebhookBtn: 'Sending...',
    webhookSuccess: 'Discord test notification dispatched (HTTP 204)',
    webhookFail: 'Failed to deliver webhook payload',
    restartScheduleLabel: 'Scheduled Auto-Restart Routine',
    restartDaily4: 'Daily at 04:00 AM (Recommended)',
    restartEvery12: 'Every 12 hours (04:00 & 16:00)',
    restartEvery6: 'Every 6 hours',
    restartOff: 'Disabled',
    backupIntervalLabel: 'Database Automated Backup Interval',
    backup30m: 'Every 30 minutes',
    backup1h: 'Every 1 hour',
    backup6h: 'Every 6 hours',
    backupDaily: 'Daily',
    exportBtn: 'Export configuration (JSON)',
    saveBtn: 'Save Configuration',
    savingBtn: 'Saving...',
    saveSuccess: 'Configuration saved successfully'
  }
};

export default function SettingsTab({ serverInfo, onToast, onNavigateTab }) {
  const [lang, setLang] = useState('pl');

  const [formData, setFormData] = useState({
    fivemEndpoint: 'http://127.0.0.1:30120/just_admin',
    apiKey: 'just-secret-token-12345',
    serverName: serverInfo?.name || 'Los Santos Roleplay // Polish Official',
    endpoint: serverInfo?.endpoint || '142.250.190.40:30120',
    maxPlayers: serverInfo?.maxPlayers || 128,
    oneSync: 'OneSync BigMode',
    gameBuild: '3095',
    tags: 'roleplay, polish, custom, esx, realistic, txadmin',
    rconPassword: 'super_secret_rcon_pass',
    steamApiKey: '1A2B3C4D5E6F708192A1B2C3D4E5F678',
    discordWebhook: 'https://discord.com/api/webhooks/12984192847192/just_admin_logs',
    crashWebhook: 'https://discord.com/api/webhooks/12984192847192/just_crashes',
    pollingInterval: '3000',
    autoReconnect: true,
    syncTxAdmin: true,
    blockVpn: false,
    soundAlerts: true,
    restartSchedule: 'Daily at 04:00 AM',
    backupInterval: 'Every 30 minutes',
    theme: {
      brandColor: '#7c3aed',
      surfaceBase: '#09090b',
      surfacePanel: '#141418',
      borderRadius: '8px',
      enableGlow: true
    }
  });

  const [showApiKey, setShowApiKey] = useState(false);
  const [showRcon, setShowRcon] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [testingWebhook, setTestingWebhook] = useState(false);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('just_admin_lang');
      if (savedLang === 'en' || savedLang === 'pl') {
        setLang(savedLang);
      }
      const savedTheme = localStorage.getItem('just_admin_theme');
      if (savedTheme) {
        const parsed = JSON.parse(savedTheme);
        applyTheme(parsed);
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.ok && data.settings) {
          setFormData((prev) => ({
            ...prev,
            ...data.settings,
            apiKey: data.settings.apiKey || prev.apiKey,
            theme: {
              ...prev.theme,
              ...(data.settings.theme || {})
            }
          }));
          if (data.settings.theme) {
            applyTheme(data.settings.theme);
          }
        }
      })
      .catch(() => {});
  }, []);

  const applyTheme = (theme) => {
    if (!theme) return;
    document.documentElement.style.setProperty('--brand-purple', theme.brandColor);
    document.documentElement.style.setProperty('--brand-purple-glow', `${theme.brandColor}40`);
    document.documentElement.style.setProperty('--surface-base', theme.surfaceBase);
    document.documentElement.style.setProperty('--surface-panel', theme.surfacePanel);
    try {
      localStorage.setItem('just_admin_theme', JSON.stringify(theme));
    } catch {}
  };

  const handleColorSelect = (hex) => {
    const updatedTheme = { ...formData.theme, brandColor: hex };
    setFormData((prev) => ({ ...prev, theme: updatedTheme }));
    applyTheme(updatedTheme);
    onToast?.(`Kolor akcentu zmieniony na ${hex}`);
  };

  const handleBgSelect = (bg) => {
    const updatedTheme = {
      ...formData.theme,
      surfaceBase: bg.base,
      surfacePanel: bg.panel
    };
    setFormData((prev) => ({ ...prev, theme: updatedTheme }));
    applyTheme(updatedTheme);
    onToast?.(`Motyw tła: ${bg.name}`);
  };

  const changeLanguage = (newLang) => {
    setLang(newLang);
    try {
      localStorage.setItem('just_admin_lang', newLang);
    } catch {}
    onToast?.(newLang === 'pl' ? 'Ustawiono język Polski' : 'Switched to English');
  };

  const t = dict[lang];

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setConnectionStatus(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test_connection',
          endpoint: formData.fivemEndpoint,
          apiKey: formData.apiKey
        })
      });
      const data = await res.json();
      setConnectionStatus(data);

      if (data.ok) {
        onToast?.(`${t.connSuccess} (${data.latencyMs}ms)`);
      } else {
        onToast?.(data.message || t.connFail);
      }
    } catch {
      setConnectionStatus({ ok: false, status: 'offline', message: t.connFail });
      onToast?.(t.connFail);
    } finally {
      setTestingConnection(false);
    }
  };

  const handleTestWebhook = async () => {
    setTestingWebhook(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test_webhook',
          url: formData.discordWebhook
        })
      });
      const data = await res.json();
      if (data.ok) {
        onToast?.(t.webhookSuccess);
      } else {
        onToast?.(data.message || t.webhookFail);
      }
    } catch {
      onToast?.(t.webhookFail);
    } finally {
      setTestingWebhook(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: formData })
      });
      const data = await res.json();
      if (data.ok) {
        applyTheme(formData.theme);
        onToast?.(t.saveSuccess);
      } else {
        onToast?.('Failed to save');
      }
    } catch {
      onToast?.(t.saveSuccess);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportConfig = () => {
    const jsonStr = JSON.stringify(formData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'just_admin_config.json';
    a.click();
    URL.revokeObjectURL(url);
    onToast?.('just_admin_config.json exported');
  };

  return (
    <div className="anim-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '0 28px 28px', maxWidth: '1020px' }}>
      
      {/* Przelacznik jezyka w naglowku */}
      <div className="anim-slide-down" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 18px',
        backgroundColor: 'var(--surface-panel)',
        border: '1px solid var(--border-primary)',
        borderRadius: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '13px', fontWeight: 600 }}>
          <Languages size={16} color="var(--brand-purple)" />
          <span>{t.langSelect}</span>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            onClick={() => changeLanguage('pl')}
            style={{
              padding: '5px 12px',
              fontSize: '12px',
              fontWeight: 600,
              borderRadius: '5px',
              cursor: 'pointer',
              border: lang === 'pl' ? '1px solid var(--brand-purple)' : '1px solid var(--border-primary)',
              backgroundColor: lang === 'pl' ? 'rgba(124, 58, 237, 0.18)' : 'var(--surface-subtle)',
              color: lang === 'pl' ? '#fff' : 'var(--text-secondary)'
            }}
          >
            🇵🇱 Polski
          </button>
          <button
            type="button"
            onClick={() => changeLanguage('en')}
            style={{
              padding: '5px 12px',
              fontSize: '12px',
              fontWeight: 600,
              borderRadius: '5px',
              cursor: 'pointer',
              border: lang === 'en' ? '1px solid var(--brand-purple)' : '1px solid var(--border-primary)',
              backgroundColor: lang === 'en' ? 'rgba(124, 58, 237, 0.18)' : 'var(--surface-subtle)',
              color: lang === 'en' ? '#fff' : 'var(--text-secondary)'
            }}
          >
            🇬🇧 English
          </button>
        </div>
      </div>

      {/* Vercel Pre-flight Checklist Banner */}
      <div className="panel-card anim-slide-down" style={{
        padding: '16px 20px',
        background: 'linear-gradient(135deg, rgba(20, 20, 24, 0.95) 0%, rgba(124, 58, 237, 0.12) 100%)',
        border: '1px solid rgba(124, 58, 237, 0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: 'rgba(124, 58, 237, 0.2)',
            border: '1px solid var(--brand-purple)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <ListChecks size={18} color="var(--brand-purple)" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#fff' }}>
                {lang === 'pl' ? 'Lista kontrolna wdrożenia (Vercel-style Checklist)' : 'Production Pre-flight Checklist'}
              </span>
              <span style={{
                fontSize: '10px',
                fontWeight: 700,
                padding: '1px 6px',
                borderRadius: '4px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: '#f87171',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}>
                PRE-LAUNCH
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {lang === 'pl'
                ? 'Zweryfikuj token mostka RPC, domyślne hasło administratora oraz webhooki przed uruchomieniem serwera.'
                : 'Verify your RPC bridge tokens, root admin passwords, and Discord webhooks before going live.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigateTab ? onNavigateTab('checklist') : null}
          className="btn-primary"
          style={{ height: '32px', fontSize: '12px' }}
        >
          <span>{lang === 'pl' ? 'Otwórz Checklistę' : 'Open Checklist'}</span>
          <ArrowRight size={13} />
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Personalizacja Wyglądu Panelu (Kolory, Motywy) */}
        <div className="panel-card anim-slide-up delay-1" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Palette size={16} color="var(--brand-purple)" />
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>
              {t.themeTitle}
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Wybor koloru akcentu */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                {t.brandColorLabel}
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                {colorPresets.map((preset) => {
                  const isSelected = formData.theme.brandColor === preset.hex;
                  return (
                    <button
                      key={preset.hex}
                      type="button"
                      onClick={() => handleColorSelect(preset.hex)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: isSelected ? `2px solid ${preset.hex}` : '1px solid var(--border-primary)',
                        backgroundColor: isSelected ? `${preset.hex}22` : 'var(--surface-subtle)',
                        color: isSelected ? '#fff' : 'var(--text-secondary)',
                        fontSize: '12px',
                        fontWeight: isSelected ? 600 : 500,
                        cursor: 'pointer',
                        transition: 'all 0.18s ease'
                      }}
                    >
                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: preset.hex, display: 'inline-block' }} />
                      <span>{preset.name}</span>
                    </button>
                  );
                })}

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingLeft: '8px' }}>
                  <input
                    type="color"
                    value={formData.theme.brandColor}
                    onChange={(e) => handleColorSelect(e.target.value)}
                    style={{
                      width: '28px',
                      height: '28px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      background: 'none'
                    }}
                  />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t.customColor}</span>
                </div>
              </div>
            </div>

            {/* Wybor stylu ciemnego tla */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                {t.bgThemeLabel}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {bgPresets.map((bg) => {
                  const isSelected = formData.theme.surfaceBase === bg.base;
                  return (
                    <button
                      key={bg.name}
                      type="button"
                      onClick={() => handleBgSelect(bg)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '6px',
                        border: isSelected ? '1px solid var(--brand-purple)' : '1px solid var(--border-primary)',
                        backgroundColor: bg.base,
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.18s ease'
                      }}
                    >
                      <div style={{ fontSize: '12.5px', fontWeight: 600, color: isSelected ? '#fff' : 'var(--text-secondary)' }}>
                        {bg.name}
                      </div>
                      <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                        Base: {bg.base}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Most FiveM */}
        <div className="panel-card anim-slide-up delay-2" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Radio size={16} color="var(--brand-purple)" />
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>
                {t.bridgeTitle}
              </h3>
            </div>

            {connectionStatus && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11.5px',
                padding: '4px 10px',
                borderRadius: '4px',
                backgroundColor: connectionStatus.ok ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                border: `1px solid ${connectionStatus.ok ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                color: connectionStatus.ok ? 'var(--status-success)' : 'var(--status-danger)'
              }}>
                {connectionStatus.ok ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}
                <span>{connectionStatus.ok ? `ONLINE (${connectionStatus.latencyMs}ms)` : connectionStatus.status.toUpperCase()}</span>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                {t.bridgeEndpoint}
              </label>
              <input
                type="text"
                value={formData.fivemEndpoint}
                onChange={(e) => setFormData({ ...formData, fivemEndpoint: e.target.value })}
                placeholder="http://127.0.0.1:30120/just_admin"
                style={{
                  width: '100%',
                  backgroundColor: 'var(--surface-subtle)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '5px',
                  padding: '8px 12px',
                  color: '#fff',
                  fontSize: '12.5px',
                  fontFamily: 'var(--font-mono)',
                  outline: 'none'
                }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                {t.bridgeEndpointHint}
              </span>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                {t.apiKeyLabel}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  placeholder="Config.ApiKey"
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--surface-subtle)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: '5px',
                    padding: '8px 36px 8px 12px',
                    color: '#fff',
                    fontSize: '12.5px',
                    fontFamily: 'var(--font-mono)',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)'
                  }}
                >
                  {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                {t.apiKeyHint}
              </span>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                {t.pollingLabel}
              </label>
              <select
                value={formData.pollingInterval}
                onChange={(e) => setFormData({ ...formData, pollingInterval: e.target.value })}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--surface-subtle)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '5px',
                  padding: '8px 12px',
                  color: '#fff',
                  fontSize: '12.5px',
                  outline: 'none'
                }}
              >
                <option value="1000">{t.polling1s}</option>
                <option value="3000">{t.polling3s}</option>
                <option value="5000">{t.polling5s}</option>
                <option value="10000">{t.polling10s}</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testingConnection}
                className="btn-secondary"
                style={{
                  height: '37px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '12.5px'
                }}
              >
                <RefreshCw size={14} className={testingConnection ? 'anim-spin' : ''} />
                <span>{testingConnection ? t.testingConnBtn : t.testConnBtn}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tożsamość serwera */}
        <div className="panel-card anim-slide-up delay-3" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Server size={16} color="var(--brand-purple)" />
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>
              {t.identityTitle}
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                {t.serverNameLabel}
              </label>
              <input
                type="text"
                value={formData.serverName}
                onChange={(e) => setFormData({ ...formData, serverName: e.target.value })}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--surface-subtle)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '5px',
                  padding: '8px 12px',
                  color: '#fff',
                  fontSize: '12.5px',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                {t.maxSlotsLabel}
              </label>
              <select
                value={formData.maxPlayers}
                onChange={(e) => setFormData({ ...formData, maxPlayers: Number(e.target.value) })}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--surface-subtle)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '5px',
                  padding: '8px 12px',
                  color: '#fff',
                  fontSize: '12.5px',
                  outline: 'none'
                }}
              >
                <option value={32}>32 Slots</option>
                <option value={48}>48 Slots</option>
                <option value={64}>64 Slots</option>
                <option value={128}>128 Slots (OneSync)</option>
                <option value={256}>256 Slots (BigMode)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                {t.endpointLabel}
              </label>
              <input
                type="text"
                value={formData.endpoint}
                onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--surface-subtle)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '5px',
                  padding: '8px 12px',
                  color: '#fff',
                  fontSize: '12.5px',
                  fontFamily: 'var(--font-mono)',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                {t.oneSyncLabel}
              </label>
              <select
                value={formData.oneSync}
                onChange={(e) => setFormData({ ...formData, oneSync: e.target.value })}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--surface-subtle)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '5px',
                  padding: '8px 12px',
                  color: '#fff',
                  fontSize: '12.5px',
                  outline: 'none'
                }}
              >
                <option value="OneSync BigMode">{t.oneSyncBig}</option>
                <option value="OneSync Legacy">{t.oneSyncLegacy}</option>
                <option value="Disabled">{t.oneSyncOff}</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                {t.gameBuildLabel}
              </label>
              <select
                value={formData.gameBuild}
                onChange={(e) => setFormData({ ...formData, gameBuild: e.target.value })}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--surface-subtle)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '5px',
                  padding: '8px 12px',
                  color: '#fff',
                  fontSize: '12.5px',
                  outline: 'none'
                }}
              >
                <option value="3095">3095 (The Chop Shop)</option>
                <option value="2944">2944 (San Andreas Mercenaries)</option>
                <option value="2802">2802 (Los Santos Drug Wars)</option>
                <option value="2699">2699 (The Criminal Enterprises)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                {t.tagsLabel}
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--surface-subtle)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '5px',
                  padding: '8px 12px',
                  color: '#fff',
                  fontSize: '12.5px',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* Bezpieczeństwo i RCON */}
        <div className="panel-card anim-slide-up delay-4" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Lock size={16} color="#fbbf24" />
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>
              {t.securityTitle}
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                {t.rconLabel}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showRcon ? 'text' : 'password'}
                  value={formData.rconPassword}
                  onChange={(e) => setFormData({ ...formData, rconPassword: e.target.value })}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--surface-subtle)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: '5px',
                    padding: '8px 36px 8px 12px',
                    color: '#fff',
                    fontSize: '12.5px',
                    fontFamily: 'var(--font-mono)',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowRcon(!showRcon)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)'
                  }}
                >
                  {showRcon ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                {t.steamKeyLabel}
              </label>
              <input
                type="password"
                value={formData.steamApiKey}
                onChange={(e) => setFormData({ ...formData, steamApiKey: e.target.value })}
                placeholder={t.steamKeyPlaceholder}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--surface-subtle)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '5px',
                  padding: '8px 12px',
                  color: '#fff',
                  fontSize: '12.5px',
                  fontFamily: 'var(--font-mono)',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', color: '#fff' }}>
              <input
                type="checkbox"
                checked={formData.syncTxAdmin}
                onChange={(e) => setFormData({ ...formData, syncTxAdmin: e.target.checked })}
                style={{ accentColor: 'var(--brand-purple)', width: '15px', height: '15px' }}
              />
              <span>{t.syncTxAdminLabel}</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', color: '#fff' }}>
              <input
                type="checkbox"
                checked={formData.blockVpn}
                onChange={(e) => setFormData({ ...formData, blockVpn: e.target.checked })}
                style={{ accentColor: 'var(--brand-purple)', width: '15px', height: '15px' }}
              />
              <span>{t.blockVpnLabel}</span>
            </label>
          </div>
        </div>

        {/* Webhooks Discord */}
        <div className="panel-card anim-slide-up delay-4" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Bell size={16} color="#60a5fa" />
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>
              {t.webhooksTitle}
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {t.modWebhookLabel}
                </label>
                <button
                  type="button"
                  onClick={handleTestWebhook}
                  disabled={testingWebhook}
                  style={{ fontSize: '11px', color: 'var(--brand-purple)', fontWeight: 600 }}
                >
                  {testingWebhook ? t.testingWebhookBtn : t.testWebhookBtn}
                </button>
              </div>
              <input
                type="text"
                value={formData.discordWebhook}
                onChange={(e) => setFormData({ ...formData, discordWebhook: e.target.value })}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--surface-subtle)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '5px',
                  padding: '8px 12px',
                  color: '#fff',
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                {t.crashWebhookLabel}
              </label>
              <input
                type="text"
                value={formData.crashWebhook}
                onChange={(e) => setFormData({ ...formData, crashWebhook: e.target.value })}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--surface-subtle)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '5px',
                  padding: '8px 12px',
                  color: '#fff',
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  {t.restartScheduleLabel}
                </label>
                <select
                  value={formData.restartSchedule}
                  onChange={(e) => setFormData({ ...formData, restartSchedule: e.target.value })}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--surface-subtle)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: '5px',
                    padding: '8px 12px',
                    color: '#fff',
                    fontSize: '12.5px',
                    outline: 'none'
                  }}
                >
                  <option value="Daily at 04:00 AM">{t.restartDaily4}</option>
                  <option value="Every 12 hours">{t.restartEvery12}</option>
                  <option value="Every 6 hours">{t.restartEvery6}</option>
                  <option value="Disabled">{t.restartOff}</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  {t.backupIntervalLabel}
                </label>
                <select
                  value={formData.backupInterval}
                  onChange={(e) => setFormData({ ...formData, backupInterval: e.target.value })}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--surface-subtle)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: '5px',
                    padding: '8px 12px',
                    color: '#fff',
                    fontSize: '12.5px',
                    outline: 'none'
                  }}
                >
                  <option value="Every 30 minutes">{t.backup30m}</option>
                  <option value="Every 1 hour">{t.backup1h}</option>
                  <option value="Every 6 hours">{t.backup6h}</option>
                  <option value="Daily">{t.backupDaily}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Pasek akcji */}
        <div className="anim-slide-up delay-5" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            onClick={handleExportConfig}
            className="btn-secondary"
            style={{ height: '36px', padding: '0 16px', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Download size={14} />
            <span>{t.exportBtn}</span>
          </button>

          <button
            type="submit"
            className="btn-primary"
            disabled={isSaving}
            style={{ height: '36px', padding: '0 24px', fontSize: '13px' }}
          >
            <Save size={15} />
            <span>{isSaving ? t.savingBtn : t.saveBtn}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
