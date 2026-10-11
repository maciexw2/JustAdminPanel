'use client';

import React, { useState } from 'react';
import {
  X,
  Shield,
  Heart,
  ShieldAlert,
  Wallet,
  Building2,
  MapPin,
  Clock,
  Wifi,
  Gavel,
  UserX,
  Crosshair,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

export default function PlayerInspectModal({ player, isOpen, onClose, onKick, onBan, onToast }) {
  const [banReason, setBanReason] = useState('Cheating / Suspicious lua executor injection');
  const [showBanConfirm, setShowBanConfirm] = useState(false);

  if (!isOpen || !player) return null;

  const handleRevive = () => {
    onToast?.(`Player #${player.id} (${player.name}) has been revived and healed to 100%`);
  };

  const handleTeleport = () => {
    onToast?.(`Teleported admin to ${player.name} (${player.coords})`);
  };

  const handleKickSubmit = () => {
    onKick?.(player.id, 'Violation of server roleplay rules');
    onClose();
  };

  const handleBanSubmit = () => {
    onBan?.(player.id, banReason);
    setShowBanConfirm(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '640px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* naglowek */}
        <div style={{
          padding: '18px 22px',
          borderBottom: '1px solid var(--border-primary)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--surface-panel)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: player.avatarBg,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '15px',
              fontWeight: 700
            }}>
              {player.avatarLetter}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>
                  {player.name}
                </span>
                <span style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)'
                }} className="num-tabular">
                  #{player.id}
                </span>
                {player.tag && (
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '3px',
                    backgroundColor: 'rgba(124, 58, 237, 0.25)',
                    color: '#c4b5fd',
                    border: '1px solid rgba(124, 58, 237, 0.4)'
                  }}>
                    {player.tag}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {player.job}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ color: 'var(--text-muted)', padding: '6px', borderRadius: '4px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* zawartosc */}
        <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* siatka szybkich statystyk */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px'
          }}>
            <div style={{
              backgroundColor: 'var(--surface-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '10px 12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-muted)' }}>
                <Wifi size={13} color="var(--status-success)" />
                <span>Ping</span>
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginTop: '4px' }} className="num-tabular">
                {player.ping}ms
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--surface-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '10px 12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-muted)' }}>
                <Clock size={13} color="#3b82f6" />
                <span>Session</span>
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginTop: '4px' }} className="num-tabular">
                {player.sessionDuration}
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--surface-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '10px 12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-muted)' }}>
                <Wallet size={13} color="#22c55e" />
                <span>Cash</span>
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#4ade80', marginTop: '4px' }} className="num-tabular">
                {player.cash}
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--surface-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '10px 12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-muted)' }}>
                <Building2 size={13} color="#c4b5fd" />
                <span>Bank</span>
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginTop: '4px' }} className="num-tabular">
                {player.bank}
              </div>
            </div>
          </div>

          {/* paski zycia i armora */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '5px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#f87171' }}>
                  <Heart size={13} fill="#ef4444" /> Health
                </span>
                <span style={{ fontWeight: 600, color: '#fff' }} className="num-tabular">{player.health}%</span>
              </div>
              <div style={{ height: '6px', backgroundColor: 'var(--surface-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${player.health}%`, height: '100%', backgroundColor: '#ef4444' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '5px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#60a5fa' }}>
                  <Shield size={13} fill="#3b82f6" /> Armor
                </span>
                <span style={{ fontWeight: 600, color: '#fff' }} className="num-tabular">{player.armor}%</span>
              </div>
              <div style={{ height: '6px', backgroundColor: 'var(--surface-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${player.armor}%`, height: '100%', backgroundColor: '#3b82f6' }} />
              </div>
            </div>
          </div>

          {/* karta identyfikatoruw */}
          <div style={{
            backgroundColor: 'var(--surface-subtle)',
            border: '1px solid var(--border-primary)',
            borderRadius: '6px',
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
              AUTHENTICATION & IDENTIFIERS
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6px', fontSize: '11.5px', fontFamily: 'var(--font-mono)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Steam Hex:</span>
                <span style={{ color: 'var(--text-secondary)' }}>{player.steamHex}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>License:</span>
                <span style={{ color: 'var(--text-secondary)' }}>{player.license}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Location:</span>
                <span style={{ color: 'var(--text-secondary)' }}>{player.coords}</span>
              </div>
            </div>
          </div>

          {/* baner potwierdzenia bana */}
          {showBanConfirm && (
            <div style={{
              backgroundColor: 'var(--status-danger-bg)',
              border: '1px solid var(--status-danger-border)',
              borderRadius: '6px',
              padding: '12px 14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontWeight: 600, fontSize: '13px' }}>
                <AlertTriangle size={16} />
                <span>Confirm Permanent Server Ban</span>
              </div>
              <p style={{ fontSize: '12px', color: '#fca5a5', marginTop: '4px' }}>
                Player {player.name} will be immediately disconnected and added to txAdmin banlist.
              </p>
              <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleBanSubmit}
                  className="btn-danger"
                  style={{ height: '30px' }}
                >
                  Confirm Ban
                </button>
                <button
                  onClick={() => setShowBanConfirm(false)}
                  className="btn-secondary"
                  style={{ height: '30px' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* pasek akcji */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '8px',
            borderTop: '1px solid var(--border-subtle)',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handleRevive} className="btn-secondary" style={{ fontSize: '12px', height: '32px' }}>
                <Sparkles size={13} color="#22c55e" />
                <span>Revive / Heal</span>
              </button>
              <button onClick={handleTeleport} className="btn-secondary" style={{ fontSize: '12px', height: '32px' }}>
                <Crosshair size={13} color="#3b82f6" />
                <span>Teleport</span>
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleKickSubmit}
                className="btn-secondary"
                style={{ fontSize: '12px', height: '32px', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.3)' }}
              >
                <UserX size={13} />
                <span>Kick</span>
              </button>
              <button
                onClick={() => setShowBanConfirm(true)}
                className="btn-danger"
                style={{ fontSize: '12px', height: '32px' }}
              >
                <Gavel size={13} />
                <span>Ban</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
