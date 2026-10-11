'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  Gavel,
  UserX,
  AlertTriangle,
  Search,
  Plus,
  Clock,
  CheckCircle2,
  X
} from 'lucide-react';

const initialBans = [
  {
    id: 'BAN-9821',
    player: 'Player #124 (NexusCheater)',
    steamHex: 'steam:11000018f2a912b',
    reason: 'Cheating / Lua Executor (Permanent)',
    admin: 'Maciex (Super Admin)',
    issuedAt: '10m ago',
    duration: 'PERMANENT',
    isPermanent: true
  },
  {
    id: 'BAN-9818',
    player: 'SpeedyDemon_PL',
    steamHex: 'steam:11000014a99182c',
    reason: 'Severe VDM in Greenzone (Legion Square)',
    admin: 'Vega (Admin)',
    issuedAt: '2h ago',
    duration: '3 days remaining',
    isPermanent: false
  },
  {
    id: 'BAN-9799',
    player: 'TrollMan99',
    steamHex: 'steam:11000012b48192a',
    reason: 'Combat Logging during active police pursuit',
    admin: 'QLin (Admin)',
    issuedAt: '1d ago',
    duration: '6 days remaining',
    isPermanent: false
  },
  {
    id: 'BAN-9762',
    player: 'ShadowExploiter',
    steamHex: 'steam:11000010c928471',
    reason: 'Duplication glitch abuse with ox_inventory trunk',
    admin: 'Maciex (Super Admin)',
    issuedAt: '3d ago',
    duration: 'PERMANENT',
    isPermanent: true
  }
];

const initialWarnings = [
  {
    id: 'WARN-102',
    player: 'John_Doe (#102)',
    reason: 'OOC chat usage during hostage negotiation',
    admin: 'Vega',
    issuedAt: '45m ago',
    activeCount: 1
  },
  {
    id: 'WARN-101',
    player: 'Kacper_K (#114)',
    reason: 'Reckless driving inside Hospital emergency bay',
    admin: 'QLin',
    issuedAt: '3h ago',
    activeCount: 2
  }
];

export default function ModerationTab({ onToast }) {
  const [bans, setBans] = useState(initialBans);
  const [warnings, setWarnings] = useState(initialWarnings);
  const [search, setSearch] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('bans');
  const [showNewBanModal, setShowNewBanModal] = useState(false);

  // stan formularza nowego bana
  const [newBanTarget, setNewBanTarget] = useState('');
  const [newBanReason, setNewBanReason] = useState('');
  const [newBanDuration, setNewBanDuration] = useState('Permanent');

  React.useEffect(() => {
    fetch('/api/bans')
      .then((r) => r.json())
      .then((data) => {
        if (data.bans && data.bans.length > 0) {
          setBans(data.bans);
        }
      })
      .catch(() => {});
  }, []);

  const filteredBans = bans.filter((b) =>
    b.player.toLowerCase().includes(search.toLowerCase()) ||
    b.reason.toLowerCase().includes(search.toLowerCase()) ||
    b.id.toLowerCase().includes(search.toLowerCase()) ||
    b.steamHex.toLowerCase().includes(search.toLowerCase())
  );

  const handleUnban = async (banId, player) => {
    setBans((prev) => prev.filter((b) => b.id !== banId));
    onToast?.(`Revoked ban ${banId} for ${player}`);

    try {
      await fetch(`/api/bans?id=${encodeURIComponent(banId)}`, {
        method: 'DELETE'
      });
    } catch {}
  };

  const handleCreateBan = async (e) => {
    e.preventDefault();
    if (!newBanTarget || !newBanReason) return;

    const newBan = {
      id: `BAN-${Math.floor(1000 + Math.random() * 9000)}`,
      player: newBanTarget,
      steamHex: 'steam:1100001' + Math.floor(1000000 + Math.random() * 9000000).toString(16),
      reason: newBanReason,
      admin: 'Maciex (Super Admin)',
      issuedAt: 'Just now',
      duration: newBanDuration.toUpperCase(),
      isPermanent: newBanDuration === 'Permanent'
    };

    setBans([newBan, ...bans]);
    setShowNewBanModal(false);
    setNewBanTarget('');
    setNewBanReason('');
    onToast?.(`Sanction issued: ${newBanTarget} banned (${newBanDuration})`);

    try {
      await fetch('/api/bans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBan)
      });
    } catch {}
  };

  return (
    <div className="anim-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '0 28px 28px' }}>
      {/* gorny banerek */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px'
      }}>
        <div className="panel-card anim-slide-up delay-1" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Active Bans</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--status-danger)', marginTop: '4px' }} className="num-tabular">
            {bans.length} <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 400 }}>in txAdmin banlist</span>
          </div>
        </div>
        <div className="panel-card anim-slide-up delay-2" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Permanent Bans</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#fff', marginTop: '4px' }} className="num-tabular">
            {bans.filter((b) => b.isPermanent).length}
          </div>
        </div>
        <div className="panel-card anim-slide-up delay-3" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Active Warnings</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#fbbf24', marginTop: '4px' }} className="num-tabular">
            {warnings.length} <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 400 }}>points tracked</span>
          </div>
        </div>
        <div className="panel-card anim-slide-up delay-4" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Moderation Status</div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#4ade80', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={15} /> All systems operational
          </div>
        </div>
      </div>

      {/* kontrolki akcji i filtrowania */}
      <div className="panel-card anim-slide-up delay-2" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setActiveSubTab('bans')}
            style={{
              fontSize: '12px',
              fontWeight: activeSubTab === 'bans' ? 600 : 500,
              padding: '6px 12px',
              borderRadius: '5px',
              backgroundColor: activeSubTab === 'bans' ? 'var(--brand-purple)' : 'var(--surface-subtle)',
              color: activeSubTab === 'bans' ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${activeSubTab === 'bans' ? 'var(--brand-purple)' : 'var(--border-subtle)'}`
            }}
          >
            Active Bans ({bans.length})
          </button>
          <button
            onClick={() => setActiveSubTab('warnings')}
            style={{
              fontSize: '12px',
              fontWeight: activeSubTab === 'warnings' ? 600 : 500,
              padding: '6px 12px',
              borderRadius: '5px',
              backgroundColor: activeSubTab === 'warnings' ? 'var(--brand-purple)' : 'var(--surface-subtle)',
              color: activeSubTab === 'warnings' ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${activeSubTab === 'warnings' ? 'var(--brand-purple)' : 'var(--border-subtle)'}`
            }}
          >
            Warnings ({warnings.length})
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* szukajka */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--surface-subtle)',
            border: '1px solid var(--border-primary)',
            borderRadius: '5px',
            padding: '6px 12px',
            minWidth: '240px'
          }}>
            <Search size={14} color="var(--text-muted)" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, name, reason..."
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

          <button
            onClick={() => setShowNewBanModal(true)}
            className="btn-primary"
            style={{ height: '32px' }}
          >
            <Plus size={14} />
            <span>Issue Sanction</span>
          </button>
        </div>
      </div>

      {/* tabela banow */}
      {activeSubTab === 'bans' && (
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
                <th style={{ padding: '12px 18px', width: '100px' }}>BAN ID</th>
                <th style={{ padding: '12px 16px' }}>TARGET PLAYER</th>
                <th style={{ padding: '12px 16px' }}>REASON</th>
                <th style={{ padding: '12px 16px' }}>ISSUED BY</th>
                <th style={{ padding: '12px 16px', width: '130px' }}>DURATION</th>
                <th style={{ padding: '12px 18px', textAlign: 'right', width: '110px' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredBans.map((ban, idx) => (
                <tr
                  key={ban.id}
                  className="interactive-row anim-row-stagger"
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    animationDelay: `${idx * 40}ms`
                  }}
                >
                  <td style={{ padding: '12px 18px', fontFamily: 'var(--font-mono)', fontSize: '11.5px', color: '#c4b5fd' }}>
                    {ban.id}
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 600, color: '#fff' }}>{ban.player}</div>
                    <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {ban.steamHex}
                    </div>
                  </td>

                  <td style={{ padding: '12px 16px', color: '#fca5a5' }}>
                    {ban.reason}
                  </td>

                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                    {ban.admin}
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: ban.isPermanent ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: ban.isPermanent ? '#f87171' : '#fbbf24',
                      border: `1px solid ${ban.isPermanent ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                    }}>
                      {ban.duration}
                    </span>
                  </td>

                  <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleUnban(ban.id, ban.player)}
                      style={{
                        padding: '4px 10px',
                        fontSize: '11.5px',
                        fontWeight: 500,
                        borderRadius: '4px',
                        backgroundColor: 'var(--surface-subtle)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-secondary)',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#fff';
                        e.currentTarget.style.borderColor = 'var(--border-highlight)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--text-secondary)';
                        e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      }}
                    >
                      Unban
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* tabela ostrzezen warnow */}
      {activeSubTab === 'warnings' && (
        <div className="panel-card" style={{ overflow: 'hidden' }}>
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
                <th style={{ padding: '12px 18px' }}>WARN ID</th>
                <th style={{ padding: '12px 16px' }}>PLAYER</th>
                <th style={{ padding: '12px 16px' }}>INFRACTION REASON</th>
                <th style={{ padding: '12px 16px' }}>STAFF MEMBER</th>
                <th style={{ padding: '12px 16px' }}>POINTS</th>
                <th style={{ padding: '12px 18px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {warnings.map((w) => (
                <tr key={w.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '12px 18px', fontFamily: 'var(--font-mono)', color: '#fbbf24' }}>
                    {w.id}
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#fff' }}>
                    {w.player}
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                    {w.reason}
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                    {w.admin}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', fontSize: '11px', fontWeight: 600 }}>
                      {w.activeCount} / 3 Warns
                    </span>
                  </td>
                  <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                    <button
                      onClick={() => {
                        setWarnings((prev) => prev.filter((item) => item.id !== w.id));
                        onToast?.(`Warning dismissed for ${w.player}`);
                      }}
                      className="btn-secondary"
                      style={{ height: '26px', fontSize: '11.5px', padding: '0 8px' }}
                    >
                      Dismiss
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* modal nowej sankcji */}
      {showNewBanModal && (
        <div className="modal-overlay" onClick={() => setShowNewBanModal(false)}>
          <div className="modal-content" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-primary)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'var(--surface-panel)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Gavel size={16} color="var(--status-danger)" />
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>Issue Server Sanction</span>
              </div>
              <button onClick={() => setShowNewBanModal(false)} style={{ color: 'var(--text-muted)' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateBan} style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                  Target Player (Name, ID, or License)
                </label>
                <input
                  type="text"
                  value={newBanTarget}
                  onChange={(e) => setNewBanTarget(e.target.value)}
                  placeholder="e.g. John_Doe or #102"
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
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                  Infraction Reason
                </label>
                <textarea
                  value={newBanReason}
                  onChange={(e) => setNewBanReason(e.target.value)}
                  placeholder="Detail the rule broken, logs, or evidence..."
                  rows={3}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--surface-subtle)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: '5px',
                    padding: '8px 12px',
                    color: '#fff',
                    fontSize: '12.5px',
                    outline: 'none',
                    resize: 'none'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                  Duration
                </label>
                <select
                  value={newBanDuration}
                  onChange={(e) => setNewBanDuration(e.target.value)}
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
                  <option value="Permanent">Permanent</option>
                  <option value="30 Days">30 Days</option>
                  <option value="7 Days">7 Days</option>
                  <option value="3 Days">3 Days</option>
                  <option value="24 Hours">24 Hours</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowNewBanModal(false)}
                  className="btn-secondary"
                  style={{ height: '32px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-danger"
                  style={{ height: '32px', padding: '0 14px' }}
                >
                  Confirm Ban
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
