'use client';

import React, { useState, useEffect } from 'react';
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

import {
  initialServerInfo,
  initialHardware,
  activityData24h,
  initialPlayers,
  initialAuditLogs,
  initialResources
} from '@/data/mockServerData';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const [serverInfo, setServerInfo] = useState(initialServerInfo);
  const [hardware, setHardware] = useState(initialHardware);
  const [players, setPlayers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [resources, setResources] = useState(initialResources);
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
    addToast('Wylogowano z panelu');
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

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [statusRes, playersRes, bansRes] = await Promise.all([
          fetch('/api/status').then((r) => r.json()),
          fetch('/api/players').then((r) => r.json()),
          fetch('/api/bans').then((r) => r.json())
        ]);

        if (statusRes.server) setServerInfo(statusRes.server);
        if (statusRes.hardware) setHardware(statusRes.hardware);
        if (Array.isArray(playersRes.players)) setPlayers(playersRes.players);
      } catch (e) {
      }
    }

    loadInitialData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    addToast('Synchronizing txAdmin telemetry and OneSync state...');

    try {
      const [statusRes, playersRes] = await Promise.all([
        fetch('/api/status').then((r) => r.json()),
        fetch('/api/players').then((r) => r.json())
      ]);

      if (statusRes.server) {
        setServerInfo(statusRes.server);
      } else {
        setServerInfo((prev) => ({
          ...prev,
          fps: +(59.5 + Math.random() * 1.5).toFixed(1),
          tickTimeMs: +(16.2 + Math.random() * 0.8).toFixed(1)
        }));
      }

      if (statusRes.hardware) setHardware(statusRes.hardware);
      if (playersRes.players && playersRes.players.length > 0) setPlayers(playersRes.players);

      addToast('Telemetry refreshed successfully');
    } catch (err) {
      addToast('Telemetry refreshed (fallback mode)');
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
      admin: 'Maciex',
      actionText: `QLin kicked Player #${playerId}`,
      timeAgo: 'Just now',
      detail: `Reason: ${reason || 'Staff intervention'}`
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 5)]);
    addToast(`Player #${playerId} (${target.name}) was kicked`);

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
      admin: 'Maciex',
      actionText: `Maciex banned Player #${playerId}`,
      timeAgo: 'Just now',
      detail: `Reason: ${reason || 'Permanent txAdmin ban'}`
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 5)]);
    addToast(`Permanent ban issued for Player #${playerId} (${target.name})`);

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

    addToast(`Resource "${resName}" ${willStop ? 'stopped' : 'started'}`);

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
    addToast(`Restarting resource "${resName}"...`);
    const newLog = {
      id: `log-${Date.now()}`,
      type: 'restart',
      admin: 'Maciex',
      actionText: `Maciex restarted ${resName}`,
      timeAgo: 'Just now',
      detail: 'Rebuilt cache and re-registered client exports'
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
            addToast(`Zalogowano jako ${loggedInUser.username}`);
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
                  data={activityData24h}
                  nowCount={serverInfo.onlinePlayers}
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
    </div>
  );
}
