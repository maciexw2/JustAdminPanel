'use client';

import React, { useState } from 'react';
import {
  X,
  Zap,
  RotateCcw,
  Volume2,
  Trash2,
  Lock,
  Send,
  AlertTriangle,
  Server
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function QuickActionsModal({ isOpen, onClose, onToast, onOpenConsole }) {
  const { t } = useLanguage();
  const [announcement, setAnnouncement] = useState('');
  const [isRestarting, setIsRestarting] = useState(false);

  if (!isOpen) return null;

  const handleSendAnnouncement = (e) => {
    e.preventDefault();
    if (!announcement.trim()) return;
    onToast?.(`Broadcast sent to all 42 players: "${announcement}"`);
    setAnnouncement('');
  };

  const handleRestart = (seconds) => {
    setIsRestarting(true);
    onToast?.(`Scheduled server restart scheduled in ${seconds}s with global broadcast`);
    setTimeout(() => {
      setIsRestarting(false);
      onClose();
    }, 1500);
  };

  const handleClearCache = () => {
    onToast?.(`FXServer cache cleared successfully (184 MB freed)`);
    onClose();
  };

  const handleLockdown = () => {
    onToast?.(`Server lockdown active. Non-whitelisted connections rejected.`);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '540px' }}
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
            <Zap size={16} color="var(--brand-purple)" fill="var(--brand-purple)" />
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>
              {t.modals.quickActions.title}
            </span>
          </div>

          <button
            onClick={onClose}
            style={{ color: 'var(--text-muted)', padding: '4px', borderRadius: '4px' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* zawartosc */}
        <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* ogloszenie globalne */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              {t.modals.quickActions.announcementTitle}
            </label>
            <form onSubmit={handleSendAnnouncement} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                placeholder={t.modals.quickActions.announcementPlaceholder}
                style={{
                  flex: 1,
                  backgroundColor: 'var(--surface-subtle)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '5px',
                  padding: '7px 12px',
                  color: '#fff',
                  fontSize: '12.5px',
                  outline: 'none'
                }}
              />
              <button type="submit" className="btn-primary" style={{ height: '33px' }}>
                <Send size={13} />
                <span>{t.modals.quickActions.sendBroadcast}</span>
              </button>
            </form>
          </div>

          {/* szybkie przyciski komend */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              onClick={() => handleRestart(60)}
              className="btn-secondary"
              style={{ justifyContent: 'flex-start', padding: '10px 14px', height: 'auto', textAlign: 'left' }}
              disabled={isRestarting}
            >
              <RotateCcw size={16} color="#fbbf24" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#fff' }}>{t.modals.quickActions.restartServer} (60s)</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>txAdmin restart</div>
              </div>
            </button>

            <button
              onClick={handleClearCache}
              className="btn-secondary"
              style={{ justifyContent: 'flex-start', padding: '10px 14px', height: 'auto', textAlign: 'left' }}
            >
              <Trash2 size={16} color="#60a5fa" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#fff' }}>{t.modals.quickActions.clearCache}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>FXServer cache</div>
              </div>
            </button>

            <button
              onClick={handleLockdown}
              className="btn-secondary"
              style={{ justifyContent: 'flex-start', padding: '10px 14px', height: 'auto', textAlign: 'left' }}
            >
              <Lock size={16} color="#ef4444" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#fff' }}>{t.modals.quickActions.lockdown}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Whitelist / Staff only</div>
              </div>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenConsole();
              }}
              className="btn-secondary"
              style={{ justifyContent: 'flex-start', padding: '10px 14px', height: 'auto', textAlign: 'left' }}
            >
              <Server size={16} color="var(--brand-purple)" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#fff' }}>{t.modals.quickActions.openConsole}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>FXServer master shell</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
