'use client';

import React, { useState } from 'react';
import {
  Boxes,
  RotateCw,
  Play,
  Square,
  Search,
  CheckCircle2,
  AlertTriangle,
  FolderTree,
  Terminal,
  Zap
} from 'lucide-react';

export default function ResourcesTab({ resources, onToggleResource, onRestartResource, onToast }) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [ensureInput, setEnsureInput] = useState('');

  const filtered = resources.filter((r) => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.author.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (filterType === 'all') return true;
    if (filterType === 'stopped') return r.status === 'stopped';
    return r.type === filterType;
  });

  const handleEnsureSubmit = (e) => {
    e.preventDefault();
    if (!ensureInput.trim()) return;
    onToast?.(`[FXServer] Executed: ensure ${ensureInput.trim()}`);
    setEnsureInput('');
  };

  const handleRefreshAll = () => {
    onToast?.('[FXServer] Scanning resource directory... 87 resources manifest reloaded.');
  };

  return (
    <div className="anim-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '0 28px 28px' }}>
      {/* statystyki gornego banerka */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px'
      }}>
        <div className="panel-card anim-slide-up delay-1" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Manifested Resources</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#fff', marginTop: '4px' }} className="num-tabular">
            {resources.length} <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 400 }}>total</span>
          </div>
        </div>
        <div className="panel-card anim-slide-up delay-2" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Active Runtime</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--status-success)', marginTop: '4px' }} className="num-tabular">
            {resources.filter((r) => r.status === 'started').length} <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 400 }}>running</span>
          </div>
        </div>
        <div className="panel-card anim-slide-up delay-3" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Dormant / Stopped</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--status-warning)', marginTop: '4px' }} className="num-tabular">
            {resources.filter((r) => r.status === 'stopped').length} <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 400 }}>inactive</span>
          </div>
        </div>
        <div className="panel-card anim-slide-up delay-4" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Lua Memory Pool</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#c4b5fd', marginTop: '4px' }} className="num-tabular">
            148.6 MB <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 400 }}>allocated</span>
          </div>
        </div>
      </div>

      {/* kontrolki akcji i wiersz polecen ensure */}
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
          minWidth: '260px'
        }}>
          <Search size={14} color="var(--text-muted)" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources by name..."
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

        {/* formularz komendy ensure */}
        <form onSubmit={handleEnsureSubmit} style={{ display: 'flex', gap: '6px' }}>
          <input
            type="text"
            value={ensureInput}
            onChange={(e) => setEnsureInput(e.target.value)}
            placeholder="ensure [resource_name]..."
            style={{
              backgroundColor: 'var(--surface-subtle)',
              border: '1px solid var(--border-primary)',
              borderRadius: '5px',
              padding: '6px 10px',
              color: '#fff',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              outline: 'none',
              width: '180px'
            }}
          />
          <button type="submit" className="btn-secondary" style={{ height: '31px', fontSize: '11.5px' }}>
            <Zap size={13} color="var(--brand-purple)" />
            <span>Ensure</span>
          </button>
        </form>

        {/* glowne przyciski */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleRefreshAll} className="btn-secondary" style={{ height: '31px', fontSize: '12px' }}>
            <RotateCw size={13} />
            <span>Reload Manifest</span>
          </button>
        </div>
      </div>

      {/* chipy filtrowania kategori */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: 'All Resources' },
          { id: 'framework', label: 'Framework Core' },
          { id: 'system', label: 'Systems & Inventory' },
          { id: 'dependency', label: 'Dependencies' },
          { id: 'voice', label: 'Voice & Comms' },
          { id: 'character', label: 'Character & Skin' },
          { id: 'stopped', label: 'Stopped Only' }
        ].map((chip) => {
          const active = filterType === chip.id;
          return (
            <button
              key={chip.id}
              onClick={() => setFilterType(chip.id)}
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

      {/* tabela zasobuw */}
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
              <th style={{ padding: '12px 18px' }}>RESOURCE</th>
              <th style={{ padding: '12px 16px' }}>AUTHOR / VERSION</th>
              <th style={{ padding: '12px 16px' }}>TYPE</th>
              <th style={{ padding: '12px 16px' }}>STATUS</th>
              <th style={{ padding: '12px 18px', textAlign: 'right' }}>CONTROLS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((res, idx) => {
              const isStarted = res.status === 'started';
              return (
                <tr
                  key={res.name}
                  className="interactive-row anim-row-stagger"
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    animationDelay: `${Math.min(idx * 30, 420)}ms`
                  }}
                >
                  <td style={{ padding: '12px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Boxes size={15} color="#c4b5fd" />
                      <span style={{ fontWeight: 600, color: '#fff', fontFamily: 'var(--font-mono)' }}>
                        {res.name}
                      </span>
                    </div>
                  </td>

                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                    <span>{res.author}</span> · <span style={{ color: 'var(--text-secondary)' }}>{res.version}</span>
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      fontSize: '11px',
                      padding: '2px 7px',
                      borderRadius: '4px',
                      backgroundColor: 'var(--surface-subtle)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border-subtle)'
                    }}>
                      {res.type}
                    </span>
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      backgroundColor: isStarted ? 'var(--status-success-bg)' : 'var(--status-warning-bg)',
                      color: isStarted ? 'var(--status-success)' : 'var(--status-warning)',
                      border: `1px solid ${isStarted ? 'var(--status-success-border)' : 'var(--status-warning-border)'}`
                    }}>
                      <span style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        backgroundColor: isStarted ? 'var(--status-success)' : 'var(--status-warning)'
                      }} />
                      {isStarted ? 'STARTED' : 'STOPPED'}
                    </span>
                  </td>

                  <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        onClick={() => onRestartResource(res.name)}
                        className="btn-secondary"
                        style={{ height: '28px', padding: '0 8px', fontSize: '11.5px' }}
                        title="Restart script"
                      >
                        <RotateCw size={12} />
                        <span>Restart</span>
                      </button>
                      <button
                        onClick={() => onToggleResource(res.name)}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          borderRadius: '4px',
                          fontSize: '11.5px',
                          fontWeight: 500,
                          backgroundColor: isStarted ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                          color: isStarted ? '#f87171' : '#4ade80',
                          border: `1px solid ${isStarted ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`
                        }}
                      >
                        {isStarted ? 'Stop' : 'Start'}
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
