'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Shield,
  Heart,
  Wifi,
  Sparkles,
  Crosshair,
  UserX,
  Gavel,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function PlayersTab({ players, onInspectPlayer, onKickPlayer, onBanPlayer, onToast }) {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [sortBy, setSortBy] = useState('id');

  const roleCounts = {
    all: players.length,
    police: players.filter((p) => p.jobType === 'police').length,
    ems: players.filter((p) => p.jobType === 'ems').length,
    mechanic: players.filter((p) => p.jobType === 'mechanic').length,
    civilian: players.filter((p) => p.jobType === 'civilian').length
  };

  const filtered = players
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        String(p.id).includes(search) ||
        p.license.toLowerCase().includes(search.toLowerCase()) ||
        p.job.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;
      if (filterRole === 'all') return true;
      return p.jobType === filterRole;
    })
    .sort((a, b) => {
      if (sortBy === 'id') return a.id - b.id;
      if (sortBy === 'ping') return a.ping - b.ping;
      return a.name.localeCompare(b.name);
    });

  const getRoleStyle = (jobType) => {
    switch (jobType) {
      case 'police':
        return { bg: 'rgba(37, 99, 235, 0.15)', color: '#60a5fa', border: '1px solid rgba(37, 99, 235, 0.3)', dot: '#3b82f6' };
      case 'ems':
        return { bg: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', dot: '#ef4444' };
      case 'mechanic':
        return { bg: 'rgba(217, 119, 6, 0.15)', color: '#fbbf24', border: '1px solid rgba(217, 119, 6, 0.3)', dot: '#f59e0b' };
      default:
        return { bg: 'transparent', color: 'var(--text-secondary)', border: 'none', dot: null };
    }
  };

  return (
    <div className="anim-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '0 28px 28px' }}>
      {/* statystyki gornego banera */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px'
      }}>
        <div className="panel-card anim-slide-up delay-1" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.playersTab.statConnected}</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#fff', marginTop: '4px' }} className="num-tabular">
            {players.length} <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 400 }}>/ 128 {t.playersTab.slots}</span>
          </div>
        </div>
        <div className="panel-card anim-slide-up delay-2" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.playersTab.statPolice}</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#60a5fa', marginTop: '4px' }} className="num-tabular">
            {roleCounts.police} <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 400 }}>{t.playersTab.unitsActive}</span>
          </div>
        </div>
        <div className="panel-card anim-slide-up delay-3" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.playersTab.statEms}</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#f87171', marginTop: '4px' }} className="num-tabular">
            {roleCounts.ems} <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 400 }}>{t.playersTab.onDuty}</span>
          </div>
        </div>
        <div className="panel-card anim-slide-up delay-4" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.playersTab.statMechanics}</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#fbbf24', marginTop: '4px' }} className="num-tabular">
            {roleCounts.mechanic} <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 400 }}>{t.playersTab.inGarage}</span>
          </div>
        </div>
      </div>

      {/* pasek filtrowania i szukania */}
      <div className="panel-card anim-slide-up delay-2" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        {/* szukajka */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'var(--surface-subtle)',
          border: '1px solid var(--border-primary)',
          borderRadius: '5px',
          padding: '6px 12px',
          minWidth: '280px'
        }}>
          <Search size={14} color="var(--text-muted)" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.playersTab.searchPlaceholder}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '12.5px',
              outline: 'none',
              flex: 1
            }}
          />
        </div>

        {/* chipy filtrowania rol */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {[
            { id: 'all', label: `${t.playersTab.allRoles} (${roleCounts.all})` },
            { id: 'police', label: `${t.playersTab.police} (${roleCounts.police})` },
            { id: 'ems', label: `${t.playersTab.ems} (${roleCounts.ems})` },
            { id: 'mechanic', label: `${t.playersTab.mechanic} (${roleCounts.mechanic})` },
            { id: 'civilian', label: `${t.playersTab.civilian} (${roleCounts.civilian})` }
          ].map((chip) => {
            const active = filterRole === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => setFilterRole(chip.id)}
                style={{
                  fontSize: '11.5px',
                  fontWeight: active ? 600 : 500,
                  padding: '4px 10px',
                  borderRadius: '4px',
                  backgroundColor: active ? 'var(--brand-purple)' : 'var(--surface-subtle)',
                  color: active ? '#fff' : 'var(--text-secondary)',
                  border: `1px solid ${active ? 'var(--brand-purple)' : 'var(--border-subtle)'}`,
                  transition: 'all 0.12s ease'
                }}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* wybor sortowania */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              backgroundColor: 'var(--surface-subtle)',
              border: '1px solid var(--border-primary)',
              borderRadius: '4px',
              padding: '4px 8px',
              color: '#fff',
              fontSize: '12px',
              outline: 'none'
            }}
          >
            <option value="id">{t.playersTab.sortById}</option>
            <option value="ping">{t.playersTab.sortByPing}</option>
            <option value="name">{t.playersTab.sortByName}</option>
          </select>
        </div>
      </div>

      {/* pelna tabela graczy */}
      <div className="panel-card anim-slide-up delay-3" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
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
              <th style={{ padding: '12px 18px', width: '60px' }}>{t.playersTab.thId}</th>
              <th style={{ padding: '12px 16px' }}>{t.playersTab.thPlayer}</th>
              <th style={{ padding: '12px 16px' }}>{t.playersTab.thRole}</th>
              <th style={{ padding: '12px 16px' }}>{t.playersTab.thPing}</th>
              <th style={{ padding: '12px 16px' }}>{t.playersTab.thSession}</th>
              <th style={{ padding: '12px 16px' }}>{t.playersTab.thFinances}</th>
              <th style={{ padding: '12px 16px' }}>{t.playersTab.thHealth}</th>
              <th style={{ padding: '12px 18px', textAlign: 'right' }}>{t.playersTab.thModeration}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((player, idx) => {
              const roleStyle = getRoleStyle(player.jobType);
              return (
                <tr
                  key={player.id}
                  className="interactive-row anim-row-stagger"
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    animationDelay: `${Math.min(idx * 30, 420)}ms`
                  }}
                >
                  <td style={{ padding: '12px 18px', color: 'var(--text-muted)', fontWeight: 600 }} className="num-tabular">
                    #{player.id}
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                      <div style={{
                        width: '26px',
                        height: '26px',
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
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: 600, color: '#fff' }}>{player.name}</span>
                          {player.tag && (
                            <span style={{
                              fontSize: '9.5px',
                              fontWeight: 700,
                              padding: '1px 5px',
                              borderRadius: '3px',
                              backgroundColor: 'rgba(124, 58, 237, 0.25)',
                              color: '#c4b5fd',
                              border: '1px solid rgba(124, 58, 237, 0.4)'
                            }}>
                              {player.tag}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          {player.steamHex}
                        </div>
                      </div>
                    </div>
                  </td>

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

                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      color: player.ping < 50 ? 'var(--status-success)' : player.ping < 90 ? 'var(--status-warning)' : 'var(--status-danger)',
                      fontWeight: 600
                    }} className="num-tabular">
                      {player.ping}ms
                    </span>
                  </td>

                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }} className="num-tabular">
                    {player.sessionDuration}
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontSize: '12px', color: '#4ade80', fontWeight: 600 }} className="num-tabular">
                      {player.cash}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }} className="num-tabular">
                      {player.bank}
                    </div>
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '60px', height: '4px', backgroundColor: 'var(--surface-subtle)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: `${player.health}%`, height: '100%', backgroundColor: '#ef4444' }} />
                      </div>
                      <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }} className="num-tabular">{player.health}%</span>
                    </div>
                  </td>

                  <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        onClick={() => onInspectPlayer(player)}
                        className="btn-secondary"
                        style={{ height: '28px', padding: '0 8px', fontSize: '11.5px' }}
                      >
                        {t.playersTab.btnInspect}
                      </button>
                      <button
                        onClick={() => {
                          onToast?.(`Teleported admin to ${player.name}`);
                        }}
                        style={{
                          height: '28px',
                          padding: '0 6px',
                          borderRadius: '4px',
                          backgroundColor: 'var(--surface-subtle)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-secondary)'
                        }}
                        title="Teleport to player"
                      >
                        <Crosshair size={13} />
                      </button>
                      <button
                        onClick={() => {
                          onToast?.(`Healed & revived ${player.name}`);
                        }}
                        style={{
                          height: '28px',
                          padding: '0 6px',
                          borderRadius: '4px',
                          backgroundColor: 'var(--surface-subtle)',
                          border: '1px solid var(--border-subtle)',
                          color: '#4ade80'
                        }}
                        title="Heal / Revive"
                      >
                        <Sparkles size={13} />
                      </button>
                      <button
                        onClick={() => onKickPlayer(player.id, 'Staff intervention')}
                        style={{
                          height: '28px',
                          padding: '0 6px',
                          borderRadius: '4px',
                          backgroundColor: 'rgba(245, 158, 11, 0.1)',
                          border: '1px solid rgba(245, 158, 11, 0.3)',
                          color: '#fbbf24'
                        }}
                        title="Kick player"
                      >
                        <UserX size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
