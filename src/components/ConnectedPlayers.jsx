'use client';

import React, { useState } from 'react';
import { ChevronRight, Search, Shield, Eye } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function ConnectedPlayers({ players, onInspectPlayer, onViewAll }) {
  const { t } = useLanguage();
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = players.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || String(p.id).includes(q) || p.job.toLowerCase().includes(q);
  });

  const displayList = showAll ? filtered : filtered.slice(0, 4);

  const getRoleStyle = (jobType) => {
    switch (jobType) {
      case 'police':
        return {
          bg: 'rgba(37, 99, 235, 0.15)',
          color: '#60a5fa',
          border: '1px solid rgba(37, 99, 235, 0.3)',
          dot: '#3b82f6'
        };
      case 'ems':
        return {
          bg: 'rgba(239, 68, 68, 0.15)',
          color: '#f87171',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          dot: '#ef4444'
        };
      case 'mechanic':
        return {
          bg: 'rgba(217, 119, 6, 0.15)',
          color: '#fbbf24',
          border: '1px solid rgba(217, 119, 6, 0.3)',
          dot: '#f59e0b'
        };
      default:
        return {
          bg: 'transparent',
          color: 'var(--text-secondary)',
          border: 'none',
          dot: null
        };
    }
  };

  const getPingColor = (ping) => {
    if (ping < 50) return 'var(--status-success)';
    if (ping < 90) return 'var(--status-warning)';
    return 'var(--status-danger)';
  };

  return (
    <div className="panel-card anim-slide-left delay-3" style={{ flex: '1 1 58%', minWidth: '480px', overflow: 'hidden' }}>
      {/* naglowek karty */}
      <div style={{
        padding: '18px 22px 14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>
            {t.connected.title}
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {t.connected.subtitle}
          </p>
        </div>

        <button
          onClick={() => setShowAll(!showAll)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            fontWeight: 500,
            color: 'var(--text-secondary)',
            transition: 'color 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <span>{showAll ? 'Collapse' : `${t.connected.viewAll} (${players.length})`}</span>
          <ChevronRight size={13} />
        </button>
      </div>

      {/* tabelka graczy */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
          <thead>
            <tr style={{
              backgroundColor: 'var(--surface-subtle)',
              borderBottom: '1px solid var(--border-primary)',
              color: 'var(--text-muted)',
              fontSize: '10.5px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase'
            }}>
              <th style={{ padding: '10px 18px', width: '50px' }}>{t.connected.thId}</th>
              <th style={{ padding: '10px 16px' }}>{t.connected.thPlayer}</th>
              <th style={{ padding: '10px 16px' }}>{t.connected.thJob}</th>
              <th style={{ padding: '10px 16px', width: '70px' }}>{t.connected.thPing}</th>
              <th style={{ padding: '10px 16px', width: '90px' }}>{t.connected.thSession}</th>
              <th style={{ padding: '10px 18px', width: '80px', textAlign: 'right' }}>{t.connected.thAction}</th>
            </tr>
          </thead>
          <tbody>
            {displayList.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                  {t.playersTab.noPlayersFound}
                </td>
              </tr>
            ) : (
              displayList.map((player, idx) => {
              const roleStyle = getRoleStyle(player.jobType);
              return (
                <tr
                  key={player.id}
                  className="interactive-row anim-row-stagger"
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    animationDelay: `${idx * 45}ms`
                  }}
                >
                  {/* idik */}
                  <td style={{ padding: '12px 18px', color: 'var(--text-muted)', fontWeight: 500 }} className="num-tabular">
                    #{player.id}
                  </td>

                  {/* nazwa gracza i ranga */}
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        backgroundColor: player.avatarBg,
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 700
                      }}>
                        {player.avatarLetter}
                      </div>
                      <span style={{ fontWeight: 600, color: '#fff', fontSize: '13px' }}>
                        {player.name}
                      </span>
                      {player.tag && (
                        <span style={{
                          fontSize: '9.5px',
                          fontWeight: 700,
                          padding: '1px 5px',
                          borderRadius: '3px',
                          backgroundColor: 'rgba(124, 58, 237, 0.25)',
                          color: '#c4b5fd',
                          border: '1px solid rgba(124, 58, 237, 0.4)',
                          letterSpacing: '0.04em'
                        }}>
                          {player.tag}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* rola lub praca */}
                  <td style={{ padding: '12px 16px' }}>
                    {roleStyle.dot ? (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: '4px',
                        backgroundColor: roleStyle.bg,
                        color: roleStyle.color,
                        border: roleStyle.border
                      }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: roleStyle.dot }} />
                        {player.job}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 500 }}>
                        {player.job}
                      </span>
                    )}
                  </td>

                  {/* pingi */}
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      color: getPingColor(player.ping),
                      fontWeight: 600,
                      fontSize: '12px'
                    }} className="num-tabular">
                      {player.ping}ms
                    </span>
                  </td>

                  {/* czas trfania sesji */}
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }} className="num-tabular">
                    {player.sessionDuration}
                  </td>

                  {/* akcje */}
                  <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                    <button
                      onClick={() => onInspectPlayer(player)}
                      style={{
                        color: 'var(--text-secondary)',
                        fontSize: '11px',
                        fontWeight: 500,
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--surface-subtle)',
                        transition: 'all 0.14s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#fff';
                        e.currentTarget.style.borderColor = 'var(--border-highlight)';
                        e.currentTarget.style.backgroundColor = 'var(--surface-panel)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--text-secondary)';
                        e.currentTarget.style.borderColor = 'var(--border-subtle)';
                        e.currentTarget.style.backgroundColor = 'var(--surface-subtle)';
                      }}
                    >
                      {t.connected.inspect}
                    </button>
                  </td>
                </tr>
              );
            }))}
          </tbody>
        </table>
      </div>

      {/* stopka tabelki */}
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
        <span>Showing {displayList.length} active high-engagement sessions</span>
        <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>txAdmin Live Sync</span>
      </div>
    </div>
  );
}
