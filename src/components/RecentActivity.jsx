'use client';

import React from 'react';
import {
  Gavel,
  RotateCw,
  UserX,
  LogIn,
  Database,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function RecentActivity({ logs, onOpenLogs }) {
  const { t } = useLanguage();
  const getLogIcon = (type) => {
    switch (type) {
      case 'ban':
        return {
          icon: Gavel,
          bg: 'rgba(239, 68, 68, 0.15)',
          color: '#ef4444'
        };
      case 'restart':
        return {
          icon: RotateCw,
          bg: 'rgba(59, 130, 246, 0.15)',
          color: '#3b82f6'
        };
      case 'kick':
        return {
          icon: UserX,
          bg: 'rgba(245, 158, 11, 0.15)',
          color: '#f59e0b'
        };
      case 'join':
        return {
          icon: LogIn,
          bg: 'rgba(34, 197, 94, 0.15)',
          color: '#22c55e'
        };
      case 'backup':
        return {
          icon: Database,
          bg: 'rgba(161, 161, 170, 0.12)',
          color: '#a1a1aa'
        };
      default:
        return {
          icon: ShieldAlert,
          bg: 'rgba(124, 58, 237, 0.15)',
          color: '#c4b5fd'
        };
    }
  };

  return (
    <div className="panel-card anim-slide-right delay-3" style={{ flex: '1 1 38%', minWidth: '340px', display: 'flex', flexDirection: 'column' }}>
      {/* naglowek */}
      <div style={{
        padding: '18px 22px 14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>
            {t.activity.title}
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {t.activity.subtitle}
          </p>
        </div>

        <button
          onClick={onOpenLogs}
          style={{
            fontSize: '12px',
            fontWeight: 500,
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            transition: 'color 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          {t.activity.viewAllLogs} <ChevronRight size={13} />
        </button>
      </div>

      {/* strumien logow */}
      <div style={{ padding: '12px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {logs.length === 0 ? (
          <div style={{ padding: '24px 10px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
            Brak zarejestrowanych zdarzeń (Oczekiwanie na pierwsze akcje serwera)
          </div>
        ) : (
          logs.map((log, idx) => {
          const { icon: Icon, bg, color } = getLogIcon(log.type);
          return (
            <div
              key={log.id}
              className="anim-row-stagger"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '8px 10px',
                borderRadius: '6px',
                backgroundColor: 'var(--surface-subtle)',
                border: '1px solid var(--border-subtle)',
                transition: 'border-color 0.12s ease, transform 0.18s ease',
                animationDelay: `${idx * 55}ms`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-highlight)';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              {/* ikonka */}
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                backgroundColor: bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: color,
                flexShrink: 0,
                marginTop: '1px'
              }}>
                <Icon size={14} />
              </div>

              {/* teskt */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {log.actionText}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', flexShrink: 0 }} className="num-tabular">
                    {log.timeAgo}
                  </span>
                </div>
                <div style={{
                  fontSize: '11.5px',
                  color: 'var(--text-muted)',
                  marginTop: '2px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {log.detail}
                </div>
              </div>
            </div>
          );
        }))}
      </div>

      {/* stopka */}
      <div style={{
        padding: '12px 22px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '11px',
        color: 'var(--text-muted)',
        backgroundColor: 'var(--surface-base)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="live-pulse-dot" style={{ width: '5px', height: '5px' }} />
          <span>Listening to events</span>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.04em' }}>
          IVSS//JUST-V7
        </span>
      </div>
    </div>
  );
}
