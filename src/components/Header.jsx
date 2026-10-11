'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Bell,
  RefreshCw,
  Zap,
  ChevronDown,
  Terminal,
  RotateCcw,
  Volume2,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  LogOut,
  ListChecks
} from 'lucide-react';

export default function Header({
  serverInfo,
  activeTab = 'dashboard',
  user,
  onLogout,
  onRefresh,
  isRefreshing,
  onOpenQuickActions,
  onOpenConsole,
  onCopyIp,
  onNavigateTab
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  const tabMetadata = {
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Monitor your server and manage active players in real time.',
      subPath: 'control-plane'
    },
    players: {
      title: 'Player Management',
      subtitle: 'Monitor live connected participants, duty assignments, and player states.',
      subPath: 'players'
    },
    moderation: {
      title: 'Moderation & Enforcement',
      subtitle: 'Enforce server rules, txAdmin banlist, and player sanctions.',
      subPath: 'moderation'
    },
    resources: {
      title: 'Resource Orchestrator',
      subtitle: 'Manage FXServer manifests, Lua heaps, and script execution states.',
      subPath: 'resources'
    },
    server: {
      title: 'Server Telemetry & Performance',
      subtitle: 'Low-level node metrics, OneSync routing buckets, and thread diagnostics.',
      subPath: 'telemetry'
    },
    logs: {
      title: 'Console & Live Logs',
      subtitle: 'Interactive FXServer master console (RCON) and audit event stream.',
      subPath: 'console'
    },
    settings: {
      title: 'Control Plane Settings',
      subtitle: 'Server configuration, txAdmin bridges, API tokens, and Discord webhooks.',
      subPath: 'settings'
    },
    admins: {
      title: 'Staff & Administrator Roster',
      subtitle: 'Manage administrative roles, access control lists, and 2FA credentials.',
      subPath: 'admins'
    },
    checklist: {
      title: 'Production Deployment Checklist',
      subtitle: 'Vercel-style pre-flight verification: secure tokens, root credentials, and bridge secrets.',
      subPath: 'deployment-checklist'
    }
  };

  const currentTab = tabMetadata[activeTab] || tabMetadata.dashboard;

  const notifications = [
    { id: 1, title: 'txAdmin auto-saved', text: 'World player state synced successfully', time: '1m ago' },
    { id: 2, title: 'High ping detected', text: 'Player #102 ping spiked to 94ms', time: '5m ago' },
    { id: 3, title: 'Lua Memory Check', text: 'Resource just-core GC collected 4.2 MB', time: '12m ago' }
  ];

  return (
    <div className="anim-slide-down">
      {/* gorny paseczek */}
      <header style={{
        height: '56px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        backgroundColor: 'var(--surface-base)'
      }}>
        {/* lewa strona: okruszki */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '18px', height: '18px', position: 'relative' }}>
            <Image
              src="/logojust.png"
              alt="Logo"
              width={18}
              height={18}
              style={{ objectFit: 'contain' }}
            />
          </div>
          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
            JUST ADMINPANEL
          </span>
          <span style={{ color: 'var(--border-highlight)', fontSize: '12px' }}>/</span>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>
            {currentTab.subPath}
          </span>
        </div>

        {/* prawe kontrolki */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* przycisk checklisty Vercel-style */}
          <button
            type="button"
            onClick={() => onNavigateTab ? onNavigateTab('checklist') : null}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--surface-panel)',
              border: '1px solid rgba(124, 58, 237, 0.4)',
              padding: '5px 12px',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              color: '#c4b5fd',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--brand-purple)';
              e.currentTarget.style.boxShadow = '0 0 10px var(--brand-purple-glow)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.4)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <ListChecks size={13} color="var(--brand-purple)" />
            <span>Pre-flight Checklist</span>
          </button>

          {/* odznaka statusu serwera */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--surface-panel)',
            border: '1px solid var(--border-primary)',
            padding: '5px 12px',
            borderRadius: '9999px',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.04em'
          }}>
            <span className="live-pulse-dot" />
            <span style={{ color: 'var(--status-success)', fontWeight: 700 }}>ONLINE</span>
            <span style={{ color: 'var(--text-muted)' }}>|</span>
            <span style={{ color: 'var(--text-primary)' }} className="num-tabular">
              {serverInfo.onlinePlayers} / {serverInfo.maxPlayers} PLAYERS
            </span>
          </div>

          {/* dzwoneczek powiadomien */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) setUnreadCount(0);
              }}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '6px',
                backgroundColor: 'var(--surface-panel)',
                border: '1px solid var(--border-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                position: 'relative',
                transition: 'border-color 0.15s ease'
              }}
              title="Notifications"
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--brand-purple)'
                }} />
              )}
            </button>

            {/* rozwijane menu powiadomien */}
            {showNotifications && (
              <div style={{
                position: 'absolute',
                top: '42px',
                right: 0,
                width: '300px',
                backgroundColor: 'var(--surface-elevated)',
                border: '1px solid var(--border-primary)',
                borderRadius: '8px',
                padding: '12px',
                zIndex: 100,
                boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px',
                  borderBottom: '1px solid var(--border-subtle)',
                  paddingBottom: '8px'
                }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>Notifications</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>All caught up</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {notifications.map((n) => (
                    <div key={n.id} style={{
                      padding: '8px',
                      backgroundColor: 'var(--surface-subtle)',
                      borderRadius: '6px',
                      fontSize: '11px',
                      border: '1px solid var(--border-subtle)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontWeight: 500 }}>
                        <span>{n.title}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>{n.time}</span>
                      </div>
                      <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>{n.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* profil uzytkownka */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            paddingLeft: '6px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#7c3aed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '13px',
              color: '#fff',
              border: '1.5px solid rgba(255, 255, 255, 0.15)'
            }}>
              {user?.avatarLetter || 'M'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff', lineHeight: '16px' }}>
                {user?.username || 'Maciex'}
              </span>
              <span style={{
                fontSize: '10px',
                fontWeight: 600,
                color: 'var(--text-muted)',
                letterSpacing: '0.04em',
                lineHeight: '12px'
              }}>
                {user?.role || 'SUPER ADMIN'}
              </span>
            </div>

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                title="Wyloguj / Log out"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  marginLeft: '4px',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--status-danger)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* glowny rzond tytulu */}
      <div style={{
        padding: '24px 28px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div key={activeTab} className="anim-slide-left">
          <h1 style={{
            fontSize: '24px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#fff',
            lineHeight: '30px'
          }}>
            {currentTab.title}
          </h1>
          <p style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            marginTop: '3px'
          }}>
            {currentTab.subtitle}
          </p>
        </div>

        {/* przyciski akcji */}
        <div className="anim-slide-right" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onRefresh}
            className="btn-secondary"
            disabled={isRefreshing}
            style={{ opacity: isRefreshing ? 0.7 : 1 }}
          >
            <RefreshCw size={14} className={isRefreshing ? 'anim-spin' : ''} />
            <span>Refresh Data</span>
          </button>

          <button
            onClick={onOpenQuickActions}
            className="btn-primary"
          >
            <Zap size={14} fill="#fff" />
            <span>Quick Actions</span>
            <ChevronDown size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
