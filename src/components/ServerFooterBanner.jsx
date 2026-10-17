'use client';

import React, { useState } from 'react';
import { Server, Terminal, Copy, Check } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function ServerFooterBanner({ serverInfo, onOpenConsole, onToast }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText?.(serverInfo.endpoint);
    setCopied(true);
    onToast?.(`${t.footer.copied} (${serverInfo.endpoint})`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="anim-slide-up delay-4" style={{
      margin: '0 28px 28px',
      backgroundColor: 'var(--surface-panel)',
      border: '1px solid var(--border-primary)',
      borderRadius: '8px',
      padding: '14px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      flexWrap: 'wrap'
    }}>
      {/* lewa strona: detale silnika */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '6px',
          backgroundColor: 'var(--surface-subtle)',
          border: '1px solid var(--border-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#c4b5fd'
        }}>
          <Server size={18} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>
              {t.footer.engine}
            </span>
            <span style={{
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              color: '#d4d4d8',
              backgroundColor: 'var(--surface-subtle)',
              padding: '2px 6px',
              borderRadius: '4px',
              border: '1px solid var(--border-subtle)'
            }}>
              {serverInfo.version}
            </span>
          </div>

          <div style={{
            fontSize: '11.5px',
            color: 'var(--text-muted)',
            marginTop: '3px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>{t.footer.endpoint} <strong style={{ color: 'var(--text-secondary)' }}>{serverInfo.endpoint}</strong></span>
            <span>·</span>
            <span>txAdmin {serverInfo.txAdminVersion}</span>
            <span>·</span>
            <span>{serverInfo.oneSync}</span>
          </div>
        </div>
      </div>

      {/* prawa strona: akcjie */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={handleCopy}
          className="btn-secondary"
          style={{ height: '32px', fontSize: '12px' }}
        >
          {copied ? <Check size={13} color="var(--status-success)" /> : <Copy size={13} />}
          <span>{copied ? t.footer.copied : t.footer.copyEndpoint}</span>
        </button>

        <button
          onClick={onOpenConsole}
          className="btn-primary"
          style={{ height: '32px', fontSize: '12px' }}
        >
          <Terminal size={13} />
          <span>{t.footer.quickConsole}</span>
        </button>
      </div>
    </div>
  );
}
