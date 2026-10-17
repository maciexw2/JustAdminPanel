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
  ListChecks,
  AlertTriangle,
  AlertCircle,
  ArrowRight,
  XCircle
} from 'lucide-react';

import { useLanguage } from '@/lib/LanguageContext';

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
  const { t, lang, setLang } = useLanguage();
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  const tabMetadata = {
    dashboard: {
      title: t.header.tabs.dashboard.title,
      subtitle: t.header.tabs.dashboard.subtitle,
      subPath: 'control-plane'
    },
    players: {
      title: t.header.tabs.players.title,
      subtitle: t.header.tabs.players.subtitle,
      subPath: 'players'
    },
    moderation: {
      title: t.header.tabs.moderation.title,
      subtitle: t.header.tabs.moderation.subtitle,
      subPath: 'moderation'
    },
    resources: {
      title: t.header.tabs.resources.title,
      subtitle: t.header.tabs.resources.subtitle,
      subPath: 'resources'
    },
    server: {
      title: t.header.tabs.server.title,
      subtitle: t.header.tabs.server.subtitle,
      subPath: 'telemetry'
    },
    logs: {
      title: t.header.tabs.logs.title,
      subtitle: t.header.tabs.logs.subtitle,
      subPath: 'console'
    },
    settings: {
      title: t.header.tabs.settings.title,
      subtitle: t.header.tabs.settings.subtitle,
      subPath: 'settings'
    },
    admins: {
      title: t.header.tabs.admins.title,
      subtitle: t.header.tabs.admins.subtitle,
      subPath: 'admins'
    },
    checklist: {
      title: t.header.tabs.checklist.title,
      subtitle: t.header.tabs.checklist.subtitle,
      subPath: 'deployment-checklist'
    }
  };

  const currentTab = tabMetadata[activeTab] || tabMetadata.dashboard;
  const isConnected = serverInfo?.status === 'ONLINE';

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
            <span>{t.header.preflightPill}</span>
          </button>

          {/* odznaka statusu serwera */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: isConnected ? 'var(--surface-panel)' : 'rgba(239, 68, 68, 0.12)',
            border: isConnected ? '1px solid var(--border-primary)' : '1px solid rgba(239, 68, 68, 0.35)',
            padding: '5px 12px',
            borderRadius: '9999px',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.04em'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: isConnected ? 'var(--status-success)' : 'var(--status-danger)',
              boxShadow: isConnected ? '0 0 8px var(--status-success)' : '0 0 8px var(--status-danger)',
              display: 'inline-block'
            }} />
            <span style={{ color: isConnected ? 'var(--status-success)' : 'var(--status-danger)', fontWeight: 700 }}>
              {isConnected ? t.header.online : 'OFFLINE'}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>|</span>
            <span style={{ color: isConnected ? 'var(--text-primary)' : 'var(--text-muted)' }} className="num-tabular">
              {serverInfo?.onlinePlayers || 0} / {serverInfo?.maxPlayers || 0} {t.header.playersCount}
            </span>
          </div>

          {/* przelacznik jezyka w headerze */}
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              type="button"
              onClick={() => setLang('pl')}
              title="Język Polski"
              style={{
                padding: '4px 8px',
                fontSize: '11px',
                fontWeight: 600,
                borderRadius: '5px',
                border: lang === 'pl' ? '1px solid var(--brand-purple)' : '1px solid var(--border-primary)',
                backgroundColor: lang === 'pl' ? 'rgba(124, 58, 237, 0.22)' : 'var(--surface-panel)',
                color: lang === 'pl' ? '#fff' : 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              PL
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              title="English"
              style={{
                padding: '4px 8px',
                fontSize: '11px',
                fontWeight: 600,
                borderRadius: '5px',
                border: lang === 'en' ? '1px solid var(--brand-purple)' : '1px solid var(--border-primary)',
                backgroundColor: lang === 'en' ? 'rgba(124, 58, 237, 0.22)' : 'var(--surface-panel)',
                color: lang === 'en' ? '#fff' : 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              EN
            </button>
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
              title={t.header.notifications}
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
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>{t.header.notifications}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{t.header.noNotifications}</span>
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
                title={t.header.logout}
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
            <span>{t.header.refreshTelemetry}</span>
          </button>

          <button
            onClick={onOpenQuickActions}
            className="btn-primary"
          >
            <Zap size={14} fill="#fff" />
            <span>{t.header.quickActions}</span>
            <ChevronDown size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
