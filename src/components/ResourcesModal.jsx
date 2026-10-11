'use client';

import React, { useState } from 'react';
import { X, Boxes, Search, Play, Square, RotateCw } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function ResourcesModal({ resources, isOpen, onClose, onToggleResource, onRestartResource }) {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = resources.filter((r) =>
    r.name.toLowerCase().includes(query.toLowerCase()) ||
    r.type.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '680px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* naglowek */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-primary)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--surface-panel)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Boxes size={18} color="var(--brand-purple)" />
            <span style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>
              {t.modals.resources.title}
            </span>
            <span style={{
              fontSize: '11px',
              padding: '1px 7px',
              borderRadius: '9999px',
              backgroundColor: 'var(--border-primary)',
              color: 'var(--text-secondary)'
            }}>
              {resources.length}
            </span>
          </div>

          <button
            onClick={onClose}
            style={{ color: 'var(--text-muted)', padding: '4px', borderRadius: '4px' }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--surface-subtle)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--surface-base)',
            border: '1px solid var(--border-primary)',
            borderRadius: '5px',
            padding: '6px 10px'
          }}>
            <Search size={14} color="var(--text-muted)" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.modals.resources.searchPlaceholder}
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
        </div>

        {/* tabela zasobow */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
            <thead>
              <tr style={{ color: 'var(--text-muted)', fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '10px 0' }}>{t.resourcesTab.thResource}</th>
                <th style={{ padding: '10px 0' }}>{t.resourcesTab.thType}</th>
                <th style={{ padding: '10px 0' }}>{t.resourcesTab.thStatus}</th>
                <th style={{ padding: '10px 0', textAlign: 'right' }}>{t.resourcesTab.thControls}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((res) => {
                const isStarted = res.status === 'started';
                return (
                  <tr key={res.name} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '10px 0' }}>
                      <div style={{ fontWeight: 600, color: '#fff', fontFamily: 'var(--font-mono)' }}>
                        {res.name}
                      </div>
                      <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                        {res.version} · by {res.author}
                      </div>
                    </td>

                    <td style={{ padding: '10px 0' }}>
                      <span style={{
                        fontSize: '10px',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        backgroundColor: 'var(--border-subtle)',
                        color: 'var(--text-secondary)'
                      }}>
                        {res.type}
                      </span>
                    </td>

                    <td style={{ padding: '10px 0' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '10.5px',
                        fontWeight: 600,
                        padding: '2px 7px',
                        borderRadius: '9999px',
                        backgroundColor: isStarted ? 'var(--status-success-bg)' : 'var(--status-warning-bg)',
                        color: isStarted ? 'var(--status-success)' : 'var(--status-warning)',
                        border: `1px solid ${isStarted ? 'var(--status-success-border)' : 'var(--status-warning-border)'}`
                      }}>
                        <span style={{
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          backgroundColor: isStarted ? 'var(--status-success)' : 'var(--status-warning)'
                        }} />
                        {isStarted ? (t.resourcesTab.running).toUpperCase() : (t.resourcesTab.stopped).toUpperCase()}
                      </span>
                    </td>

                    <td style={{ padding: '10px 0', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => onRestartResource(res.name)}
                          style={{
                            padding: '4px 6px',
                            borderRadius: '4px',
                            backgroundColor: 'var(--surface-subtle)',
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--border-subtle)'
                          }}
                          title={t.modals.resources.restart}
                        >
                          <RotateCw size={12} />
                        </button>
                        <button
                          onClick={() => onToggleResource(res.name)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            backgroundColor: isStarted ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                            color: isStarted ? '#f87171' : '#4ade80',
                            border: `1px solid ${isStarted ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`,
                            fontSize: '11px',
                            fontWeight: 500
                          }}
                        >
                          {isStarted ? t.modals.resources.stop : t.modals.resources.start}
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
    </div>
  );
}
