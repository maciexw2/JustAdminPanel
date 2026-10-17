'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import MetricCards from '@/components/MetricCards';
import PlayerActivityChart from '@/components/PlayerActivityChart';
import ServerHealth from '@/components/ServerHealth';
import ConnectedPlayers from '@/components/ConnectedPlayers';
import RecentActivity from '@/components/RecentActivity';
import ServerFooterBanner from '@/components/ServerFooterBanner';
import ConsoleModal from '@/components/ConsoleModal';
import PlayerInspectModal from '@/components/PlayerInspectModal';
import QuickActionsModal from '@/components/QuickActionsModal';
import ResourcesModal from '@/components/ResourcesModal';
import ToastContainer from '@/components/ToastContainer';
import LoginScreen from '@/components/LoginScreen';

import PlayersTab from '@/components/tabs/PlayersTab';
import ModerationTab from '@/components/tabs/ModerationTab';
import ResourcesTab from '@/components/tabs/ResourcesTab';
import ServerTab from '@/components/tabs/ServerTab';
import LogsTab from '@/components/tabs/LogsTab';
import SettingsTab from '@/components/tabs/SettingsTab';
import AdminsTab from '@/components/tabs/AdminsTab';
import ChecklistTab from '@/components/tabs/ChecklistTab';
import SupportTab from '@/components/tabs/SupportTab';
import { AlertTriangle, ArrowRight, RefreshCw, X } from 'lucide-react';

const emptyServerInfo = {
  name: 'FiveM FXServer',
  version: 'FXServer (Offline)',
  endpoint: '127.0.0.1:30120',
  txAdminVersion: 'v7.2.1',
  oneSync: 'OneSync BigMode',
  onlinePlayers: 0,
  maxPlayers: 0,
  registeredSlots: 0,
  uptime: 'Offline',
  uptimeStarted: '-',
  fps: 0,
  tickTimeMs: 0,
  status: 'OFFLINE',
  healthRate: '0%',
  totalResources: 0,
  activeResources: 0,
  stoppedResources: 0
};

const emptyHardware = {
  cpuUsage: 0,
  cpuModel: 'Oczekiwanie na połączenie ze skryptem',
  cpuClock: '-',
  ramUsedGb: 0,
  ramTotalGb: 0,
  ramPercent: 0,
  outboundMbps: 0,
  inboundMbps: 0
};

export default function DashboardPage() {
  const { lang, t } = useLanguage();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const [serverInfo, setServerInfo] = useState(emptyServerInfo);
  const [hardware, setHardware] = useState(emptyHardware);
  const [players, setPlayers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [resources, setResources] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [inspectPlayer, setInspectPlayer] = useState(null);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('just_admin_theme');
      if (savedTheme) {
        const theme = JSON.parse(savedTheme);
        if (theme.brandColor) {
          document.documentElement.style.setProperty('--brand-purple', theme.brandColor);
          document.documentElement.style.setProperty('--brand-purple-glow', `${theme.brandColor}40`);
        }
        if (theme.surfaceBase) document.documentElement.style.setProperty('--surface-base', theme.surfaceBase);
        if (theme.surfacePanel) document.documentElement.style.setProperty('--surface-panel', theme.surfacePanel);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('just_admin_user') || sessionStorage.getItem('just_admin_user');
      if (saved) {
        setUser(JSON.parse(saved));
        setIsAuthenticated(true);
      }
    } catch {}
    setIsAuthChecking(false);
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('just_admin_user');
      sessionStorage.removeItem('just_admin_user');
    } catch {}
    setUser(null);
    setIsAuthenticated(false);
    addToast(lang === 'pl' ? 'Wylogowano z panelu' : 'Logged out from panel');
  };

  const stoppedCount = resources.filter((r) => r.status === 'stopped').length;

  const addToast = (message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loadData = async () => {
    try {
      const [statusRes, playersRes, resourcesRes] = await Promise.all([
        fetch('/api/status').then((r) => r.json()).catch(() => null),
        fetch('/api/players').then((r) => r.json()).catch(() => null),
        fetch('/api/resources').then((r) => r.json()).catch(() => null)
      ]);

      if (statusRes?.server) {
        setServerInfo(statusRes.server);
      }
      if (statusRes?.hardware) {
        setHardware(statusRes.hardware);
      }
      if (Array.isArray(playersRes?.players)) {
        setPlayers(playersRes.players);
      } else {
        setPlayers([]);
      }
      if (Array.isArray(resourcesRes?.resources)) {
        setResources(resourcesRes.resources);
      } else {
        setResources([]);
      }
    } catch (e) {}
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    addToast(lang === 'pl' ? 'Synchronizowanie telemetrii txAdmin i stanu OneSync...' : 'Synchronizing txAdmin telemetry and OneSync state...');

    try {
      await loadData();
      addToast(lang === 'pl' ? 'Pomyślnie odświeżono telemetrię' : 'Telemetry refreshed successfully');
    } catch (err) {
      addToast(lang === 'pl' ? 'Odświeżono telemetrię (tryb fallback)' : 'Telemetry refreshed (fallback mode)');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleKickPlayer = async (playerId, reason) => {
    const target = players.find((p) => p.id === playerId);
    if (!target) return;

    setPlayers((prev) => prev.filter((p) => p.id !== playerId));
    setServerInfo((prev) => ({
      ...prev,
      onlinePlayers: Math.max(0, prev.onlinePlayers - 1)
    }));

    const newLog = {
      id: `log-${Date.now()}`,
      type: 'kick',
      admin: user?.username || 'Admin',
      actionText: `${user?.username || 'Admin'} ${lang === 'pl' ? 'wyrzucił Gracza' : 'kicked Player'} #${playerId}`,
      timeAgo: lang === 'pl' ? 'Przed chwilą' : 'Just now',
      detail: `${lang === 'pl' ? 'Powód' : 'Reason'}: ${reason || (lang === 'pl' ? 'Interwencja personelu' : 'Staff intervention')}`
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 5)]);
    addToast(lang === 'pl' ? `Gracz #${playerId} (${target.name}) został wyrzucony` : `Player #${playerId} (${target.name}) was kicked`);

    try {
      await fetch('/api/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'kick', playerId, reason })
      });
    } catch (e) {
    }
  };

  const handleBanPlayer = async (playerId, reason) => {
    const target = players.find((p) => p.id === playerId);
    if (!target) return;

    setPlayers((prev) => prev.filter((p) => p.id !== playerId));
    setServerInfo((prev) => ({
      ...prev,
      onlinePlayers: Math.max(0, prev.onlinePlayers - 1)
    }));

    const newLog = {
      id: `log-${Date.now()}`,
      type: 'ban',
      admin: user?.username || 'Admin',
      actionText: `${user?.username || 'Admin'} ${lang === 'pl' ? 'zbanował Gracza' : 'banned Player'} #${playerId}`,
      timeAgo: lang === 'pl' ? 'Przed chwilą' : 'Just now',
      detail: `${lang === 'pl' ? 'Powód' : 'Reason'}: ${reason || (lang === 'pl' ? 'Permanentny ban' : 'Permanent ban')}`
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 5)]);
    addToast(lang === 'pl' ? `Nałożono permanentny ban na Gracza #${playerId} (${target.name})` : `Permanent ban issued for Player #${playerId} (${target.name})`);

    try {
      await fetch('/api/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ban', playerId, reason })
      });
      await fetch('/api/bans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player: target.name, reason, steamHex: target.steamHex })
      });
    } catch (e) {
    }
  };

  const handleRevivePlayer = async (playerId) => {
    const target = players.find((p) => p.id === playerId);
    const targetName = target ? target.name : `#${playerId}`;

    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, health: 100, armor: 100 } : p))
    );

    addToast(lang === 'pl' ? `Uleczono i ożywiono Gracza ${targetName}` : `Healed & revived Player ${targetName}`);

    const newLog = {
      id: `log-${Date.now()}`,
      type: 'revive',
      admin: user?.username || 'Admin',
      actionText: `${user?.username || 'Admin'} ${lang === 'pl' ? 'ożywił Gracza' : 'revived Player'} #${playerId}`,
      timeAgo: lang === 'pl' ? 'Przed chwilą' : 'Just now',
      detail: lang === 'pl' ? 'Przywrócono 100% życia i kamizelki' : 'Restored 100% HP & Armor'
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 5)]);

    try {
      await fetch('/api/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'revive', playerId })
      });
    } catch (e) {}
  };

  const handleTeleportPlayer = async (playerId, coords) => {
    const target = players.find((p) => p.id === playerId);
    const targetName = target ? target.name : `#${playerId}`;

    addToast(lang === 'pl' ? `Teleportowano do Gracza ${targetName}` : `Teleported to Player ${targetName}`);

    try {
      await fetch('/api/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'teleport', playerId, coords })
      });
    } catch (e) {}
  };

  const handleToggleResource = async (resName) => {
    const target = resources.find((r) => r.name === resName);
    const willStop = target?.status === 'started';

    setResources((prev) =>
      prev.map((r) => {
        if (r.name !== resName) return r;
        const newStatus = r.status === 'started' ? 'stopped' : 'started';
        return { ...r, status: newStatus };
      })
    );

    setServerInfo((prev) => ({
      ...prev,
      activeResources: willStop ? prev.activeResources - 1 : prev.activeResources + 1,
      stoppedResources: willStop ? prev.stoppedResources + 1 : prev.stoppedResources - 1
    }));

    addToast(
      lang === 'pl'
        ? `Zasób "${resName}" został ${willStop ? 'zatrzymany' : 'uruchomiony'}`
        : `Resource "${resName}" ${willStop ? 'stopped' : 'started'}`
    );

    try {
      await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: willStop ? 'stop' : 'start', resourceName: resName })
      });
    } catch (e) {
    }
  };

  const handleRestartResource = async (resName) => {
    addToast(lang === 'pl' ? `Restartowanie zasobu "${resName}"...` : `Restarting resource "${resName}"...`);
    const newLog = {
      id: `log-${Date.now()}`,
      type: 'restart',
      admin: user?.username || 'Admin',
      actionText: `${user?.username || 'Admin'} ${lang === 'pl' ? 'zrestartował' : 'restarted'} ${resName}`,
      timeAgo: lang === 'pl' ? 'Przed chwilą' : 'Just now',
      detail: lang === 'pl' ? 'Przebudowano pamięć podręczną i zarejestrowano eksporty' : 'Rebuilt cache and re-registered client exports'
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 5)]);

    try {
      await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'restart', resourceName: resName })
      });
    } catch (e) {
    }
  };

  if (!isAuthenticated && !isAuthChecking) {
    return (
      <>
        <LoginScreen
          onLogin={(loggedInUser) => {
            setUser(loggedInUser);
            setIsAuthenticated(true);
            addToast(lang === 'pl' ? `Zalogowano jako ${loggedInUser.username}` : `Logged in as ${loggedInUser.username}`);
          }}
        />
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--surface-base)' }}>
      {/* pasek boczny z zakladkamy */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        playerCount={players.length}
        stoppedCount={stoppedCount}
      />

      {/* glowny obszar roboczy */}
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* dynmaiczny naglowek */}
        <Header
          serverInfo={serverInfo}
          activeTab={activeTab}
          user={user}
          onLogout={handleLogout}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          onOpenQuickActions={() => setIsQuickActionsOpen(true)}
          onOpenConsole={() => setIsConsoleOpen(true)}
          onCopyIp={() => addToast(`Copied ${serverInfo.endpoint}`)}
          onNavigateTab={(tab) => setActiveTab(tab)}
        />

        {/* zakladki z animacja przejscia */}
        <div key={activeTab} className="tab-pane-transition">
          {activeTab === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <MetricCards
                serverInfo={serverInfo}
                onOpenResources={() => setActiveTab('resources')}
                onToast={addToast}
              />

              <div style={{ display: 'flex', gap: '14px', padding: '0 28px', flexWrap: 'wrap' }}>
                <PlayerActivityChart
                  data={serverInfo.status === 'ONLINE' ? [
                    { time: '00:00', players: Math.max(0, Math.floor(serverInfo.onlinePlayers * 0.4)) },
                    { time: '06:00', players: Math.max(0, Math.floor(serverInfo.onlinePlayers * 0.2)) },
                    { time: '12:00', players: Math.max(0, Math.floor(serverInfo.onlinePlayers * 0.7)) },
                    { time: '18:00', players: Math.max(0, Math.floor(serverInfo.onlinePlayers * 0.9)) },
                    { time: 'Teraz', players: serverInfo.onlinePlayers, isCurrent: true }
                  ] : [
                    { time: '00:00', players: 0 },
                    { time: '06:00', players: 0 },
                    { time: '12:00', players: 0 },
                    { time: '18:00', players: 0 },
                    { time: 'Teraz', players: 0, isCurrent: true }
                  ]}
                  nowCount={serverInfo.onlinePlayers || 0}
                />
                <ServerHealth hardware={hardware} />
              </div>

              <div style={{ display: 'flex', gap: '14px', padding: '0 28px', flexWrap: 'wrap' }}>
                <ConnectedPlayers
                  players={players}
                  onInspectPlayer={(p) => setInspectPlayer(p)}
                  onViewAll={() => setActiveTab('players')}
                />
                <RecentActivity
                  logs={logs}
                  onOpenLogs={() => setActiveTab('logs')}
                />
              </div>

              <ServerFooterBanner
                serverInfo={serverInfo}
                onOpenConsole={() => setIsConsoleOpen(true)}
                onToast={addToast}
              />
            </div>
          )}

          {activeTab === 'players' && (
            <PlayersTab
              players={players}
              onInspectPlayer={(p) => setInspectPlayer(p)}
              onKickPlayer={handleKickPlayer}
              onBanPlayer={handleBanPlayer}
              onRevivePlayer={handleRevivePlayer}
              onTeleportPlayer={handleTeleportPlayer}
              onToast={addToast}
            />
          )}

          {activeTab === 'moderation' && (
            <ModerationTab onToast={addToast} />
          )}

          {activeTab === 'resources' && (
            <ResourcesTab
              resources={resources}
              onToggleResource={handleToggleResource}
              onRestartResource={handleRestartResource}
              onToast={addToast}
            />
          )}

          {activeTab === 'server' && (
            <ServerTab
              serverInfo={serverInfo}
              hardware={hardware}
              onToast={addToast}
            />
          )}

          {activeTab === 'logs' && (
            <LogsTab onToast={addToast} />
          )}

          {activeTab === 'settings' && (
            <SettingsTab
              serverInfo={serverInfo}
              onToast={addToast}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'admins' && (
            <AdminsTab onToast={addToast} />
          )}

          {activeTab === 'checklist' && (
            <ChecklistTab
              onNavigateTab={(tab) => setActiveTab(tab)}
              onToast={addToast}
            />
          )}

          {activeTab === 'support' && (
            <SupportTab onToast={addToast} />
          )}
        </div>
      </main>

      {/* modale szybkiego dostempu */}
      <ConsoleModal
        isOpen={isConsoleOpen}
        onClose={() => setIsConsoleOpen(false)}
        onToast={addToast}
      />

      <PlayerInspectModal
        player={inspectPlayer}
        isOpen={Boolean(inspectPlayer)}
        onClose={() => setInspectPlayer(null)}
        onKick={handleKickPlayer}
        onBan={handleBanPlayer}
        onRevive={handleRevivePlayer}
        onTeleport={handleTeleportPlayer}
        onToast={addToast}
      />

      <QuickActionsModal
        isOpen={isQuickActionsOpen}
        onClose={() => setIsQuickActionsOpen(false)}
        onToast={addToast}
        onOpenConsole={() => setIsConsoleOpen(true)}
      />

      <ResourcesModal
        resources={resources}
        isOpen={isResourcesOpen}
        onClose={() => setIsResourcesOpen(false)}
        onToggleResource={handleToggleResource}
        onRestartResource={handleRestartResource}
      />

      <ToastContainer toasts={toasts} onDismiss={removeToast} />
 
      {serverInfo.status !== 'ONLINE' && (
        <div
          className="anim-slide-up"
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '280px',
            right: '24px',
            zIndex: 900,
            pointerEvents: 'none'
          }}
        >
          <div
            style={{
              pointerEvents: 'auto',
              backgroundColor: 'rgba(24, 14, 18, 0.94)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(239, 68, 68, 0.45)',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.65), 0 0 24px rgba(239, 68, 68, 0.2)',
              borderRadius: '12px',
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '14px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '300px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(239, 68, 68, 0.18)',
                  border: '1px solid rgba(239, 68, 68, 0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <AlertTriangle size={18} color="#ef4444" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#fca5a5' }}>
                    {t.header.disconnectedBanner.title}
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(239, 68, 68, 0.25)',
                      color: '#fecaca',
                      letterSpacing: '0.04em'
                    }}
                  >
                    HTTP 401 / OFFLINE
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(254, 202, 202, 0.82)', marginTop: '2px', lineHeight: '16px' }}>
                  {t.header.disconnectedBanner.desc}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
              <button
                type="button"
                onClick={() => setActiveTab('checklist')}
                className="btn-secondary"
                style={{
                  height: '34px',
                  fontSize: '12px',
                  padding: '0 14px',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  borderColor: 'rgba(239, 68, 68, 0.5)',
                  color: '#fff'
                }}
              >
                <span>{t.header.disconnectedBanner.actionChecklist}</span>
                <ArrowRight size={13} />
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className="btn-primary"
                style={{
                  height: '34px',
                  fontSize: '12px',
                  padding: '0 14px',
                  backgroundColor: '#ef4444',
                  borderColor: '#ef4444'
                }}
              >
                <span>{t.header.disconnectedBanner.actionSettings}</span>
              </button>
              <button
                type="button"
                onClick={handleRefresh}
                className="btn-secondary"
                style={{
                  height: '34px',
                  fontSize: '12px',
                  padding: '0 10px',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  borderColor: 'rgba(239, 68, 68, 0.5)',
                  color: '#fff'
                }}
                title={t.header.disconnectedBanner.retry}
              >
                <RefreshCw size={13} className={isRefreshing ? 'anim-spin' : ''} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
